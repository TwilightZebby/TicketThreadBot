// Imports
const Discord = require('discord.js');
//const fs = require('fs');
const { client } = require('../constants.js');
const CONSTANTS = require('../constants.js');


const ApplicationKeyToName = {
    "helper": "Helper Role",
    "twitch": "Twitch Streamer Role",
    "youtube": "YouTuber Role",
    "artist": "Artist Role",
    "musician": "Musician Role",
    "minecraft": "Minecraft Server Whitelist"
};


module.exports = {
    // Select's Name, used as start of its Custom ID
    name: 'role-applications',
    // Select's description, purely for documentation
    description: `Starts the process for applying for a Role (if apps are open for it)`,

    // Select's Cooldown, in seconds
    // If not provided or is commented out, will default to 3 seconds
    cooldown: 3,



    /**
     * Main function that runs this Select
     * 
     * @param {Discord.SelectMenuInteraction} selectInteraction Select Interaction
     */
    async execute(selectInteraction)
    {
        const ApplicationStatuses = require('../jsonFiles/applicationStatuses.json');
        
        // Confirmed selected Role does have its applications open
        const selectedApplication = selectInteraction.values.shift();
        const currentApplicationStatus = ApplicationStatuses[`${selectedApplication}`];
        
        if ( !currentApplicationStatus )
        {
            // Applications are closed
            return await selectInteraction.update({ components: [], content: `Sorry, but ${ApplicationKeyToName[selectedApplication]} applications are currently closed!\nWe'll announce when applications open again for the ${ApplicationKeyToName[selectedApplication]}, so be sure to keep an eye on our Announcement Channel.` });
        }
        else
        {
            // Applications are open!
            return await selectInteraction.update({ components: [], content: `Test Successful!` });
        }
    }
};
