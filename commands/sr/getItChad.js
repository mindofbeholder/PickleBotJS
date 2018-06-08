const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const { giphyAPIKey } = require('../../config.json');
const GphApiClient = require('giphy-js-sdk-core');
const client = GphApiClient(giphyAPIKey);

module.exports = class GetItChad extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'getitchad',
            aliases: ['gic'],
            group: 'sr',
            memberName: 'getitchad',
            description: 'Pulls the "get it chad" gif.',
            examples: ['getitchad'],
            guildOnly: false,
        });
    }

    async run(message, args) {
        
        var richEmbed = {
            "embed": {
                "title": "",
                "color": 8612023,
                "footer": {
                "text": "Powered by BOOM"
                },
                "image": {
                }
            }
        };

        richEmbed.embed.image.file = "../../gifs/getItChad.gif";

        message.channel.send(richEmbed)
        .catch((err) => {
            console.log(err);
            richEmbed.embed.title = "Something went wrong"
            richEmbed.embed.image.url = "https://media.giphy.com/media/rftarkt7Ki2Gs/giphy.gif"
            return message.channel.send(richEmbed);
        });

    }
};