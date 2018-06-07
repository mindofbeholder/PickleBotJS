const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const overwatch = require('overwatch-api');

function usernameValidation ( username ) {
    let usernameRegEx = RegExp( '^[A-z]+#[0-9]+$' );
    return usernameRegEx.test( username );
}

module.exports = class Overwatch extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'overwatch',
            aliases: ['ow'],
            group: 'gaming',
            memberName: 'overwatch',
            description: 'Pulls OverWatch Profile Data',
            examples: ['overwatch test#1234'],
            guildOnly: false,
            throttling: {
                usages: 1,
                duration: 30
            },

            args: [
                {
                    key: 'battletag',
                    label: 'battletag',
                    prompt: 'What is the battleTag?',
                    type: 'string',
                    infinite: false,
                    validate: usernameValidation,
                    error: "Please respond with a valid battletag."
                },
                {
                    key: 'platform',
                    label: 'platform',
                    prompt: 'Gaming platform?',
                    type: 'string',
                    infinite: false,
                    oneOf: ['pc','xbl','psn'],
                    error: "Please reply with one of the following options: 'pc', 'xbl', or 'psn'.",
                    default: 'pc'
                },
                {
                    key: 'region',
                    label: 'region',
                    prompt: 'Playing region?',
                    type: 'string',
                    infinite: false,
                    oneOf: ['us','eu','kr','cn','global'],
                    error: "Please reply with one of the following options: 'us', 'eu', 'kr', 'cn', or 'global'.",
                    default: 'us'
                }
            ]
        });
    }

    async run(message, args) {

        const platform = args.platform;
        const region = args.region;
        const errorResponse = "\nI'm afraid we're unable to pull your data at this time.\nKeep in mind that BattleTags **are** case sensitive.\nPlease try again later.";

        let overWatchEmbed = {
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

        message.channel.startTyping();
        let tag = args.battletag.replace("#","-");
        try {
            overwatch.getProfile(platform, region, tag, (json) => {
                if (!json.username) {
                    message.channel.stopTyping();
                    return message.reply(errorResponse);
                }
                let fields = overWatchEmbed.embed.fields;
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
};