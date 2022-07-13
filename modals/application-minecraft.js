// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

module.exports = {
    // Modal's Name, used as start of its Custom ID
    name: 'application-minecraft',
    // Modal's description, purely for documentation
    description: `Collects the Minecraft Server Whitelist Application`,



    /**
     * Main function that runs this modal
     * 
     * @param {Discord.ModalSubmitInteraction} modalInteraction Modal Interaction
     */
    async execute(modalInteraction)
    {
        await modalInteraction.deferUpdate();
        const now = new Date();
        const minecraftApplicationUsername = modalInteraction.fields.getTextInputValue("minecraft-username");
        const minecraftApplicationReason = modalInteraction.fields.getTextInputValue("whitelist-reason");

        // Just to VSC is nice to me
        if ( modalInteraction.channel instanceof Discord.TextChannel )
        {
            // Create Thread for Ticket
            const ticketThread = await modalInteraction.channel.threads.create({
                type: modalInteraction.guild.premiumTier === "NONE" || modalInteraction.guild.premiumTier === "TIER_1" ? 'GUILD_PUBLIC_THREAD' : 'GUILD_PRIVATE_THREAD',
                autoArchiveDuration: 10080,
                name: `${modalInteraction.user.username} Minecraft Application ${now.getDate()}.${now.getMonth() + 1}`,
                reason: `New Application created by ${modalInteraction.user.username}#${modalInteraction.user.discriminator}`
            });

            // Initial Message, from Bot
            const initialEmbed = new Discord.MessageEmbed().setTitle(`New Application created`)
            .setDescription(`**Application Creator:** ${modalInteraction.user.username}#${modalInteraction.user.discriminator} ( <@${modalInteraction.user.id}> )
**Application Type:** \`Minecraft Server Whitelist\`

This Server's Staff Team is aware of the creation of this Application, and will be responding as soon as they've reviewed it. In the meantime, if you have anything else to add, please do so below!`)
            .setColor('AQUA');

            // Extra Embed, for Application inputs
            const applicationEmbed = new Discord.MessageEmbed().setTitle(`Why would you like to be Whitelisted?`)
            .setDescription(minecraftApplicationReason)
            .addFields({ name: `Minecraft Username:`, value: minecraftApplicationUsername })
            .setColor('AQUA');

            await ticketThread.send({
                allowedMentions: { parse: [] }, embeds: [initialEmbed, applicationEmbed]
            });

            // Add Thread Member(s)
            await ticketThread.members.add(modalInteraction.user.id, `Adding Application Creator to their Application's Thread`);

            await modalInteraction.editReply({
                components: [], content: `Your Minecraft Server Whitelist Application has been created! You can find it here ( <#${ticketThread.id}> ) or by using the Threads button at the top of the Channel!`
            });
        }
    }
};
