const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class FuckYou extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'fuck-you',
            aliases: ['fu'],
            group: 'fun',
            memberName: 'fuck-you',
            description: 'Displays a random Fuck You gif.',
            examples: ['fuck-you'],
            guildOnly: true,
        });
    }

    async run(message, args) {
        let selection = Math.floor(Math.random() * (5 - 0 + 1)) + 0;

        let listOfGifs = [
            "http://www.reactiongifs.com/wp-content/uploads/2013/11/subtle-fu.gif",
            "https://m0.her.ie/wp-content/uploads/2014/02/FU.gif",
            "http://www.reactiongifs.com/wp-content/uploads/2013/06/f-u.gif",
            "http://p.fod4.com/p/media/877ebc4f55/aHCeXAgR2WEncgX0jW2O_Smile%20Kid%20FU.gif",
            "https://m.popkey.co/9bdd8e/4VqvD.gif",
            "https://media1.tenor.com/images/15bef7f746cfa8b8271ebb8c7c8fa03f/tenor.gif?itemid=5545813"
        ];

        let richEmbed = {
            "embed": {
                "title": "",
                "color": 8612023,
                "footer": {
                "text": "Powered by Fuck You"
                },
                "image": {
                "url": ""
                }
            }
        };

        richEmbed.embed.image.url = listOfGifs[selection];
        message.channel.send(richEmbed);
    }
};