let main = require('../main');

module.exports = {
    name: 'config-user',
    description: 'Determines where you lie in the config user file',
    cooldown: 0,
    args: false,
    guildOnly: false,
    execute(message, args) {
        console.log("config user called");
        if (main.ownerCheck(message.author.tag))
        {
            message.reply("you are the Owner.");
        }
    },
};