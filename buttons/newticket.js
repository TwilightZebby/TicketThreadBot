// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');

// THE MODALS
const TicketGeneralModal = new Discord.Modal().setCustomId(`general-ticket`).setTitle("Create General Ticket").addComponents(
    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId(`initial-message`).setLabel("What would you like help with?").setMaxLength(4000).setMinLength(1).setRequired(true).setStyle('PARAGRAPH') )
);
const TicketReportModal = new Discord.Modal().setCustomId(`report-ticket`).setTitle("Create User Report Ticket").addComponents(
    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId(`server-member`).setLabel("Which Server Member are you reporting?").setMaxLength(50).setMinLength(1).setRequired(true).setStyle('SHORT') ),
    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId(`report-reason`).setLabel("Reason for report").setMaxLength(4000).setMinLength(1).setRequired(true).setStyle('PARAGRAPH') )
);
const TicketMonthlyRoleModal = new Discord.Modal().setCustomId(`monthly-role-ticket`).setTitle("Claim Monthly Role").addComponents(
    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId(`role-name`).setLabel("What is the Role name you would like").setMaxLength(50).setMinLength(1).setRequired(true).setStyle('SHORT') ),
    new Discord.MessageActionRow().addComponents( new Discord.TextInputComponent().setCustomId(`role-colour`).setLabel("What is the Role colour you would like").setMaxLength(50).setMinLength(1).setRequired(true).setStyle('SHORT') )
);




module.exports = {
    // Button's Name, used as start of its Custom ID
    name: 'newticket',
    // Button's description, purely for documentation
    description: `Triggers the start of the Ticket creation process`,

    // Button's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 3,



    /**
     * Main function that runs this Button
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction Button Interaction
     */
    async execute(buttonInteraction)
    {
        // Grab ticket type
        const splitCustomId = buttonInteraction.customId.split("_");
        const ticketType = splitCustomId.pop();

        switch(ticketType)
        {
            case "general":
                return await buttonInteraction.showModal(TicketGeneralModal);

            case "report":
                return await buttonInteraction.showModal(TicketReportModal);

            case "monthly-role":
                return await buttonInteraction.showModal(TicketMonthlyRoleModal);

            case "application":
                // Contruct Select Menu, with correct statuses
                const ApplicationStatuses = require('../jsonFiles/applicationStatuses.json');

                const RoleApplicationSelect = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageSelectMenu().setCustomId(`role-applications`).setMaxValues(1).setMinValues(1).setPlaceholder("Select Role to apply for").setOptions(
                        { label: "Helper", value: "helper", description: "The first step on becoming a Moderation Staff Member", emoji: ApplicationStatuses["helper"] ? `✅` : `❌` },
                        { label: "Twitch Streamer", value: "twitch", description: "Peeps who regularly stream on Twitch", emoji: ApplicationStatuses["twitch"] ? `✅` : `❌` },
                        { label: "YouTuber", value: "youtube", description: "Peeps who regularly upload or stream on YouTube", emoji: ApplicationStatuses["youtube"] ? `✅` : `❌` },
                        { label: "Artist", value: "artist", description: "For those who make high-quality art of any kind", emoji: ApplicationStatuses["artist"] ? `✅` : `❌` },
                        { label: "Musician", value: "musician", description: "For those who make high-quality music", emoji: ApplicationStatuses["musician"] ? `✅` : `❌` },
                        { label: "Minecraft Server", value: "minecraft", description: "For those who want to join our Minecraft Server", emoji: ApplicationStatuses["minecraft"] ? `✅` : `❌` }
                    )
                );

                // Send for User to be able to choose
                return await buttonInteraction.reply({ ephemeral: true, components: [RoleApplicationSelect],
                    content: `Please select which Role you would like to apply for, using the Select Menu below.
Open applications are denoted with ✅
While closed applications are shown with ❌`
                });

            default:
                return await buttonInteraction.reply({ content: CONSTANTS.errorMessages.BUTTON_GENERIC_FAILED, ephemeral: true })
        }
    }
};
