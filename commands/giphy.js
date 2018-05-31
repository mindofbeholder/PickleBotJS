const { giphyAPIKey } = require('../config.json');
const GphApiClient = require('giphy-js-sdk-core');
const client = GphApiClient(giphyAPIKey);

module.exports = {
    name: 'gif',
    description: 'Pulls a random gif based on your selected word',
    args: false,
    guildOnly: true,
    execute(message, args) {
        if (args[1]) {
            return message.reply("This command only works with 0 or 1 arguments.\nPlease try again.");
        }

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

        client.random('gifs', {"tag": (args[0] ? args[0] : ""), "rating": 'r',"fmt": 'json'})
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
        // message.channel.send('You.');
    },
};