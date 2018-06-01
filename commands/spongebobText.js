module.exports = {
    name: 'spongebobtext',
    aliases: ['sb', 'sbt'],
    description: 'CoNvERtS tExT tO SpONGebOb tExt',
    args: true,
    guildOnly: false,
    execute(message, args) {
        var finalMessage = '';

        if (message.guild.members.get(message.author.id).nickname !== null) {
            finalMessage += `**${message.guild.members.get(message.author.id).nickname}** - `;
        } else {
            finalMessage += `**${message.author.username}** - `;
        }

        for (i = 0; i < args.length; i++) {
            for (t = 0; t < args[i].length ; t++) {
                if (Math.floor(Math.random() * 2) == 0) {
                    finalMessage += args[i][t].toUpperCase();
                } else {
                   finalMessage += args[i][t].toLowerCase();
                }
            }
            finalMessage += " ";
        }
        message.delete().then(
        message.channel.send(finalMessage));
    },
};