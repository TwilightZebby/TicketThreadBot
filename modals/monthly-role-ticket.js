// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'monthly-role-ticket',
    // Modal's description, purely for documentation
    description: `Opens a Claim Monthly Role Ticket`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        await modalInteraction.deferReply({ ephemeral: true });

        const now = new Date();
        const requestedRoleName = modalInteraction.fields.getTextInputValue('role-name');
        const requestedRoleColour = modalInteraction.fields.getTextInputValue('role-colour');

        // Just so VSC is nice to me
        if ( modalInteraction.channel instanceof Discord.TextChannel )
        {
            // Create Thread for Ticket
            const ticketThread = await modalInteraction.channel.threads.create({
                type: modalInteraction.guild.premiumTier === "NONE" || modalInteraction.guild.premiumTier === "TIER_1" ? 'GUILD_PUBLIC_THREAD' : 'GUILD_PRIVATE_THREAD',
                autoArchiveDuration: 10080,
                name: `${modalInteraction.user.username} Monthly Role Ticket ${now.getDate()}.${now.getMonth() + 1}`,
                reason: `New Ticket created by ${modalInteraction.user.username}#${modalInteraction.user.discriminator}`
            });

            // Initial Message, from Bot
            const initialEmbed = new Discord.MessageEmbed().setTitle(`New Ticket created`)
            .setDescription(`**Ticket Creator:** ${modalInteraction.user.username}#${modalInteraction.user.discriminator} ( <@${modalInteraction.user.id}> )
**Ticket Type:** \`Claim Monthly Role\`
**Requested Role Name:** ${requestedRoleName}
**Requested Role Colour:** ${requestedRoleColour}

This Server's Staff Team is aware of the creation of this Ticket, and will be responding as soon as they can!`)
            .setColor('AQUA');

            await ticketThread.send({
                allowedMentions: { parse: [] }, embeds: [initialEmbed]
            });

            // Add Thread Member(s)
            await ticketThread.members.add(modalInteraction.user.id, `Adding Ticket Creator to their Ticket's Thread`);

            await modalInteraction.editReply({
                ephemeral: true, content: `Your Monthly Role Ticket has been created! You can find it here ( <#${ticketThread.id}> ) or by using the Threads button at the top of the Channel!`
            });
        }

        return;
    }
};
