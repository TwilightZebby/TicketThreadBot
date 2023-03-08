const { StringSelectMenuInteraction } = require("discord.js");
const TicketReport = require('../../BotModules/Tickets/TicketReport.js');

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "report-type-select",

    // Select's Description
    Description: `Selects the type, or types, of Report to open`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Select
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        await TicketReport.promptUser(selectInteraction);
        return;
    }
}
