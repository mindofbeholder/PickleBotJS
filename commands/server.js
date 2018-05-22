module.exports = {
    name: 'server',
    description: 'Displays server name and total membership.',
    cooldown: 60,
    args: false,
    guildOnly: true,
    execute(message, args) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    },
};