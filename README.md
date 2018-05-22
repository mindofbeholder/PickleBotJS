# PickleBotJS
A Discord Bot that just might be useful.

## Config File

You will need to build a config file from scratch and save it as `config.json`. An example is below:
```json
{
    "prefix": "what your command prefix will be. I just use !",
    "token": "your bot token",
    "owner": "your discord tag",
    "administrators": ["array of administrator tags"],
    "moderators": ["array of moderator tags"]
}
```

## Building a command file

Commands are super easy to make and have a few optional arguments.

Below is a command file for a command that when called will simply respond with "boop"

```javascript
module.exports = {
    name: 'beep', // This is your actual command
    description: 'Beep!', // A description of what your command is for. Displayed in the help command.
    usage: "", // Used to specify any required arguments for command usage. Displayed in the help command.
    cooldown: 30, // Add an optional "cooldown" before the command can be used again. Defaults to 3 secs.
    args: false, // If your command requires additional arguments beyond simply calling the name
    guildOnly: true, // If true this command cannot be used in direct messages
    configRole: "owner", // Set if a config role is required (ie owner/administrator/moderator)
    execute(message, args) {
        message.channel.send('Boop.');
    },
};
```
