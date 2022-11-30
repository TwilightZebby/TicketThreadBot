const { UserSelectMenuInteraction } = require("discord.js");
const TicketReport = require('../../BotModules/Tickets/TicketReport.js');

module.exports = {
    // Select's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "report-user-select",

    // Select's Description
    Description: `Select used for the User to choose which Server Member to report`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,



    /**
     * Executes the Select
     * @param {UserSelectMenuInteraction} selectInteraction 
     */
    async execute(selectInteraction)
    {
        await TicketReport.promptUser(selectInteraction);
        return;
    }
}
