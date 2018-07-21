const commando = require('discord.js-commando');
const shopModule = require('../../shop/app.js');

module.exports = class shopPurge extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: [],
            group: 'shop',
            memberName: 'shop-purge',
            description: '',
            examples: ['purge'],
            guildOnly: true,
        });
    }

    async run(message) {
        const canUsePurgeItem = await shopModule.useItem(message,"purge",true);
        if (!canUsePurgeItem.success) {
            const canBuyPurgeItem = await shopModule.buy(message,"purge",true);
            if (!canBuyPurgeItem.success) {
                return message.reply("You don't have the money to use that command");
            } else {
                await shopModule.useItem(message,"purge",true);
            }
        }

        const fetched = await message.channel.fetchMessages({limit: 2});
        message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
};