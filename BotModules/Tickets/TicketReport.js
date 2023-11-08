const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, ModalMessageModalSubmitInteraction, TextChannel, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, Colors, UserSelectMenuInteraction, UserSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, StringSelectMenuInteraction } = require("discord.js");
const { StaffRoleID, ReportLogChannelID } = require('../../config.js');

/** Model for User to describe their Ticket */
const TicketModel = new ModalBuilder().setCustomId(`report-ticket`).setTitle(`Report a Member`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`report-reason`).setLabel(`Why do you want to report this Member?`).setMaxLength(4000).setMinLength(25).setRequired(true).setStyle(TextInputStyle.Paragraph) ])
]);

const ReportUserSelectMenu = new ActionRowBuilder().addComponents([ new UserSelectMenuBuilder().setCustomId(`report-user-select`).setMinValues(1).setMaxValues(1).setPlaceholder("Search for a Member") ]);

module.exports = {
    /**
     * Shows a Modal for the User to input why they want to open the Ticket
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async promptUser(selectInteraction)
    {
        // Fetch User & Report Type
        const ReportedUserId = selectInteraction.customId.split("_").pop();
        const SelectedTypes = selectInteraction.values;
        let formattedTypes = SelectedTypes.join("-");

        // Attach selected User ID & Report Type into custom ID of Modal for ease in transfering that data between methods
        let newTicketModal = TicketModel.setCustomId(`report-ticket_${formattedTypes}_${ReportedUserId}`);

        await selectInteraction.showModal(newTicketModal);
        return;
    },




    /**
     * Shows a String Select for the User to select what type(s) of Report this is
     * @param {UserSelectMenuInteraction} selectInteraction 
     */
    async promptReportType(selectInteraction)
    {
        // Grab User selected
        const UserSelected = selectInteraction.users.first();

        // Ensure User didn't select themselves
        if ( selectInteraction.user.id === UserSelected.id )
        {
            await selectInteraction.update({ components: [ReportUserSelectMenu], content: `Please use the Select Menu attached to this Message to choose which Server Member you want to report to our Moderation Staff Team:

⚠ *You cannot report yourself! Please choose another Member to report.*` });
            return;
        }

        // Also make sure selected User isn't a Bot
        if ( UserSelected.bot )
        {
            await selectInteraction.update({ components: [ReportUserSelectMenu], content: `Please use the Select Menu attached to this Message to choose which Server Member you want to report to our Moderation Staff Team:

⚠ *You cannot report a Bot Account! Please choose another Member to report.*` });
            return;
        }


        // Prompt for Report Type
        let typeSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`report-type-select_${UserSelected.id}`).setMinValues(1).setMaxValues(4).setPlaceholder("Select Report Type(s)").addOptions([
                new StringSelectMenuOptionBuilder().setLabel(`Harrassment`).setValue(`harrassment`),
                new StringSelectMenuOptionBuilder().setLabel(`Advertising`).setValue(`advertising`),
                new StringSelectMenuOptionBuilder().setLabel(`Spamming`).setValue(`spamming`),
                new StringSelectMenuOptionBuilder().setLabel(`Other`).setValue(`other`)
            ])
        ]);

        await selectInteraction.update({ components: [typeSelect], content: `*Selected Member to Report:* <@${UserSelected.id}> ( ${UserSelected.username} )\n\nPlease use the Select Menu attached to choose which type(s) of Report you want to open.\nYou can pick either one or multiple types that are relevant to what you want to report.` });
        return;
    },




    /**
     * Shows a User Select for the User to select who to report
     * @param {ButtonInteraction} buttonInteraction 
     */
    async promptMemberSelect(buttonInteraction)
    {
        await buttonInteraction.reply({ ephemeral: true, components: [ReportUserSelectMenu], content: `Please use the Select Menu attached to this Message to choose which Server Member you want to report to our Moderation Staff Team:\n\n*(Note: the dropdown is also a search bar, you can type in it to quickly search for the Member in question)*` });
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

        const SplitCustomId = modalInteraction.customId.split("_");

        const now = new Date();
        /** @type {TextChannel} */
        const SourceChannel = modalInteraction.channel;
        const SelectedUserId = SplitCustomId.pop();
        const SelectedMember = await modalInteraction.guild.members.fetch(SelectedUserId);
        const SelectedReportTypes = SplitCustomId.pop();

        // Create Thread for Ticket
        await SourceChannel.threads.create({
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            invitable: false,
            name: `${modalInteraction.user.username} - Member Report - ${now.getDate()}.${now.getMonth() + 1}`,
            reason: `New Member Report opened by ${modalInteraction.user.username} (ID: ${modalInteraction.user.id})`
        })
        .then(async (TicketThread) => {
            
            // Initial Message, from Bot
            const InitialBotMessage = new EmbedBuilder().setTitle(`New Report Opened`)
            .addFields(
                { name: `Report Creator:`, value: `${modalInteraction.user.username} (<@${modalInteraction.user.id}>)` },
                { name: `Member Being Reported:`, value: `${SelectedMember.user.username} (<@${SelectedMember.id}> - User ID: \`${SelectedMember.id}\`)` },
                { name: `Ticket Type:`, value: `Report` },
                { name: `Report Type(s):`, value: `${SelectedReportTypes.split("-").join(", ")}` },
                { name: `\u200B`, value: `The Staff Team are notified of the creation of this Report, and will be investigating as soon as they can.\nWhile you're waiting for a response, if you have anything else to add, please do so below your initial reason.` }
            )
            .setColor(Colors.Red);

            // Initial Message, from User
            const InputtedReason = modalInteraction.fields.getTextInputValue('report-reason');
            const InitialUserMessage = new EmbedBuilder().setTitle(`Initial Report reason from Report Creator:`)
            .setDescription(InputtedReason)
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


            // Log to Staff Logging Channel for Reports
            /** @type {TextChannel} */
            const ReportLogChannel = await modalInteraction.guild.channels.fetch(ReportLogChannelID);
            const ReportLogEmbed = new EmbedBuilder().setColor(Colors.Red)
            .setTitle(`New Member Report Opened`)
            .addFields(
                { name: `Report Creator`, value: `${modalInteraction.user.username} (<@${modalInteraction.user.id}> - User ID: \`${modalInteraction.user.id}\`)` },
                { name: `Member Being Reported:`, value: `${SelectedMember.user.username} (<@${SelectedMember.id}> - User ID: \`${SelectedMember.id}\`)` },
                { name: `Report Type(s):`, value: `${SelectedReportTypes.split("-").join(", ")}` },
                { name: `Report Ticket:`, value: `Thread Mention: <#${TicketThread.id}>\nThread Link: ${TicketThread.url}` },
                { name: `Initial Reason:`, value: InputtedReason.length > 1900 ? `${InputtedReason.slice(0, 1900)}...` : `${InputtedReason}` }
            );

            await ReportLogChannel.send({ embeds: [ReportLogEmbed], allowedMentions: { parse: [] } });

        })
        .catch(async (err) => {
            //console.error(err);
            await modalInteraction.editReply({ components: [], content: `Sorry, an error occurred while trying to make your Member Report.` });
        });

        return;
    }
}
