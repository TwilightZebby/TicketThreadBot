Just a concept for how the ticket system could be improved on Dr1fterX's Discord :)

---

# How to register the Slash Command

1. Go into `./deployCommands.js` and uncomment line 13 (make sure line 16 IS commented)
  - If you want the Command to be registered Globally (for all Servers the Bot is in), remove the `, Config.ErrorLogGuildID` from the `.create()` method on line 13
2. Use `node deployCommands.js` in your command line/terminal

# How to UNregister (remove from Discord) the Slash Command

1. Go to `./deployCommands.js` and uncomment line 16 (make sure line 13 IS commented)
2. Make sure you are unregistering the Command from the Scope it was previously registered to.
  - For instance: Trying to unregister it globally when it is registered to a specific Server will fail.
  - If you want to unregister it globally, remove the `, Config.ErrorLogGuildID` from the `.set()` method on line 16
  - Do **NOT** add anything in the empty Array on line 16. The empty Array is used as a shortcut for "unregister ALL Application Commands for this Bot".
3. Use `node deployCommands.js` in your command line/terminal

---

# How to setup the Ticket System

1. Go into a Text Channel the Bot has `VIEW_CHANNELS`, `SEND_MESSAGES`, `CREATE_PRIVATE_THREADS`, and `SEND_MESSAGES_IN_THREADS` Permissions for, and that you want your Ticket System to be used in.
  - The Thread Permissions are required as this will also be the Channel that the Bot will create the Tickets in.
2. Use the `t%ticketmsg` Text Command in that Channel.
  - This will cause the Bot to send the initial Message containing the Buttons used for creating Tickets.

---

# Configuration File

- `ErrorLogChannelID` - Currently unused
- `ErrorLogGuildID` - Used in `./deployCommands.js` for (un)registering Slash Command to/from the specific Server
- `BotDevID` - Used in the Text Command Permissions System
- `StaffRoleID` - Used for adding your Server's Moderation/Staff Team into Tickets when they are created
- `ReportLogChannelID` - Used for logging the creation of Report Tickets for your Moderation/Staff Team

