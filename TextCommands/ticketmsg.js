const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { DiscordClient, Collections } = require("../constants.js");

// Button Menus
const StartTicketButtonsRow1 = new ActionRowBuilder().addComponents([
    new ButtonBuilder().setCustomId(`newticket_general`).setEmoji(`<:LukeWat:662716296626044958>`).setLabel(`General`).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`newticket_application`).setEmoji(`📝`).setLabel(`Application`).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`newticket_monthly-role`).setEmoji(`🏆`).setLabel(`Monthly Role`).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`newticket_bug-report`).setEmoji(`🐛`).setLabel(`Bug Report`).setStyle(ButtonStyle.Primary)
]);

const StartTicketButtonsRow2 = new ActionRowBuilder().addComponents([
    new ButtonBuilder().setCustomId(`newticket_report`).setEmoji(`⚠`).setLabel(`Report`).setStyle(ButtonStyle.Danger)
]);


module.exports = {
    // Command's Name
    //     Use camelCase or full lowercase
    Name: "ticketmsg",

    // Command's Description
    Description: `Creates & sends the message explaining how to use the Ticket System, and the buttons for creating Tickets`,

    // Command's Category
    Category: "TICKET",

    // Alias(es) of Command, if any
    Alias: [ "ticketmessage", "tmsg" ],

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 300,

    // Scope of Command's usage
    //     One of the following: DM, GUILD
    Scope: "GUILD",

    // Are arguments required?
    ArgumentsRequired: false,

    // Minimum amount of Arguments required
    //     REQUIRES "ArgumentsRequired" TO BE TRUE IF TO BE SET AS AN INTEGER
    MinimumArguments: null,

    // Maximum amount of Arguments allowed
    //     Does NOT require "ArgumentsRequired" to be true, but should be more than Minimum if set
    MaximumArguments: null,

    // Command Permission Level
    //     One of the following: DEVELOPER, SERVER_OWNER, ADMIN, MODERATOR, EVERYONE
    PermissionLevel: "SERVER_OWNER",



    /**
     * Executes the Text Command
     * @param {Message} message Origin Message that triggered this Command
     * @param {?Array<String>} arguments Given arguments, can be empty!
     */
    async execute(message, arguments)
    {
        // Send Message
        await message.channel.send({
            allowedMentions: { parse: [] }, components: [StartTicketButtonsRow1, StartTicketButtonsRow2],
            content: `__**St1g Gaming Ticket System**__
*You have reached the Help Center for the St1g Gaming Server, please leave your message after the beep...*
                        
This is where you can create Tickets to be able to gain help from the Server's Moderation Team; whether it'd be reporting another Server Member, applying for a Role, asking for help in how something works, or otherwise!
                        
To start the process of creating a Ticket, please select the type of Ticket using the Buttons attached to the bottom of this message ↙`
        });

        return;
    }
}
