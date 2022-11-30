const { StringSelectMenuInteraction } = require("discord.js");
const TicketApplication = require('../../BotModules/Tickets/TicketApplication.js');

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "role-applications",

    // Select's Description
    Description: `Responds to the User for Application Tickets`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        await TicketApplication.promptUser(selectInteraction);
        return;
    }
}
