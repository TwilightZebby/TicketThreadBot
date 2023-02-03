const { DiscordClient } = require("./constants.js");
const Config = require("./config.js");

// Bring in Slash Commands for (un)registering
const AppstatusCommand = require('./Interactions/SlashCommands/appstatus.js');

// Login Bot
DiscordClient.login(Config.TOKEN);

// Wait for Ready
DiscordClient.once('ready', async () => {
    // Use to register a single command
    //await DiscordClient.application.commands.create(AppstatusCommand.registerData(), Config.ErrorLogGuildID); // Include Guild ID to register to specific Guild
    
    // Use to UNregister all Commands
    await DiscordClient.application.commands.set([], Config.ErrorLogGuildID); // Include Guild ID to UNregister from a specific Guild

    console.log("Deployed Commands!");
    process.exit();
});






/******************************************************************************* */
// DEBUGGING AND ERROR LOGGING
// Warnings
process.on('warning', (warning) => { return console.warn("***WARNING: ", warning); });
DiscordClient.on('warn', (warning) => { return console.warn("***DISCORD WARNING: ", warning); });

// Unhandled Promise Rejections
process.on('unhandledRejection', (err) => { return console.error("***UNHANDLED PROMISE REJECTION: ", err); });

// Discord Errors
DiscordClient.on('error', (err) => { return console.error("***DISCORD ERROR: ", err); });
