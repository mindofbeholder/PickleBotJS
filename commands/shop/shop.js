const commando = require('discord.js-commando');
const shopModule = require('../../shop/app.js');
const { ownerID } = require('../../config.json');

module.exports = class monies extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'currency',
            aliases: ['shop'],
            group: 'shop',
            memberName: 'shop',
            description: 'Main shop command',
            examples: ['shop'],
            guildOnly: false,

            args: [
                {
                    key: 'command',
                    label: 'Command',
                    prompt: 'What is the command you wish to use?',
                    type: 'string',
                    infinite: false,
                    default: 'balance'
                },
                {
                    key: 'itemOrAmount',
                    label: 'Item Or Amount',
                    prompt: 'How much or what item??',
                    type: 'string',
                    infinite: false,
                    default: "1"
                },
                {
                    key: 'count',
                    label: 'Count',
                    prompt: 'How much?',
                    type: 'integer',
                    infinite: false,
                    default: 1
                },
            ]
        });
    }

	async run(message, args) {
		if (args.command === 'add') {
            if (message.author.id !== ownerID) {
				return message.channel.send('You don\'t have the authority to use that command.');
			}
			shopModule.addBalance(message,args.itemOrAmount);
		}
		else if (args.command === 'addItem') {
			if (message.author.id !== ownerID) {
				return message.channel.send('You don\'t have the authority to use that command.');
            }
			shopModule.addItem(message,args.itemOrAmount,args.count);
		}
		else if (args.command === 'balance') {
			shopModule.balance(message);
		}
		else if (args.command === 'inventory') {
            shopModule.inventory(message);
		}
		else if (args.command === 'transfer') {
            shopModule.transfer(message,args.itemOrAmount);
		}
		else if (args.command === 'buy') {
            shopModule.buy(message,args.itemOrAmount);
		}
		else if (args.command === 'store') {
            shopModule.store(message);
		} else {
			message.reply(`No command named "${args.command}"`);
		}

    }
};