const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const { giphyAPIKey } = require('../../config.json');
const GphApiClient = require('giphy-js-sdk-core');
const client = GphApiClient(giphyAPIKey);

module.exports = class GiphyRandom extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'gif-random',
            aliases: ['gifr'],
            group: 'fun',
            memberName: 'gif-random',
            description: 'Pulls a random gif based on your argument.',
            details: oneLine`
                This command will pull a random gif from Giphy
                based on the one search word you enter.
            `,
            examples: ['gif-random pickle'],
            guildOnly: false,

            args: [
                {
                    key: 'query',
                    label: 'query',
                    prompt: 'What is your search tag?',
                    type: 'string',
                    infinite: false,
                    default: ""
                }
            ]
        });
    }

    async run(message, args) {
        
        var giphyEmbed = {
            "embed": {
                "title": "",
                "color": 8612023,
                "footer": {
                "text": "Powered by GIPHY"
                },
                "image": {
                "url": ""
                }
            }
        };

        client.random('gifs', {"tag": (args.query ? args.query : ""), "rating": 'r',"fmt": 'json'})
        .then((response) => {
            console.log(response.data.images.original);
            console.log(response);
            console.log(`The gif URL is ${response.data.images.original.gif_url}`);
            if (response.data.images.original.gif_url == undefined) {
                giphyEmbed.embed.title = "No Gif Found";
                giphyEmbed.embed.image.url = "https://media.giphy.com/media/kWMoRLEYSLoGvZ8zrB/giphy.gif";
            } else {
                giphyEmbed.embed.image.url = response.data.images.original.gif_url;
            }
            message.channel.send(giphyEmbed);
        })
        .catch((err) => {

        });
    }
};