const { ModalSubmitInteraction, ModalMessageModalSubmitInteraction } = require("discord.js");
const TicketReport = require('../../BotModules/Tickets/TicketReport.js');

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "report-ticket",

    // Modal's Description
    Description: `Receives the User Input for Member Reports`,



    /**
     * Executes the Modal
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        await TicketReport.create(modalInteraction);
        return;
    }
}
