const d20 = require('d20');

module.exports = {
    name: 'roll-dice',
    aliases: ['roll', 'rd'],
    description: 'Rolls the dice specified in your argument',
    args: true,
    guildOnly: false,
    execute(message, args) {
        message.channel.send(d20.roll(args[0]));
    },
};