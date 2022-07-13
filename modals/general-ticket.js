// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'general-ticket',
    // Modal's description, purely for documentation
    description: `Opens a General Ticket`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        await modalInteraction.deferReply({ ephemeral: true });
        const now = new Date();

        // Just so VSC is nice to me
        if ( modalInteraction.channel instanceof Discord.TextChannel )
        {
            // Create Thread for Ticket
            const ticketThread = await modalInteraction.channel.threads.create({
                type: modalInteraction.guild.premiumTier === "NONE" || modalInteraction.guild.premiumTier === "TIER_1" ? 'GUILD_PUBLIC_THREAD' : 'GUILD_PRIVATE_THREAD',
                autoArchiveDuration: 10080,
                name: `${modalInteraction.user.username} General Ticket ${now.getDate()}.${now.getMonth() + 1}`,
                reason: `New Ticket created by ${modalInteraction.user.username}#${modalInteraction.user.discriminator}`
            });

            // Initial Message, from Bot
            const initialEmbed = new Discord.MessageEmbed().setTitle(`New Ticket created`)
            .setDescription(`**Ticket Creator:** ${modalInteraction.user.username}#${modalInteraction.user.discriminator} ( <@${modalInteraction.user.id}> )
**Ticket Type:** \`General\`

This Server's Staff Team is aware of the creation of this Ticket, and will be responding as soon as they can. In the meantime, if you have anything else to add, please do so below your initial message!

__Initial Message from Ticket Creator displayed below:__`)
            .setColor('AQUA');

            await ticketThread.send({
                allowedMentions: { parse: [] }, embeds: [initialEmbed]
            });

            // Repost User's initial message from Modal
            const initialUserMessage = modalInteraction.fields.getTextInputValue('initial-message');
            await ticketThread.send({
                allowedMentions: { parse: [] }, flags: 'SUPPRESS_EMBEDS', content: initialUserMessage
            });

            // Add Thread Member(s)
            await ticketThread.members.add(modalInteraction.user.id, `Adding Ticket Creator to their Ticket's Thread`);

            await modalInteraction.editReply({
                ephemeral: true, content: `Your General Ticket has been created! You can find it here ( <#${ticketThread.id}> ) or by using the Threads button at the top of the Channel!`
            });
        }

        return;
    }
};
