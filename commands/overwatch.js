const overwatch = require('overwatch-api');

module.exports = {
    name: 'overwatch',
    aliases: ['ow'],
    description: 'Pulls your OverWatch Profile Data',
    cooldown: 30,
    args: true,
    usage: "<test#1234>",
    guildOnly: false,
    execute(message, args) {
        const usernameRegEx = RegExp('^[A-z]+#[0-9]+$');
        const platform = "pc";
        const region = "us";
        const errorResponse = "\nI'm afraid we're unable to pull your data at this time.\nKeep in mind that BattleTags **are** case sensitive.\nPlease try again later.";

        overWatchEmbed = {
            "embed": {
              "title": "OverWatch Stats",
              "color": "3861131",
              "thumbnail": {
                "url": ""
              },
              "footer": {
                "text": "Provided by PickleBot"
              },
              "fields": []
            }
        };

        if (!usernameRegEx.test(args[0])) {
            message.reply("that is an invalid battletag.");
            return;
        } else {
            message.channel.startTyping();
            let tag = args[0].replace("#","-");
            try {
                overwatch.getProfile(platform, region, tag, (json) => {
                    if (!json.username) {
                        message.channel.stopTyping();
                        return message.reply(errorResponse);
                    }
                    fields = overWatchEmbed.embed.fields;
                    fields.push({name: "Player",value: json.username});
                    fields.push({name: "Level",value: json.level});
                    if (json.competitive) {
                        if (json.competitive.rank_img) {
                            overWatchEmbed.embed.thumbnail.url = json.competitive.rank_img;
                        }
                        if (json.competitive.rank) {
                            fields.push({name: "Season Rank",value: json.competitive.rank});
                        }
                    }

                    message.channel.stopTyping();
                    message.reply(overWatchEmbed);
                });
            } catch (err) {
                message.channel.stopTyping();
                console.log(err);
                message.reply(errorResponse);
            }
        }
    },
};