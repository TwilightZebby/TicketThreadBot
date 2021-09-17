const Discord = require('discord.js');
const Mee6Api = require('mee6-levels-api');
const { client } = require('../constants.js');

const TicketTypeButtons = [
    new Discord.MessageActionRow().addComponents([
        new Discord.MessageButton().setCustomId(`ticket_app`).setLabel(`Applications`).setStyle('PRIMARY').setEmoji('📝'),
        new Discord.MessageButton().setCustomId(`ticket_monthly`).setLabel(`Monthly Role`).setStyle('PRIMARY').setEmoji('🏆'),
        new Discord.MessageButton().setCustomId(`ticket_report`).setLabel(`Report`).setStyle('PRIMARY').setEmoji('🚨'),
        new Discord.MessageButton().setCustomId(`ticket_appeal`).setLabel(`Mute Appeal`).setStyle('PRIMARY').setEmoji('📜'),
        new Discord.MessageButton().setCustomId(`ticket_general`).setLabel(`General`).setStyle('PRIMARY').setEmoji('❓')
    ])
];


module.exports = {
    name: 'ticket',
    description: `Opens a Ticket, used for Applications, Reports, or for other help and support from the Staff Team`,
    
    // Cooldown is in seconds
    cooldown: 600,

    // Uncomment for making the command only usable in DMs with the Bot
    //    - DO NOT have both this AND "guildOnly" uncommented, only one or neither
    //dmOnly: true,

    // Uncomment for making the command only usable in Servers
    //   - DO NOT have both this AND "dmOnly" uncommented, only one or neither
    guildOnly: true,


    /**
     * Returns data to be used for registering the Slash Command
     * 
     * @returns {Discord.ApplicationCommandData} 
     */
    async registerData() {

        const data = {};
        data.name = this.name;
        data.description = this.description;
        data.type = "CHAT_INPUT"; // Slash Command

        return data;

    },


    /**
     * Entry point that runs the slash command
     * 
     * @param {Discord.CommandInteraction} slashInteraction Slash Command Interaction
     */
    async execute(slashInteraction)
    {
        // First, use an Ephemeral Message to see what kind of Ticket the User wants
        return await slashInteraction.reply({ content: `Please select what type of Ticket you want to open, by pressing/clicking on one of the buttons below:`, components: TicketTypeButtons, ephemeral: true });

    },










    /**
     * Handles the Ticket Type Buttons
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     */
    async handleTicketType(buttonInteraction)
    {
        // Split Custom ID so we know what kind of Ticket the User wants
        let ticketType = buttonInteraction.customId.slice(7);

        // Applications
        if ( ticketType === "app" )
        {
            let ApplicationStatus = require('../hiddenJsonFiles/applicationStatus.json');

            // Find out what the User wants to apply for
            let applicationButtons = [
                new Discord.MessageActionRow().addComponents([
                    new Discord.MessageButton().setCustomId(`app_staff`).setLabel(`Moderator`).setStyle(`${ApplicationStatus['staff'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['staff'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['staff']}`),
                    new Discord.MessageButton().setCustomId(`app_events`).setLabel(`Events Team`).setStyle(`${ApplicationStatus['events'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['events'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['events']}`),
                    new Discord.MessageButton().setCustomId(`app_youtuber`).setLabel(`YouTuber Role`).setStyle(`${ApplicationStatus['youtuber'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['youtuber'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['youtuber']}`),
                    new Discord.MessageButton().setCustomId(`app_streamer`).setLabel(`Streamer Role`).setStyle(`${ApplicationStatus['streamer'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['streamer'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['streamer']}`)
                ]),
                new Discord.MessageActionRow().addComponents([
                    new Discord.MessageButton().setCustomId(`app_artist`).setLabel(`Artist Role`).setStyle(`${ApplicationStatus['artist'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['artist'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['artist']}`),
                    new Discord.MessageButton().setCustomId(`app_musician`).setLabel(`Musician Role`).setStyle(`${ApplicationStatus['musician'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['musician'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['musician']}`),
                    new Discord.MessageButton().setCustomId(`app_minecraft`).setLabel(`Minecraft Server`).setStyle(`${ApplicationStatus['minecraft'] ? 'PRIMARY' : 'DANGER'}`).setEmoji(`${ApplicationStatus['minecraft'] ? '✅' : '❌'}`).setDisabled(`${!ApplicationStatus['minecraft']}`)
                ])
            ];


            return await buttonInteraction.update({ content: `Please select what you want to apply for, using the buttons below.\nApplication status is marked using ✅ for open and ❌ for closed.\nIf you've changed your mind about applying, then feel free to dismiss this message.`, components: applicationButtons });
        }
        // Other ticket types
        else
        {
            // Begin Thread creation process
            await buttonInteraction.update({ content: `⏳ Creating Ticket for you now, please wait...`, components: [] });
        }
    },












    /**
     * Handles the Application Buttons
     * 
     * @param {Discord.ButtonInteraction} buttonInteraction
     */
    async handleApplicationButtons(buttonInteraction)
    {
        // For the Applications with Discord-based requirements (such as length of time on Server, etc), check those
        const appType = buttonInteraction.customId.split(4);

        // Staff Apps - requires 6 months minimum & Level 10 or higher on Mee6
        if ( appType === "staff" )
        {
            let appMember = await (await client.guilds.fetch(buttonInteraction.guildId)).members.fetch(buttonInteraction.user.id);

            // Member length check
            if ( (Date.now() - appMember.joinedAt) < 1.577e+10 )
            {
                return await buttonInteraction.update({ content: `Sorry, but you are currently not able to apply for Moderator due to not meeting our requirements. (Need to be a member of this server for more than 6 months)\nYou are welcome to try and apply again when you meet this requirement though!`, components: [] });
            }

            // Mee6 Level check
            let memberMee6Data = Mee6Api.getUserXp(buttonInteraction.guildId, appMember.user.id);
            if ( !memberMee6Data || memberMee6Data.level < 10 )
            {
                return await buttonInteraction.update({ content: `Sorry, but you are currently not able to apply for Moderator due to not meeting our requirements. (Needs to have at least Level 10 on the Mee6 Bot)\nYou are welcome to try and apply again when you meet this requirement though!`, components: [] });
            }
        }
    }
}
