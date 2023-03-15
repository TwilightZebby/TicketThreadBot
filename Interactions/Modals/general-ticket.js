const { ModalSubmitInteraction, ModalMessageModalSubmitInteraction } = require("discord.js");
const TicketGeneral = require('../../BotModules/Tickets/TicketGeneral.js');

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "general-ticket",

    // Modal's Description
    Description: `Receives the User Input for General Tickets`,



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
