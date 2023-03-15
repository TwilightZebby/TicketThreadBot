const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, ModalMessageModalSubmitInteraction, TextChannel, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, Colors } = require("discord.js");
const { StaffRoleID } = require('../../config.js');

/** Model for User to describe their Ticket */
const TicketModel = new ModalBuilder().setCustomId(`monthly-role-ticket`).setTitle(`Claim Monthly Role`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`role-name`).setLabel(`What would you like to name your Role?`).setMaxLength(50).setMinLength(1).setRequired(true).setStyle(TextInputStyle.Short) ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`role-color`).setLabel(`What Role colour would you like?`).setMaxLength(50).setMinLength(1).setRequired(true).setStyle(TextInputStyle.Short) ])
]);

module.exports = {
    /**
     * Shows a Modal for the User to input why they want to open the Ticket
     * @param {ButtonInteraction} buttonInteraction 
     */
    async promptUser(buttonInteraction)
    {
        await buttonInteraction.showModal(TicketModel);
        return;
    },




    /**
     * Creates a Private Thread to be used as the Ticket
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async create(modalInteraction)
    {
        // Defer because creating a whole Thread will not be done in the span of 3 seconds
        await modalInteraction.deferReply({ ephemeral: true });
        const now = new Date();
        const InputRoleName = modalInteraction.fields.getTextInputValue('role-name');
        const InputRoleColor = modalInteraction.fields.getTextInputValue('role-color');
        /** @type {TextChannel} */
        const SourceChannel = modalInteraction.channel;

        // Create Thread for Ticket
        await SourceChannel.threads.create({
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            name: `${modalInteraction.user.username} - Monthly Role Ticket - ${now.getDate()}.${now.getMonth() + 1}`,
            reason: `New Ticket created by ${modalInteraction.user.username}#${modalInteraction.user.discriminator} (ID: ${modalInteraction.user.id})`
        })
        .then(async (TicketThread) => {
            
            // Initial Message, from Bot, along with requested Role details
            const InitialBotMessage = new EmbedBuilder().setTitle(`New Ticket Created`)
            .addFields(
                { name: `Ticket Creator:`, value: `${modalInteraction.user.tag} (<@${modalInteraction.user.id}>)` },
                { name: `Ticket Type:`, value: `Monthly Role` },
                { name: `Requested Name:`, value: InputRoleName, inline: true },
                { name: `Requested Colour:`, value: InputRoleColor, inline: true },
                { name: `\u200B`, value: `The Staff Team are notified of the creation of this Ticket, and will be responding as soon as they can.` }
            )
            .setColor(Colors.Aqua);

            // Send initial messages
            await TicketThread.send({ embeds: [InitialBotMessage] })
            .then(async (message) => {
                // Add Ticket Creator to Thread
                await TicketThread.members.add(modalInteraction.user.id, `Adding Ticket Creator to their Ticket's Thread`);

                // Add Staff Team to Thread via a ping in edited message (no notif method)
                await message.edit({ content: `<@&${StaffRoleID}>` });
            })
            .catch(async (err) => {
                //console.error(err);
            });

            // ACK back to Interaction
            await modalInteraction.editReply({ content: `Your Monthly Role Ticket has been created! You can find it here -> <#${TicketThread.id}> (or by using the Threads Button at the top of this Channel!)` });

        })
        .catch(async (err) => {
            //console.error(err);
            await modalInteraction.editReply({ content: `Sorry, an error occurred while trying to make your Monthly Role Ticket.` });
        });

        return;
    }
}
