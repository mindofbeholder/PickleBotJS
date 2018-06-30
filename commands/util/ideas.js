const commando = require('discord.js-commando');

module.exports = class Ideas extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ideas',
            aliases: [],
            group: 'util',
            memberName: 'ideas',
            description: 'Spits out a link to the ideas page',
            examples: ['ideas'],
            guildOnly: false,
        });
    }

    async run(message, args) { // jshint ignore:line
        message.channel.send('https://github.com/mindofbeholder/PickleBotJS/issues');
    }
};