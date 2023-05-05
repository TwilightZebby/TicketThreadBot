const { ButtonInteraction, ActionRowBuilder, TextChannel, ChannelType, ThreadAutoArchiveDuration, EmbedBuilder, Colors, StringSelectMenuBuilder, StringSelectMenuInteraction } = require("discord.js");
const { StaffRoleID } = require('../../config.js');

/** Embed for Musician Questions */
const MusicianAppEmbed = new EmbedBuilder().setColor(Colors.DarkAqua)
.setTitle("Musician Role Application")
.addFields(
    {
        name: `Requirements`,
        value: `• Active in the Server
• Frequently posting music in our Creations Channel`
    },
    {
        name: `Questions`,
        value: `**1.** Why would you like the Musician Role?
**2.** Please share some of your favourite pieces of music __you__ have made`
    }
);


/** Embed for Artist Questions */
const ArtistAppEmbed = new EmbedBuilder().setColor(Colors.DarkAqua)
.setTitle("Artist Role Application")
.addFields(
    {
        name: `Requirements`,
        value: `• Active in the Server
• Frequently posting art in our Creations Channel`
    },
    {
        name: `Questions`,
        value: `**1.** Why would you like the Artist Role?
**2.** Please share some of your favourite pieces of art __you__ have made`
    }
);


/** Embed for Helper Questions */
const HelperAppEmbed = new EmbedBuilder().setColor(Colors.DarkAqua)
.setTitle("Helper Application")
.addFields(
    {
        name: `Requirements`,
        value: `• Have at least Level 10 in our XP System
• Have been on the Server for at least 6 months
• At least 16 years or older in real life`
    },
    {
        name: `Questions - The Basics`,
        value: `**1.** How old are you?
**2.** What Timezone are you mainly in?
**3.** Tell us a little about yourself`
    },
    {
        name: `Questions - The Moderation`,
        value: `**4.** What is your current moderation experience?
**5.** Why do you want to be a part of our Staff Team?
**6.** How would you benefit us, the Staff Team?`
    },
    {
        name: `Questions - The Scenarios`,
        value: `**7.** A Member is being disrespectful towards other Members, and is not listening to other Members. What do you do?
**8.** A Staff Team Member is abusing their powers. What do you do?
**9.** A Member asks you a question, but you don't know the answer or don't know how to respond. What do you do?`
    }
);


/** Embed for Twitch Questions */
const TwitchAppEmbed = new EmbedBuilder().setColor(Colors.DarkAqua)
.setTitle("Twitch Role Application")
.addFields(
    {
        name: `Requirements`,
        value: `• Have at least x followers on Twitch`
    },
    {
        name: `Questions`,
        value: `**1.** What is your Twitch Channel?`
    }
);


/** Embed for YouTuber Questions */
const YouTuberAppEmbed = new EmbedBuilder().setColor(Colors.DarkAqua)
.setTitle("YouTuber Role Application")
.addFields(
    {
        name: `Requirements`,
        value: `• Have at least x susbcribers on YouTube`
    },
    {
        name: `Questions`,
        value: `**1.** What is your YouTube Channel?`
    }
);


// To make the application names more UX friendly
const ApplicationKeyToName = {
    "helper": "Helper Role",
    "twitch": "Twitch Streamer Role",
    "youtube": "YouTuber Role",
    "artist": "Artist Role",
    "musician": "Musician Role"
};

