const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction, ModalMessageModalSubmitInteraction, TextChannel, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, Colors } = require("discord.js");
const { StaffRoleID } = require('../../config.js');

/** Model for User to describe their Ticket */
const TicketModel = new ModalBuilder().setCustomId(`general-ticket`).setTitle(`Create Bug Report`).addComponents([
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`bug-summary`).setLabel(`Summary of Bug`).setMaxLength(150).setRequired(true).setStyle(TextInputStyle.Short).setPlaceholder("A short 1 sentence summary of what the bug is") ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`reproduction-steps`).setLabel(`Reproduction Steps`).setMaxLength(2000).setRequired(true).setStyle(TextInputStyle.Paragraph).setPlaceholder("Steps of what to do to reproduce/repeat the bug") ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`expected-result`).setLabel(`Expected Result`).setMaxLength(200).setRequired(true).setStyle(TextInputStyle.Short).setPlaceholder("What should have happened (if the bug didn't exist)?") ]),
    new ActionRowBuilder().addComponents([ new TextInputBuilder().setCustomId(`actual-result`).setLabel(`Actual Result`).setMaxLength(200).setRequired(true).setStyle(TextInputStyle.Short).setPlaceholder("What actually happened") ])
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
            name: `${modalInteraction.user.username} - Bug Report - ${now.getDate()}.${now.getMonth() + 1}`,
            reason: `New Bug Report created by ${modalInteraction.user.username} (ID: ${modalInteraction.user.id})`
        })
        .then(async (TicketThread) => {
            
            // Initial Message, from Bot
            const InitialBotMessage = new EmbedBuilder().setTitle(`New Ticket Created`)
            .addFields(
                { name: `Ticket Creator:`, value: `${modalInteraction.user.username} (<@${modalInteraction.user.id}>)` },
                { name: `Ticket Type:`, value: `Bug Report` },
                { name: `\u200B`, value: `Dr1fterX & Zebby are notified of the creation of this Bug Report, and will be responding as soon as they can.\nIn the meantime, if you have anythiing else to add, please do so below your initial message!` }
            )
            .setColor(Colors.Aqua);

            // Initial Message, from User
            const InitialUserMessage = new EmbedBuilder().setTitle(`Bug Report:`)
            .setColor(Colors.DarkAqua)
            .addFields(
                { name: `Summary:`, value: modalInteraction.fields.getTextInputValue('bug-summary') },
                { name: `Reproduction Steps:`, value: modalInteraction.fields.getTextInputValue('reproduction-steps') },
                { name: `Expected Result:`, value: modalInteraction.fields.getTextInputValue('expected-result') },
                { name: `Actual Result:`, value: modalInteraction.fields.getTextInputValue('actual-result') }
            );

            // Send initial messages
            await TicketThread.send({ embeds: [InitialBotMessage, InitialUserMessage] })
            .then(async (message) => {
                // Add Ticket Creator to Thread
                await TicketThread.members.add(modalInteraction.user.id, `Adding Bug Report Creator to their Ticket's Thread`);

                // Add Dr1fterX & Zebby to Thread via a ping in edited message (no notif method)
                await message.edit({ content: `<@136391162876395520> <@156482326887530498>` });
            })
            .catch(async (err) => {
                //console.error(err);
            });

            // ACK back to Interaction
            await modalInteraction.editReply({ content: `Your Bug Report has been created! You can find it here -> <#${TicketThread.id}> (or by using the Threads Button at the top of this Channel!)` });

        })
        .catch(async (err) => {
            //console.error(err);
            await modalInteraction.editReply({ content: `Sorry, an error occurred while trying to make your Bug Report.` });
        });

        return;
    }
}
