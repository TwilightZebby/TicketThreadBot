const { ButtonInteraction } = require("discord.js");
const TicketGeneral = require('../../BotModules/Tickets/TicketGeneral.js');

module.exports = {
    // Button's Name
    //     Used as its custom ID (or at least the start of it)
    Name: "newticket",

    // Button's Description
    Description: `Handles Interactions from the "New Ticket" Buttons`,

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 60,



    /**
     * Executes the Button
     * @param {ButtonInteraction} buttonInteraction 
     */
    async execute(buttonInteraction)
    {
        // Grab Custom ID so we know *which* Ticket Type is to be created
        const TicketType = buttonInteraction.customId.split("_").pop();

        // Start relevent Ticket Creation
        switch (TicketType)
        {
            case "general":
                await TicketGeneral.promptUser(buttonInteraction);
                break;

            case "application":
                break;

            case "monthly-role":
                break;

            case "report":
                break;

            default:
                await buttonInteraction.reply({ ephemeral: true, content: `Sorry, but there was an issue processing your button press.` });
                break;
        }

        return;
    }
}
