const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, ModalMessageModalSubmitInteraction, TextChannel, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, Colors } = require("discord.js");
const { StaffRoleID } = require('../../config.js');

/** Model for User to describe their Ticket */
const TicketModel = new ModalBuilder().setCustomId(`general-ticket`).setTitle(`Create General Ticket`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`initial-message`).setLabel(`What would you like help with?`).setMaxLength(4000).setMinLength(25).setRequired(true).setStyle(TextInputStyle.Paragraph) ])
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
        /** @type {TextChannel} */
        const SourceChannel = modalInteraction.channel;

        // Create Thread for Ticket
        await SourceChannel.threads.create({
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            name: `${modalInteraction.user.username} - General Ticket - ${now.getDate()}.${now.getMonth() + 1}`,
            reason: `New Ticket created by ${modalInteraction.user.tag} (ID: ${modalInteraction.user.id})`
        })
        .then(async (TicketThread) => {
            
            // Initial Message, from Bot
            const InitialBotMessage = new EmbedBuilder().setTitle(`New Ticket Created`)
            .addFields(
                { name: `Ticket Creator:`, value: `${modalInteraction.user.tag} (<@${modalInteraction.user.id}>)` },
                { name: `Ticket Type:`, value: `General` },
                { name: `\u200B`, value: `The Staff Team are notified of the creation of this Ticket, and will be responding as soon as they can.\nIn the meantime, if you have anythiing else to add, please do so below your initial message!` }
            )
            .setColor(Colors.Aqua);

            // Initial Message, from User
            const InitialUserMessage = new EmbedBuilder().setTitle(`Initial Message from Ticket Creator:`)
            .setDescription(modalInteraction.fields.getTextInputValue('initial-message'))
            .setColor(Colors.DarkAqua);

            // Send initial messages
            await TicketThread.send({ embeds: [InitialBotMessage, InitialUserMessage] })
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
            await modalInteraction.editReply({ content: `Your General Ticket has been created! You can find it here -> <#${TicketThread.id}> (or by using the Threads Button at the top of this Channel!)` });

        })
        .catch(async (err) => {
            //console.error(err);
            await modalInteraction.editReply({ content: `Sorry, an error occurred while trying to make your General Ticket.` });
        });

        return;
    }
}
