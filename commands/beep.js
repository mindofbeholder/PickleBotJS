module.exports = {
    name: 'beep',
    description: 'Beep!',
    args: false,
    guildOnly: true,
    execute(message, args) {
        message.channel.send('Boop.');
    },
};