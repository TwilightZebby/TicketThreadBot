const { ButtonInteraction } = require("discord.js");
const TicketGeneral = require('../../BotModules/Tickets/TicketGeneral.js');
const TicketMonthlyRole = require('../../BotModules/Tickets/TicketMonthlyRole.js');
const TicketApplication = require('../../BotModules/Tickets/TicketApplication.js');
const TicketReport = require('../../BotModules/Tickets/TicketReport.js');

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
                await TicketApplication.promptApplicationType(buttonInteraction);
                break;

            case "monthly-role":
                await TicketMonthlyRole.promptUser(buttonInteraction);
                break;

            case "report":
                await TicketReport.promptMemberSelect(buttonInteraction);
                break;

            default:
                await buttonInteraction.reply({ ephemeral: true, content: `Sorry, but there was an issue processing your button press.` });
                break;
        }

        return;
    }
}
