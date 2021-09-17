const Discord = require('discord.js');
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
    async execute(slashInteraction) {

        // First, use an Ephemeral Message to see what kind of Ticket the User wants
        return await slashInteraction.reply({ content: `Please select what type of Ticket you want to open, by pressing/clicking on one of the buttons below:`, components: TicketTypeButtons, ephemeral: true });

    }
}
