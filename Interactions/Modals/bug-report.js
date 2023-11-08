const { ModalSubmitInteraction, ModalMessageModalSubmitInteraction } = require("discord.js");
const TicketGeneral = require('../../BotModules/Tickets/TicketBugReport.js');

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "bug-report",

    // Modal's Description
    Description: `Receives the User Input for Bug Reports`,



    /**
     * Executes the Modal
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        await TicketGeneral.create(modalInteraction);
        return;
    }
}
