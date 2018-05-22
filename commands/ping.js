module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 10,
    args: false,
    guildOnly: false,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};