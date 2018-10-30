const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const shopModule = require('../../shop/app.js');

module.exports = class tts extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'tts',
            aliases: [],
            group: 'shop',
            memberName: 'tts',
            description: 'Text to speach command',
            details: oneLine`
                Will print up to 900 characters in multi-message
                text to speech.
            `,
            examples: ['tts This is text to speech'],
            guildOnly: true,

            args: [
                {
                    key: 'text',
                    label: 'text',
                    prompt: 'Enter your text to speach text',
                    type: 'string',
                    infinite: false,
                    max: 900,
                }
            ]
        });
    }

    async run(message, args) {

        const canUseItem = await shopModule.useItem(message,"tts",true);
        if (!canUseItem.success) {
            const canBuyItem = await shopModule.buy(message,"tts",true);
            if (!canBuyItem.success) {
                return message.reply("You don't have the money to use that command");
            } else {
                await shopModule.useItem(message,"tts",true);
            }
        }

        let part1 = ""
        let part2 = ""
        let part3 = ""
        let part4 = ""
        let part5 = ""
        let part6 = ""
        let remainder = ""
        let lastWhiteSpace = 0

        if (args.text.length <= 181) {
            part1 = args.text;
        }

        if (args.text.length > 181) {
            part1 = args.text.substring(0,180);
            lastWhiteSpace = part1.lastIndexOf(" ");
            part1 = args.text.substring(0,lastWhiteSpace);
            remainder = args.text.substring(lastWhiteSpace);
        }
        if (remainder.length > 181) {
            part2 = remainder.substring(0,180);
            lastWhiteSpace = part2.lastIndexOf(" ");
            part2 = part2.substring(0,lastWhiteSpace);
            remainder = remainder.substring(lastWhiteSpace);
        }
        if (remainder.length > 181) {
            part3 = remainder.substring(0,180);
            lastWhiteSpace = part3.lastIndexOf(" ");
            part3 = part3.substring(0,lastWhiteSpace);
            remainder = remainder.substring(lastWhiteSpace);
        }
        if (remainder.length > 181) {
            part4 = remainder.substring(0,180);
            lastWhiteSpace = part4.lastIndexOf(" ");
            part4 = part4.substring(0,lastWhiteSpace);
            remainder = remainder.substring(lastWhiteSpace);
        }
        if (remainder.length > 181) {
            part5 = remainder.substring(0,180);
            lastWhiteSpace = part5.lastIndexOf(" ");
            part5 = part5.substring(0,lastWhiteSpace);
            remainder = remainder.substring(lastWhiteSpace);
        }
        if (remainder.length < 181) {
            part6 = remainder
        }
        if (part1) {
            await message.channel.send(part1,{tts:true})
        }
        if (part2) {
            await message.channel.send(part2,{tts:true})
        }
        if (part3) {
            await message.channel.send(part3,{tts:true})
        }
        if (part4) {
            await message.channel.send(part4,{tts:true})
        }
        if (part5) {
            await message.channel.send(part5,{tts:true})
        }
        if (part6) {
            await message.channel.send(part6,{tts:true})
        }

        return;
    }
};