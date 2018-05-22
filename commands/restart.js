let main = require('../main');

module.exports = {
    name: 'restart',
    description: 'Restarts the bot.',
    cooldown: 0,
    args: false,
    guildOnly: false,
    configRole: "owner",
    execute(message, args) {
        process.exit();
    },
};