const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, ModalMessageModalSubmitInteraction, TextChannel, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, Colors, UserSelectMenuInteraction, UserSelectMenuBuilder } = require("discord.js");
const { StaffRoleID } = require('../../config.js');

/** Model for User to describe their Ticket */
const TicketModel = new ModalBuilder().setCustomId(`report-ticket`).setTitle(`Report a Member`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`report-reason`).setLabel(`Why do you want to report this Member?`).setMaxLength(4000).setMinLength(25).setRequired(true).setStyle(TextInputStyle.Paragraph) ])
]);

const ReportUserSelectMenu = new ActionRowBuilder().addComponents([ new UserSelectMenuBuilder().setCustomId(`report-user-select`).setMinValues(1).setMaxValues(1).setPlaceholder("Search for a Member") ]);

module.exports = {
    /**
     * Shows a Modal for the User to input why they want to open the Ticket
     * @param {UserSelectMenuInteraction} selectInteraction 
     */
    async promptUser(selectInteraction)
    {
        // Ensure User didn't select themselves
        const SelectedUser = selectInteraction.users.first();
        if ( selectInteraction.user.id === SelectedUser.id )
        {
            await selectInteraction.update({ content: `Please use the Select Menu attached to this Message to choose which Server Member you want to report to our Moderation Staff Team:

⚠ *You cannot report yourself! Please choose another Member to report.*` });
            return;
        }

        // Also make sure selected User isn't a Bot
        if ( SelectedUser.bot )
        {
            await selectInteraction.update({ content: `Please use the Select Menu attached to this Message to choose which Server Member you want to report to our Moderation Staff Team:

⚠ *You cannot report a Bot! Please choose another Member to report.*` });
            return;
        }

        // Attach selected User ID into custom ID of Modal for ease in transfering that data between methods
        let newTicketModal = TicketModel.setCustomId(`report-ticket_${SelectedUser.id}`);

        await selectInteraction.showModal(newTicketModal);
        return;
    },




    /**
     * Shows a User Select for the User to select who to report
     * @param {ButtonInteraction} buttonInteraction 
     */
    async promptMemberSelect(buttonInteraction)
    {
        await buttonInteraction.reply({ ephemeral: true, components: [ReportUserSelectMenu], content: `Please use the Select Menu attached to this Message to choose which Server Member you want to report to our Moderation Staff Team:` });
        return;
    },




    /**
     * Creates a Private Thread to be used as the Ticket
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async create(modalInteraction)
    {
        // Defer because creating a whole Thread will not be done in the span of 3 seconds
        await modalInteraction.deferUpdate({ ephemeral: true });
        const now = new Date();
        /** @type {TextChannel} */
        const SourceChannel = modalInteraction.channel;
        const SelectedUserId = modalInteraction.customId.split("_").pop();
        const SelectedMember = await modalInteraction.guild.members.fetch(SelectedUserId);

        // Create Thread for Ticket
        await SourceChannel.threads.create({
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            name: `${modalInteraction.user.username} - Member Report - ${now.getDate()}.${now.getMonth() + 1}`,
            reason: `New Member Report opened by ${modalInteraction.user.username}#${modalInteraction.user.discriminator} (ID: ${modalInteraction.user.id})`
        })
        .then(async (TicketThread) => {
            
            // Initial Message, from Bot
            const InitialBotMessage = new EmbedBuilder().setTitle(`New Report Opened`)
            .addFields(
                { name: `Report Creator:`, value: `${modalInteraction.user.tag} (<@${modalInteraction.user.id}>)` },
                { name: `Ticket Type:`, value: `Report` },
                { name: `Member Being Reported:`, value: `${SelectedMember.user.tag} (<@${SelectedMember.id}> - User ID: \`${SelectedMember.id}\`)` },
                { name: `\u200B`, value: `The Staff Team are notified of the creation of this Report, and will be investigating as soon as they can.\nWhile you're waiting for a response, if you have anything else to add, please do so below your initial reason.` }
            )
            .setColor(Colors.Red);

            // Initial Message, from User
            const InitialUserMessage = new EmbedBuilder().setTitle(`Initial Report reason from Report Creator:`)
            .setDescription(modalInteraction.fields.getTextInputValue('report-reason'))
            .setColor(Colors.DarkRed);

            // Send initial messages (pinging Server Staff into Thread due to it being a Report)
            await TicketThread.send({ embeds: [InitialBotMessage, InitialUserMessage], content: `<@&${StaffRoleID}>` })
            .then(async (message) => {
                // Add Ticket Creator to Thread
                await TicketThread.members.add(modalInteraction.user.id, `Adding Report Creator to their Ticket's Thread`);
            })
            .catch(async (err) => {
                //console.error(err);
            });

            // ACK back to Interaction
            await modalInteraction.editReply({ components: [], content: `Your Member Report has been created. You can find it here -> <#${TicketThread.id}> (or by using the Threads Button at the top of this Channel).` });

        })
        .catch(async (err) => {
            //console.error(err);
            await modalInteraction.editReply({ components: [], content: `Sorry, an error occurred while trying to make your Member Report.` });
        });

        return;
    }
}
