const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const snoowrap = require('snoowrap');
const { reddit } = require('../../config.json');

function subbredditNameValidation ( subreddit ) {
    if (subreddit.includes("/r/")) {
        subredditName = subreddit.substr(3);
    } else if (subreddit.includes("r/")) {
        subredditName = subreddit.substr(2);
    } else {
        subredditName = subreddit;
    }
    return ((2 < subredditName.length) && (subredditName.length < 21));
}

module.exports = class Reddit extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'reddit',
            aliases: ['r'],
            group: 'fun',
            memberName: 'reddit',
            description: 'Pulls a top post from reddit',
            examples: ['reddit'],
            guildOnly: true,
            throttling: {
                usages: 3,
                duration: 60
            },
            args: [
				{
					key: 'subreddit',
					label: 'subreddit',
					prompt: 'What subreddit did you want to pull from?',
                    type: 'string',
                    default: 'popular',
                    infinite: false,
                    validate: subbredditNameValidation,
                    error: "That is not a valid subreddit name. Please provide a valid subreddit name.\n\n"
				}
			]
        });
    }

    async run(message, args) { // jshint ignore:line
        const r = new snoowrap({
            userAgent: reddit.redditUserAgent,
            clientId: reddit.redditClientID,
            clientSecret: reddit.redditClientSecret,
            username: reddit.redditUsername,
            password: reddit.redditPassword
        });

        let subreddit = "";
        if (args.subreddit.includes("/r/")) {
            subreddit = args.subreddit.substr(3);
        } else if (args.subreddit.includes("r/")) {
            subreddit = args.subreddit.substr(2);
        } else {
            subreddit = args.subreddit;
        }

        r.getSubreddit(subreddit)
        .getTop({time: 'day'})
        .then(data => {
            console.log(data);
            if (data.length === 0) {
                return message.channel.send(`Unable to find any posts for ${args.subreddit.includes("r/") ? args.subreddit : "/r/" + args.subreddit}.\nPlease make sure you're providing the correct subreddit name.`);
            }
            let maxRange = data.length - 1;
            let minRange = 0;
            let selection = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange; // Grab a random number between 0 & results length
            let redditLink = "https://old.reddit.com" + data[selection].permalink;
            let redditTitle = data[selection].title;
            return message.channel.send(`${redditTitle}\n${redditLink}`);
        })
        .catch(err => {
            console.log(err);
            if (err.statusCode === 403) {
                return message.channel.send(`Looks like ${args.subreddit.includes("r/") ? args.subreddit : "/r/" + args.subreddit} is set to private. I'm afraid I can't see in there.`);
            }
            return message.channel.send('Error retrieving a post. Please try again!');
        });
    }
};