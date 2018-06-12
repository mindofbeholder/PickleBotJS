const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const snoowrap = require('snoowrap');
const { reddit } = require('../../config.json');

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

        r.getSubreddit('funny')
        .getTop({time: 'day'})
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        });
    }
};