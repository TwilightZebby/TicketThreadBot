const { ModalSubmitInteraction, ModalMessageModalSubmitInteraction } = require("discord.js");
const TicketMonthlyRole = require('../../BotModules/Tickets/TicketMonthlyRole.js');

module.exports = {
    // Modal's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "monthly-role-ticket",

    // Modal's Description
    Description: `Receives the User Input for Monthly Role Tickets`,



    /**
     * Executes the Modal
     * @param {ModalSubmitInteraction|ModalMessageModalSubmitInteraction} modalInteraction 
     */
    async execute(modalInteraction)
    {
        await TicketMonthlyRole.create(modalInteraction);
        return;
    }
}
