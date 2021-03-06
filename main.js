const { token, ownerID } = require('./config.json');
const commando = require('discord.js-commando');
// const Discord = require('discord.js');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const sqlite = require('sqlite');

const client = new commando.Client({
	owner: ownerID,
	commandPrefix: 'cdev'
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
        if (ownerID) {
            const wakeUpAlertUser = client.users.get(ownerID);
            wakeUpAlertUser.send(`I just woke up at ${Date()}`);
		}
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) {
			return console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
		}
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});

client.setProvider(
	sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(console.error);

client.registry
	.registerGroups([
		{ id: 'fun', name: 'Fun' },
		{ id: 'gaming', name: 'Gaming' },
		{ id: 'admin', name: 'Administrative' },
		{ id: 'sr', name: 'sr' },
		{ id: 'shop', name: 'Shop' }
	])
	.registerDefaults()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);