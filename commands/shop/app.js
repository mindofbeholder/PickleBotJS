const commando = require('discord.js-commando');
const Discord = require('discord.js');
const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();
const { ownerID } = require('../../config.json');

Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) { // jshint ignore:line
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount }); // jshint ignore:line
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

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
                    infinite: false
                },
                {
                    key: 'itemOrAmount',
                    label: 'Item Or Amount',
                    prompt: 'How much or what item??',
                    type: 'string',
                    infinite: false,
                    default: 1
                }
            ]
        });
    }

    async run(message, args) { // jshint ignore:line
    const currencyIcon = message.client.emojis.find("name", "monies");

    if (args.command === 'add') {
        if (message.author.id !== ownerID) {
            return message.channel.send("You don't have the authority to use that command.");
        }
		const target = message.mentions.users.first() || message.author;
        currency.add(target.id, parseInt(args.itemOrAmount,10));
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)} ${currencyIcon}`);

    }
    else if (args.command === 'balance') {

		const target = message.mentions.users.first() || message.author;
		return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)} ${currencyIcon}`);

	}
	else if (args.command === 'inventory') {

		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);

	}
	else if (args.command === 'transfer') {

		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
		if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author} you don't have that much.`);
		if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(`Successfully transferred ${transferAmount} ${currencyIcon} to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)} ${currencyIcon}`);

	}
	else if (args.command === 'buy') {

		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });
		if (!item) return message.channel.send('That item doesn\'t exist.');
		if (item.cost > currency.getBalance(message.author.id)) {
			return message.channel.send(`You don't have enough currency, ${message.author}`);
		}

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.cost);
		await user.addItem(item);

		message.channel.send(`You've bought a ${item.name}`);

	}
	else if (args.command === 'store') {

		const items = await CurrencyShop.findAll();
		return message.channel.send(items.map(i => `${i.name}: ${i.cost} ${currencyIcon}`).join('\n'), { code: false });

	}
	else if (args.command === 'leaderboard') {

		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.get(user.user_id).tag)}: ${user.balance} ${currencyIcon}`)
				.join('\n'),
			{ code: true }
		);
	}

    }
};