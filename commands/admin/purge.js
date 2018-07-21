const commando = require('discord.js-commando');

module.exports = class Purge extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'admin-purge',
            aliases: ['p'],
            group: 'admin',
            memberName: 'admin-purge',
            description: 'Deletes up to 99 previous messages.',
            examples: ['admin-purge 5'],
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES'],

            args: [
                {
                    key: 'purgeCount',
                    label: 'purgeCount',
                    prompt: 'How many messages do you want to delete?',
                    type: 'integer',
                    min: 1,
                    max: 99,
                    default: 1,
                    infinite: false
                }
            ]
        });
    }

    async run(message, args) {
        const deleteCount = args.purgeCount + 1;
        const fetched = await message.channel.fetchMessages({limit: deleteCount});
        message.channel.bulkDelete(fetched)
        .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
};