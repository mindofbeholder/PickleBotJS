const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const main = require('../../main');

module.exports = class Restart extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            aliases: [],
            group: 'admin',
            memberName: 'restart',
            description: 'Restarts the bot',
            examples: ['restart'],
            ownerOnly: true,
            guildOnly: false,
        });
    }

    async run(message, args) {
        process.exit();
    }
};