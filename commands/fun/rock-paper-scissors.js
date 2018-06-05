const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

var adversary;
var challenger;
var battleChannel;

function challengeResponseFilter ( message ) {
    if ( message.author == adversary ) {
        let challengeRespone =  message.content.toLowerCase();
        if ( challengeRespone.includes('yes') || challengeRespone.includes('no') || challengeRespone.includes('sure') || challengeRespone.includes('nope') || challengeRespone.includes('i accept') || challengeRespone.includes('i do not accept') || challengeRespone.includes('i don\'t accept') ) {
            return true;
        } 
    }
    return false;
}

function competitorChoiceFilter ( reaction, user ) {
    if (reaction.emoji.name === '✊' || reaction.emoji.name === '📰' || reaction.emoji.name === '✂' ) {
        return true;
    }
    return false;
}

function botMessageFilter ( message ) {
    if ( message.content.includes ('Do you choose rock, paper, or scissors?') ) {
        return true;
    }
    return false;
}

async function fightSequence ( user, message ) { // jshint ignore:line
    if (user.dmChannel == null) {
        await user.createDM(); // jshint ignore:line
    }
    await user.send("***READ CAREFULLY***\nDo you choose rock, paper, or scissors? Please ***react*** to this message with one of the following emojis\n:fist: (fist) :newspaper: (newspaper) :scissors: (scissors)"); // jshint ignore:line
    return user.dmChannel.lastMessage.awaitReactions(competitorChoiceFilter, { max: 1, time: 60000, errors: ['time']})
    .then( (collected) => {
        user.send( `You selected ${collected.first().emoji.name}` );
        return collected.first().emoji.name;
    })
    .catch( err => {
        user.send('You failed to respond in time. Canceling challenge.');
        return null;
    });
}

async function processResults ( challenger, adversary, challengerSelection, adversarySelection, battleChannel ) { // jshint ignore:line
    if (challengerSelection == null || adversarySelection == null) {
        return battleChannel.send('One of the competitors did not react in time. The challenge has been canceled.');
    }
    let challengerNickname = await battleChannel.members.get(challenger.id).nickname; // jshint ignore:line
    let challengerName = "";
    if (challengerNickname !== null) {
        challengerName = challengerNickname;
    } else {
        challengerName = challenger.username;
    }

    let adversaryNickname = await battleChannel.members.get(adversary.id).nickname; // jshint ignore:line
    let adversaryName = "";
    if (adversaryNickname !== null) {
        adversaryName = adversaryNickname;
    } else {
        adversaryName = adversary.username;
    }

    let resultsEmbed = {
        "embed": {
            "title": `${challengerName} vs ${adversaryName} Results`,
            "color": 1490005,
            "fields": [
                {
                    "name": "Results",
                    "value": "",
                    "inline": false
                },
                {
                    "name": challengerName,
                    "value": challengerSelection,
                    "inline": true
                },
                {
                    "name": adversaryName,
                    "value": adversarySelection,
                    "inline": true
                }
            ]
        }
    };

    let finalResults = resultsEmbed.embed.fields[0];

    if (challengerSelection == adversarySelection) {
        finalResults.value = "It's a tie!";
    } else if (challengerSelection == '✊' && adversarySelection == '📰') {
        finalResults.value = `${adversaryName} wins!`;
    } else if (challengerSelection == '✊' && adversarySelection == '✂') {
        finalResults.value = `${challengerName} wins!`;
    } else if (challengerSelection == '📰' && adversarySelection == '✊') {
        finalResults.value = `${challengerName} wins!`;
    } else if (challengerSelection == '📰' && adversarySelection == '✂') {
        finalResults.value = `${adversaryName} wins!`;
    } else if (challengerSelection == '✂' && adversarySelection == '✊') {
        finalResults.value = `${adversaryName} wins!`;
    } else if (challengerSelection == '✂' && adversarySelection == '📰') {
        finalResults.value = `${challengerName} wins!`;
    }

    battleChannel.send(resultsEmbed);
}

module.exports = class RockPaperScissors extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'rock-paper-scissors',
            aliases: ['rps'],
            group: 'fun',
            memberName: 'rock-paper-scissors',
            description: 'Allows you to play rock paper scissors against another user',
            details: oneLine`
                
            `,
            examples: ['rock-paper-scissors @otherUser'],
            guildOnly: true,

            args: [
                {
                    key: 'adversary',
                    label: 'adversary',
                    prompt: 'Please mention your adversary',
                    type: 'user',
                    infinite: false
                }
            ]
        });
    }

    async run(message, args) { // jshint ignore:line
        adversary = args.adversary;
        challenger = message.author;
        battleChannel = message.channel;

        message.channel.send(`${adversary}, do you accept the rock, paper, scissors challenge against ${challenger}?`);
        const challengeResponse = message.channel.createMessageCollector(challengeResponseFilter, { time: 30000, maxMatches: 1 });
        
        challengeResponse.on('end', collected => {
            if (collected.first() == undefined) {
                return message.channel.send(`${adversary} did not respond in time. ${challenger}'s challenge went unanswered.`);
            } else if (collected.first().content.includes('no') || collected.first().content.includes('nope') || collected.first().content.includes('i do not accept') || collected.first().content.includes('i don\'t accept')) {
                return message.channel.send(`${adversary} has declined your challenge ${challenger}.`);
            } else {
                message.channel.send('Challenge accepted!\nCompetitors have 60 seconds to react to my DM.');

                const challengerFight = fightSequence(challenger, message);
                const adversaryFight = fightSequence(adversary, message);

                Promise.all([challengerFight, adversaryFight])
                .then(results => {
                    console.log(results);
                    processResults(challenger, adversary, results[0], results[1], battleChannel);
                });

            }
        });

    }
};