const fetch = require('node-fetch');

module.exports = {
    name: 'hots-info',
    description: 'Pulls your MMR as recorded by HoTSLogs.com',
    cooldown: 30,
    args: true,
    usage: "<test#1234>",
    guildOnly: false,
    execute(message, args) {
        let usernameRegEx = RegExp('^[A-z]+#[0-9]+$');
        let url;

        mmrEmbed = {
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

        var mmrMessage = "";
        if (!usernameRegEx.test(args[0])) {
            message.reply("that is an invalid battletag.");
            return;
        } else {
            let battletag = args[0].replace("#","_");
            url = "".concat("https://api.hotslogs.com/Public/Players/1/",battletag);
        }
        fetch(url)
        .then(res => res.json())
        .then(json => {
            if (json === null) {
                message.reply("no player data found with the name " + args[0]);
                return;
            }
            fields = mmrEmbed.embed.fields;
            fields.push({name: "Player",value: json.Name});
            for (i = 0; i < json.LeaderboardRankings.length; i++) {
                fields.push({name: json.LeaderboardRankings[i].GameMode, value: json.LeaderboardRankings[i].CurrentMMR, inline: true })
                //fields.push("name": "${json.LeaderboardRankings[i].GameMode}", "value": "${json.LeaderboardRankings[i].CurrentMMR}", "inline": true);
                //mmrMessage = mmrMessage.concat("\n**Game Mode: ** ",json.LeaderboardRankings[i].GameMode);
                //mmrMessage = mmrMessage.concat("\n**MMR: ** ",json.LeaderboardRankings[i].CurrentMMR,"\n");
            }
            message.reply(mmrEmbed);
        });
    },
};