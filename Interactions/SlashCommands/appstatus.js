const { ChatInputCommandInteraction, ChatInputApplicationCommandData, AutocompleteInteraction, ApplicationCommandType, PermissionFlagsBits, ApplicationCommandOptionType, ApplicationCommandOptionChoiceData } = require("discord.js");
const fs = require("fs");
const { DiscordClient, Collections } = require("../../constants.js");
const LocalizedErrors = require("../../JsonFiles/errorMessages.json");
const LocalizedStrings = require("../../JsonFiles/stringMessages.json");
const ApplicationStatuses = require("../../JsonFiles/applicationStatus.json");

// For the Autocomplete
/** @type {Array<ApplicationCommandOptionChoiceData>} */
const ApplicationNames = [
    { name: "Helper Role", value: "helper" },
    { name: "Twitch Streamer Role", value: "twitch" },
    { name: "YouTuber Role", value: "youtube" },
    { name: "Artist Role", value: "artist" },
    { name: "Musicain Role", value: "musician" }
];

module.exports = {
    // Command's Name
    //     Use full lowercase
    Name: "appstatus",

    // Command's Description
    Description: `Use to open or close an Application Type`,

    // Command's Category
    Category: "ADMIN",

    // Cooldown, in seconds
    //     Defaults to 3 seconds if missing
    Cooldown: 10,

    // Cooldowns for specific subcommands and/or subcommand-groups
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandCooldown: {
        "example": 3
    },

    // Scope of Command's usage
    //     One of the following: DM, GUILD, ALL
    Scope: "GUILD",
    
    // Scope of specific Subcommands Usage
    //     One of the following: DM, GUILD, ALL
    //     IF SUBCOMMAND: name as "subcommandName"
    //     IF SUBCOMMAND GROUP: name as "subcommandGroupName_subcommandName"
    SubcommandScope: {
        "example": "GUILD"
    },



    /**
     * Returns data needed for registering Slash Command onto Discord's API
     * @returns {ChatInputApplicationCommandData}
     */
    registerData()
    {
        /** @type {ChatInputApplicationCommandData} */
        const Data = {};

        Data.name = this.Name;
        Data.description = this.Description;
        Data.type = ApplicationCommandType.ChatInput;
        Data.dmPermission = false;
        Data.defaultMemberPermissions = PermissionFlagsBits.ManageGuild;
        Data.options = [
            {
                type: ApplicationCommandOptionType.String,
                name: "application",
                description: "The type of Application to change the status of",
                required: true,
                autocomplete: true
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: "status",
                description: "Set to TRUE to open, or FALSE to close, the Application",
                required: true
            }
        ]

        return Data;
    },



    /**
     * Executes the Slash Command
     * @param {ChatInputCommandInteraction} slashCommand 
     */
    async execute(slashCommand)
    {
        // Grab inputs
        const ApplicationInput = slashCommand.options.getString("application");
        const StatusInput = slashCommand.options.getBoolean("status");

        // Just in case
        await slashCommand.deferReply({ ephemeral: true });

        // Update Application Status
        let updateApplicationStatus = ApplicationStatuses[ApplicationInput] = StatusInput;

        fs.writeFile('./JsonFiles/applicationStatus.json', JSON.stringify(updateApplicationStatus, null, 4), async (err) => {
            if ( err ) { await slashCommand.editReply({ content: `An error occurred while trying to update the Application Status.` }); return; }
        });

        // ACK to User
        await slashCommand.editReply({ content: `Successfully changed the Application Status for the ${ApplicationInput} type to be ${StatusInput ? `open` : `closed`}.` });
        return;
    },



    /**
     * Handles given Autocomplete Interactions for any Options in this Slash CMD that uses it
     * @param {AutocompleteInteraction} autocompleteInteraction 
     */
    async autocomplete(autocompleteInteraction)
    {
        // Grab currently typed input
        const TypedInput = autocompleteInteraction.options.getFocused();
        /** @type {Array<ApplicationCommandOptionChoiceData>} */
        let filteredResults = [];

        // Confirm not blank input
        if ( !TypedInput || TypedInput == "" || TypedInput == " " )
        {
            // Blank input, default to all application types
            filteredResults = ApplicationNames;
        }
        else
        {
            // Not a blank input, filter based on input
            let lowerCaseInput = TypedInput.toLowerCase();
            filteredResults = ApplicationNames.filter(appType => appType.name.toLowerCase().startsWith(lowerCaseInput) || appType.name.toLowerCase().includes(lowerCaseInput));
        }

        // Respond
        await autocompleteInteraction.respond(filteredResults);
    }
}
