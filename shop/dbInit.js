const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
	operatorsAliases: false,
});

const CurrencyShop = sequelize.import('models/CurrencyShop');
sequelize.import('models/Users');
sequelize.import('models/UserItems');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => { // jshint ignore:line

	const shop = [
		CurrencyShop.upsert({ name: 'Purge', cost: 50 }),
		CurrencyShop.upsert({ name: 'ChangeNickname', cost: 25 }),
	];
	await Promise.all(shop); // jshint ignore:line
	console.log('Database synced');
	sequelize.close();

}).catch(console.error);