const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class SpongeBobText extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'spongebobtext',
            aliases: ['sb','sbt'],
            group: 'fun',
            memberName: 'spongebobtext',
            description: 'CoNvERtS tExT tO SpONGebOb tExt',
            details: oneLine`
                
            `,
            examples: ['spongebobtext some random text'],
            guildOnly: false,

            args: [
                {
                    key: 'inputText',
                    label: 'inputText',
                    prompt: 'Need some input text',
                    type: 'string',
                    infinite: true
                }
            ]
        });
    }

    async run(message, args) {
        
        var finalMessage = '';

        if (message.guild.members.get(message.author.id).nickname !== null) {
            finalMessage += `**${message.guild.members.get(message.author.id).nickname}** - `;
        } else {
            finalMessage += `**${message.author.username}** - `;
        }

        for (let i = 0; i < args.inputText.length; i++) {
            for (let t = 0; t < args.inputText[i].length ; t++) {
                if (Math.floor(Math.random() * 2) == 0) {
                    finalMessage += args.inputText[i][t].toUpperCase();
                } else {
                   finalMessage += args.inputText[i][t].toLowerCase();
                }
            }
            finalMessage += " ";
        }
        message.delete().then(
        message.channel.send(finalMessage));
    }
};