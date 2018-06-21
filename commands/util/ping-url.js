const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');
var screenshot = require('snapshot-stream');
const fs = require('fs');

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
        let finalURL = "";

        if (args.URL.indexOf('http://') === -1 & args.URL.indexOf('https://') === -1) {
            finalURL = `https://${args.URL}`;
        } else if (args.URL.indexOf('http://') !== -1) {
            finalURL = `https://${args.URL.substr(7)}`;
        } else if (args.URL.indexOf('https://') !== -1) {
            finalURL = `https://${args.URL.substr(8)}`;
        }
        
        message.channel.send(`Grabbing ${args.URL} now. Please hold.`);

        try {
            var stream = screenshot(finalURL, '1024x768', {crop: true});
            await stream.pipe(fs.createWriteStream(`images/${message.author.id}.png`)) // jshint ignore:line
            .on('finish', () => {
                message.channel.send({file: `images/${message.author.id}.png`});
            })
            .on('error', (err) => {
                message.channel.send(err);
            });
        } catch (err) {
            console.log(err);
            message.channel.send('There was an error. Try again!');
        }
        
        
        // const picEmbed = new Discord.RichEmbed()
        // .setColor('green')
        // .setTitle(args.URL)
        // .attachFile({file: `image.png`});

        

        

    }
};