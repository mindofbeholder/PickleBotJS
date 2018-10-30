const Discord = require('discord.js');
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();



Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {

		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	}
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

module.exports =  {

		addBalance: async (message, amount, silent = false, targetUser = null) => {

			const storedBalances = await Users.findAll();
			storedBalances.forEach(b => currency.set(b.user_id, b));

			const target = targetUser || message.mentions.users.first() || message.author;
			await currency.add(target.id, parseInt(amount,10));
			if (silent) {
				return {
					success: true,
					message: `${parseInt(amount,10)} added successfully to ${target}`
				}
			} else {
				const currencyIcon = message.client.emojis.find('name', 'monies');
				return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)} ${currencyIcon}`);
			}
		},

		addItem: async (message, purchaseItem, addCount = 1, silent = false, targetUser = null) => {

			const target = targetUser || message.mentions.users.first() || message.author;

			const item = await CurrencyShop.findOne({ 
				where: {
					name: {
						[Op.like]: purchaseItem
					}
				}
			});
			if (!item) {
				if (silent) {
					return {
						success: false,
						message: "No item by that name"
					}
				} else {
					return message.channel.send('That item doesn\'t exist.');
				}
			}

			const user = await Users.findOne({ 
				where: {
					user_id: target.id
				}
			});
			await user.addItem(item, addCount); 

			if (silent) {
				return {
					success: true,
					message: "Successfully added"
				}
			} else {
				message.channel.send(`Item successfully added.`);
			}

		},

		/**
		 * @desc Will find the balance for the user tagged on the message and will send message to channel the message originated in.
		 * @param {Object} message - The message making this call
		 */
		balance: async (message) => {
			const storedBalances = await Users.findAll();
			storedBalances.forEach(b => currency.set(b.user_id, b));
			const currencyIcon = message.client.emojis.find('name', 'monies');

			const target = message.mentions.users.first() || message.author;
			return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)} ${currencyIcon}`);

		},

		/**
		 * @desc Sends message to originating channel with tagged or mentioned users current inventory.
		 * @param {Object} message - The message used to make the request.
		 */
		inventory: async (message) => {

			const target = message.mentions.users.first() || message.author;
			const user = await Users.findOne({ 
				where: {
					user_id: target.id
				}
			});
			const items = await user.getItems(); 

			if (!items.length) {
				return message.channel.send(`${target.tag} has nothing!`);
			}
			return message.channel.send(`${target.tag} currently has ${items.map(t => `${t.amount} ${t.item.name}`).join(', ')}`);

		},
		transfer: async (message, amount) => {
			const storedBalances = await Users.findAll(); 
			storedBalances.forEach(b => currency.set(b.user_id, b));

			const currencyIcon = message.client.emojis.find('name', 'monies');

			const currentAmount = currency.getBalance(message.author.id);
			const transferAmount = amount;
			const transferTarget = message.mentions.users.first();

			if (!transferAmount || isNaN(transferAmount)) {
				return message.channel.send(`Sorry ${message.author}, that's an invalid amount`);
			}
			if (transferAmount > currentAmount) {
				return message.channel.send(`Sorry ${message.author} you don't have that much.`);
			}
			if (transferAmount <= 0) {
				return message.channel.send(`Please enter an amount greater than zero, ${message.author}`);
			}

			currency.add(message.author.id, -transferAmount);
			currency.add(transferTarget.id, transferAmount);

			return message.channel.send(`Successfully transferred ${transferAmount} ${currencyIcon} to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)} ${currencyIcon}`);

		},
		/**
		 * @desc Used to purchase currenty store items
		 * @param {Object} message - The message containing the request.
		 * @param {string} purchaseItem - The item being purchased.
		 * @param {boolean} [silent=false] - If true, will send message to originating channel regarding purchase. If silent, will suppress messages to channel.
		 */
		buy: async (message, purchaseItem, silent = false) => {
			const storedBalances = await Users.findAll(); 
			storedBalances.forEach(b => currency.set(b.user_id, b));

			const item = await CurrencyShop.findOne({ 
				where: {
					name: {
						[Op.like]: purchaseItem
					}
				}
			});
			if (!item) {
				if (silent) {
					return {
						success: false,
						message: "No item by that name"
					}
				} else {
					return message.channel.send('That item doesn\'t exist.');
				}
			}
			if (item.cost > currency.getBalance(message.author.id)) {
				if (silent) {
					return {
						success: false,
						message: `You don't have enough currency, ${message.author}`
					}
				} else {
					return message.channel.send(`You don't have enough currency, ${message.author}`);
				}
			}

			const user = await Users.findOne({ 
				where: {
					user_id: message.author.id
				}
			});
			currency.add(message.author.id, -item.cost);
			await user.addItem(item); 

			if (silent) {
				return {
					success: true,
					message: "Successfully purchased"
				}
			} else {
				message.channel.send(`You've bought a ${item.name}`);
			}

		},

		/**
		 * @desc Checks to see if an item is in your inventory and then uses it.
		 * @param {Object} message - The message containing the request.
		 * @param {string} usedItem - The item being used.
		 * @param {boolean} [silent=false] - If true, will send message to originating channel regarding purchase. If silent, will suppress messages to channel.
		 */
		useItem: async (message, usedItem, silent = false) => {

			const item = await CurrencyShop.findOne({ 
				where: {
					name: {
						[Op.like]: usedItem
					}
				}
			});
			if (!item) {
				if (silent) {
					return {
						success: false,
						message: "No item by that name"
					}
				} else {
					return message.reply('That item doesn\'t exist.')
				}
			}
			const user = await Users.findOne({ 
				where: {
					user_id: message.author.id
				}
			});
			if (await user.removeItem(item) == false) {
				if (silent) {
					return {
						success: false,
						message: "Didn't have the item."
					}
				} else {
					return message.reply('You don\'t have one of those.')
				}
			} else {
				if (silent) {
					return {
						success: true,
						message: "Item used successfully!"
					}
				} else {
					return message.reply('Item used successfully!')
				}
			}
		},

		/**
		 * @desc Lists all items available in the item store.
		 * @param {Object} message - The message containing the request.
		 */
		store: async (message) => {
			const currencyIcon = message.client.emojis.find('name', 'monies');

			const items = await CurrencyShop.findAll(); 
			return message.channel.send(items.map(i => `${i.name}: ${i.cost} ${currencyIcon}`).join('\n'), { code: false });

		}
};