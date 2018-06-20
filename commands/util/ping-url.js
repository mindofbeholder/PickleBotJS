const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class PingURL extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ping-url',
            aliases: ['pu'],
            group: 'util',
            memberName: 'ping-url',
            description: 'Takes screenshot of a url and returns it',
            details: oneLine`
                
            `,
            examples: ['ping-url www.google.com'],
            guildOnly: false,

            args: [
                {
                    key: 'URL',
                    label: 'URL',
                    prompt: 'Enter the URL you want to check',
                    type: 'string',
                    infinite: false
                }
            ]
        });
    }

    async run(message, args) { // jshint ignore:line
        message.channel.send('test');
    }
};