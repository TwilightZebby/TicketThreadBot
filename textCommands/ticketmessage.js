// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');


// Make Select menu
const ticketCreationSelectMenu = new Discord.MessageActionRow().addComponents(
    new Discord.MessageSelectMenu().setCustomId(`create-ticket`).setMaxValues(1).setMinValues(1).setPlaceholder(`Choose a Ticket type`).setOptions(
        { label: `General`, value: `general`, description: `General Support Ticket, if none of the other options fit`, emoji: `<:LukeWat:662716296626044958>` },
        { label: `User Report`, value: `report`, description: `Report another Member of the Server`, emoji: `⚠️` },
        { label: `Application`, value: `application`, description: `Apply for a Role which has Applications open`, emoji: `📝` },
        { label: `Claim Monthly Role`, value: `monthly-role`, description: `Claim the Monthly Role, if you won it this month!`, emoji: `🏆` }
    )
);


module.exports = {
    // Command Name
    name: 'ticketmessage',
    // Description of command
    description: `Dumps the message explaining how to use the Ticket System, along with the Select Menu for starting the Ticket Creation Process`,
    // Category of Command
    category: 'ticket',

    // Alias(es) of command, if any
    // Uncomment if there will be some
    //alias: [],

    // Command Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 300,

    // Is command intended for DM usage with the Bot only?
    // DO NOT HAVE THIS AND "guildOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    //dmOnly: true,

    // Is command intended for Guild usage only?
    // DO NOT HAVE THIS AND "dmOnly" UNCOMMENTED - ONLY ONE OR THE OTHER OR NEITHER
    guildOnly: true,

    // Is at least one argument required?
    //requiresArguments: true,

    // What is the minimum required arguments?
    // THIS REQUIRES "requiresArguments" TO BE UNCOMMENTED
    //minimumArguments: 2,

    // What is the maximum required arguments?
    // Is usable/settable no matter if "requiresArguments" is un/commented
    //maximumArguments: 5,

    // Command Limitation - limits who can use this Command
    //    - "developer" for TwilightZebby only
    //    - "owner" for Guild Owners & TwilightZebby
    //    - "admin" for those with the ADMIN Guild Permission, Guild Owners, & TwilightZebby
    //    - "moderator" for those with Moderator-level Guild Permissions, Admins, Guild Owners, & TwilightZebby
    //    - "private" for those TwilightZebby explicitly grants permission to use on a per-User allowlist basis. This is non-linear as the above permissions do NOT override this
    //    - "everyone" (or commented out) for everyone to use this command
    limitation: "owner",



    /**
     * Main function that runs the command
     * 
     * @param {Discord.Message} message Origin Message that triggered this command
     * @param {Array<String>} arguments The given arguments of the command. Can be empty if no arguments were passed!
     */
    async execute(message, arguments)
    {
        // Send message
        return await message.channel.send({ components: [ticketCreationSelectMenu], allowedMentions: { parse: [] },
            content: `__**St1g Gaming Ticket System**__
*You have reached the Help Center for the St1g Gaming Server, please leave your message after the beep...*
            
This is where you can create Tickets to be able to gain help from the Server's Moderation Team; whether it'd be reporting another Server Member, applying for a Role, asking for help in how something works, or otherwise!
            
To start the process of creating a Ticket, please select the type of Ticket from the Select Menu attached to the bottom of this message ↙`
        });
    }
};