module.exports = {
    /**
     * Shows a Select to ask the User which Application Type they want to open
     * @param {ButtonInteraction} buttonInteraction 
     */
    async promptApplicationType(buttonInteraction)
    {
        let ApplicationStatus = require('../../JsonFiles/applicationStatus.json');

        /** Select Menu for User to choose which Application they want to open */
        const ApplicationSelect = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder().setCustomId(`role-applications`).setMinValues(1).setMaxValues(1).setPlaceholder("Select Application").setOptions(
                { label: "Helper", value: "helper", description: "The first step on becoming a Moderation Staff Member", emoji: ApplicationStatus["helper"] ? `✅` : `❌` },
                { label: "Twitch Streamer", value: "twitch", description: "Peeps who regularly stream on Twitch", emoji: ApplicationStatus["twitch"] ? `✅` : `❌` },
                { label: "YouTuber", value: "youtube", description: "Peeps who regularly upload or stream on YouTube", emoji: ApplicationStatus["youtube"] ? `✅` : `❌` },
                { label: "Artist", value: "artist", description: "For those who make high-quality art of any kind", emoji: ApplicationStatus["artist"] ? `✅` : `❌` },
                { label: "Musician", value: "musician", description: "For those who make high-quality music or songs", emoji: ApplicationStatus["musician"] ? `✅` : `❌` }
            )
        ]);

        // Send to User
        await buttonInteraction.reply({ ephemeral: true, components: [ApplicationSelect],
            content: `Please select which Application you would like to open, using the Select Menu below.
Open Applications are shown with ✅ - while closed Applications are shown with ❌`
        });

        // Clear cache
        delete ApplicationStatus, ApplicationSelect;
        return;
    },




    /**
     * Shows a Modal for the User to input answer to specific Application Questions
     * @param {StringSelectMenuInteraction} selectInteraction 
     */
    async promptUser(selectInteraction)
    {
        let ApplicationStatus = require('../../JsonFiles/applicationStatus.json');

        // Check selected Application *is* open
        const SelectedApplication = selectInteraction.values.shift();
        /** @type {Boolean} */
        const CurrentApplicationStatus = ApplicationStatus[SelectedApplication];

        if ( !CurrentApplicationStatus )
        {
            // Applications are closed
            await selectInteraction.update({ components: [], 
                content: `Sorry, but the ${ApplicationKeyToName[SelectedApplication]} Applications are currently closed!
We'll announce in our Announcement Channels when the ${ApplicationKeyToName[SelectedApplication]} Applications are open again, so be sure to keep on eye on them.`
            });

            // Clear cache
            delete ApplicationStatus;
            return;
        }
        else
        {
            // Applications are open
            await this.create(selectInteraction, SelectedApplication);
            
            // Clear cache
            delete ApplicationStatus, CurrentApplicationStatus;
            return;
        }
    },




    /**
     * Creates a Private Thread to be used as the Ticket
     * @param {StringSelectMenuInteraction} selectInteraction 
     * @param {String} SelectedApplication
     */
    async create(selectInteraction, SelectedApplication)
    {
        // Defer because creating a whole Thread will not be done in the span of 3 seconds
        await selectInteraction.deferUpdate();
        const now = new Date();
        /** @type {TextChannel} */
        const SourceChannel = selectInteraction.channel;

        // Create Thread for Ticket
        await SourceChannel.threads.create({
            type: ChannelType.PrivateThread,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            name: `${selectInteraction.user.username} - ${ApplicationKeyToName[SelectedApplication]} App - ${now.getDate()}.${now.getMonth() + 1}`,
            reason: `New Ticket created by ${selectInteraction.user.tag} (ID: ${selectInteraction.user.id})`
        })
        .then(async (TicketThread) => {
            
            // Initial Message, from Bot, along with requested Role details
            const InitialBotMessage = new EmbedBuilder().setTitle(`New Application Created`)
            .addFields(
                { name: `Application Creator:`, value: `${selectInteraction.user.tag} (<@${selectInteraction.user.id}>)` },
                { name: `Application Type:`, value: `${ApplicationKeyToName[SelectedApplication]}` },
                { name: `\u200B`, value: `The Staff Team are aware of the creation of this Application, and will be checking it once you have filled out the questions required.` }
            )
            .setColor(Colors.Aqua);

            // Fetch Requirements & Questions based on Application Type
            const ApplicationEmbed = SelectedApplication === "helper" ? HelperAppEmbed
                : SelectedApplication === "twitch" ? TwitchAppEmbed
                : SelectedApplication === "youtube" ? YouTuberAppEmbed
                : SelectedApplication === "artist" ? ArtistAppEmbed
                : MusicianAppEmbed;

            // Send initial messages
            await TicketThread.send({ embeds: [InitialBotMessage, ApplicationEmbed] })
            .then(async (message) => {
                // Add Ticket Creator to Thread
                await TicketThread.members.add(selectInteraction.user.id, `Adding App. Creator to their App's Thread`);

                // Add Staff Team to Thread via a ping in edited message (no notif method)
                await message.edit({ content: `<@&${StaffRoleID}>` });
            })
            .catch(async (err) => {
                //console.error(err);
            });

            // ACK back to Interaction
            await selectInteraction.editReply({ components: [], content: `Your ${ApplicationKeyToName[SelectedApplication]} Application has been created! You can fill it out here -> <#${TicketThread.id}> (or by using the Threads Button at the top of this Channel!)` });

        })
        .catch(async (err) => {
            //console.error(err);
            await selectInteraction.editReply({ components: [], content: `Sorry, an error occurred while trying to make your ${ApplicationKeyToName[SelectedApplication]} Application.` });
        });

        return;
    }
}
