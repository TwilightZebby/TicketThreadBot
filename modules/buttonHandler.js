const Discord = require('discord.js');
const { client } = require('../constants.js');
const { PREFIX, TwilightZebbyID } = require('../config.js');

const ErrorModule = require('./errorLog.js');
const TicketModule = require('../slashCommands/ticket.js');

module.exports = {
    /**
     * Main function for the Button Handler
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     * 
     * @returns {Promise<*>} 
     */
    async Main(buttonInteraction)
    {
        // Left blank for custom implentation depending on use-case,
        // since Buttons are far to customisable lol

        if ( buttonInteraction.customId.includes("ticket") )
        {
            return await TicketModule.handleTicketType(buttonInteraction);
        }
        return;
    }
}
