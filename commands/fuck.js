module.exports = {
    name: 'fuck',
    description: 'Fuck!',
    args: false,
    guildOnly: true,
    execute(message, args) {
        message.channel.send('You.');
    },
};