const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fetch = require('node-fetch');

module.exports = class HotsInfo extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'hots-info',
            aliases: [],
            group: 'gaming',
            memberName: 'hots-info',
            description: 'Pulls your MMR as recorded by HoTSLogs.com',
            examples: ['hots-info test#1234'],
            guildOnly: false,

            args: [
                {
                    key: 'battletag',
                    label: 'battletag',
                    prompt: 'What is the battletag?',
                    type: 'string',
                    infinite: false
                }
            ]
        });
    }

    async run(message, args) {
        
        let usernameRegEx = RegExp('^[A-z]+#[0-9]+$');
        let url;

        let mmrEmbed = {
            "embed": {
              "title": "Heroes of the Storm MMR",
              "url": "https://www.hotslogs.com",
              "color": 3861131,
              "footer": {
                "text": "As provided by HotsLogs.com"
              },
              "fields": []
            }
        };

        if (!usernameRegEx.test(args.battletag)) {
            message.reply("that is an invalid battletag.");
            return;
        } else {
            let battletag = args.battletag.replace("#","_");
            url = "".concat("https://api.hotslogs.com/Public/Players/1/",battletag);
        }
        fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json === null) {
                message.reply("no player data found with the name " + args.battletag);
                return;
            }
            let fields = mmrEmbed.embed.fields;
            fields.push({name: "Player",value: json.Name});
            for (let i = 0; i < json.LeaderboardRankings.length; i++) {
                fields.push({name: json.LeaderboardRankings[i].GameMode, value: json.LeaderboardRankings[i].CurrentMMR, inline: true });
            }
            message.reply(mmrEmbed);
        });
    }
};