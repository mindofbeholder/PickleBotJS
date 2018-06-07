const { giphyAPIKey } = require('../../config.json');
const GphApiClient = require('giphy-js-sdk-core');
const commando = require('discord.js-commando');
const client = GphApiClient(giphyAPIKey);
const oneLine = require('common-tags').oneLine;

module.exports = class GiphyCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'gif',
			aliases: [],
			group: 'fun',
			memberName: 'gif',
			description: 'Pulls a gif based on your search terms.',
			details: oneLine`
                You can enter search terms and this gif will pull
                10 gifs from GIPHY with those terms and randomly display
                one.
			`,
            examples: ['gif super sad'],
            guildOnly: false,

			args: [
				{
					key: 'query',
					label: 'search_query',
					prompt: 'What is your gif search term?',
					type: 'string',
					infinite: true
				}
			]
		});
	}

	async run(message, args) {
        var query = "";
        let maxGifRange = 5;
        let minGifRange = 0;
        var selection = Math.floor(Math.random() * (maxGifRange - minGifRange + 1)) + minGifRange; // Grab a random number between 0 & 5

        var giphyEmbed = { // Prep the rich embed object
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

        for (let i = 0; i < args.query.length; i++) { // Smash the arguments together into a single string
            query += args.query[i] + " ";
        }

        client.search('gifs', {"q": query, "limit": 5, "rating": 'r',"fmt": 'json', "sort": "relevant"})
        .then((response) => {
            if (response.data.length == 0) { // If no gifs are returned then send a "no gif found' response
                giphyEmbed.embed.title = "No Gif Found";
                giphyEmbed.embed.image.url = "https://media.giphy.com/media/kWMoRLEYSLoGvZ8zrB/giphy.gif";
            } else {
                giphyEmbed.embed.image.url = response.data[selection].images.original.gif_url; // Grab a random gif from an array of 10 based on the randomly generated 'selection'
            }
            return message.channel.send(giphyEmbed);
        })
        .catch((err) => {
            console.log(err);
            giphyEmbed.embed.title = "Something went wrong"
            giphyEmbed.embed.image.url = "https://media.giphy.com/media/rftarkt7Ki2Gs/giphy.gif"
            return message.channel.send(giphyEmbed);
        });
		
	}
};