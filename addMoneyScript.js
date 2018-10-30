const Discord = require('discord.js');
const client = new Discord.Client();
const { token, ownerID } = require('./config.json');
const shopModule = require('./shop/app.js');

client.on('ready', async () => {
    console.log('Ready!');
    
    const wakeUpAlertUser = client.users.get(ownerID);
    wakeUpAlertUser.send(`Starting money script at ${Date()}`);
    
    let targetServer = client.guilds.get("343592642095087636");
    let targetChannel = targetServer.channels.get("448170535617036288");
    let targetMembers = targetChannel.members;
    targetMembers.forEach(async element => {
        if (element.user.bot) {
            return;
        } else {
            await shopModule.addBalance(null, 25, true, element);
            await shopModule.addItem({
                author: element
            }, "purge",1,true);
            await shopModule.addItem({
                author: element
            }, "tts",1,true);
        }
    });
    console.log("Finished");
    // process.exit();
});
client.on('error', err => {
    console.log(err);
});

client.login(token);