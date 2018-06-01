const { giphyAPIKey } = require('../config.json');
const GphApiClient = require('giphy-js-sdk-core');
const client = GphApiClient(giphyAPIKey);

module.exports = {
    name: 'gif',
    description: 'Pulls a gif based on your search term',
    args: true,
    guildOnly: true,
    execute(message, args) {
        var query = "";
        selection = Math.floor(Math.random() * (9 - 0 + 1)) + 0;

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

        for (i = 0; i < args.length; i++) {
            query += args[i] + " ";
        }

        client.search('gifs', {"q": query, "limit": 10, "rating": 'r',"fmt": 'json', "sort": "relevant"})
        .then((response) => {
            if (response.data.length == 0) {
                giphyEmbed.embed.title = "No Gif Found";
                giphyEmbed.embed.image.url = "https://media.giphy.com/media/kWMoRLEYSLoGvZ8zrB/giphy.gif";
            } else {
                giphyEmbed.embed.image.url = response.data[selection].images.original.gif_url;
            }
            return message.channel.send(giphyEmbed);
        })
        .catch((err) => {
            console.log(err);
        });
    },
};