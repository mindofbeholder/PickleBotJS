const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const timediff = require('timediff');

module.exports = class Countdown extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'countdown',
            aliases: [],
            group: 'sr',
            memberName: 'countdown',
            description: 'Counts down the time until 5 PM',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 60
            },
        });
    }

    async run(message, args) { // jshint ignore:line
        const now = new Date();
        const todayDate = now.getFullYear() + '-' + ( now.getMonth() + 1 ) + '-' + now.getDate();
        const closingTime = new Date(todayDate + ' 17:00:00');
        let timeRemaining = timediff(now,closingTime,'HmS');
        
        if (timeRemaining.hours === 0 & timeRemaining.minutes === 0 & timeRemaining.seconds > 0) {
            message.channel.send('It\'s 5 PM! Move your ass!');
        } else if (timeRemaining.hours < 0 || timeRemaining.minutes < 0 || timeRemaining.seconds < 0) {
            message.channel.send(`Why are you still there? Work ended ${timeRemaining.hours < 0 ? timeRemaining.hours * -1 + (timeRemaining.hours * -1 > 1 ? ' hours' : ' hour') : ''}${timeRemaining.hours < 0 & timeRemaining.minutes < 0 ? ' and ': ''}${timeRemaining.minutes < 0 ? timeRemaining.minutes * -1 + (timeRemaining.minutes * -1 > 1 ? ' minutes': ' minute') : '' } ago!`);
        } else {
            message.channel.send(`Only ${timeRemaining.hours > 0 ? timeRemaining.hours + (timeRemaining.hours > 1 ? ' hours' : ' hour') : ''}${timeRemaining.hours > 0 & timeRemaining.minutes > 0 & timeRemaining.seconds > 0 ?  ', ' : (timeRemaining.hours > 0 & timeRemaining.minutes > 0 ? ' and ': '')}${timeRemaining.minutes > 0 ? timeRemaining.minutes + (timeRemaining.minutes > 1 ? ' minutes': ' minute') : '' }${(timeRemaining.hours > 0 & timeRemaining.minutes > 0 & timeRemaining.seconds) || (timeRemaining.minutes > 0 & timeRemaining.seconds > 0) > 0 ? ' and ': ''}${timeRemaining.seconds > 0 ? timeRemaining.seconds + (timeRemaining.seconds > 1 ? ' seconds': ' second') : '' } to go!`);
        }
    }
};