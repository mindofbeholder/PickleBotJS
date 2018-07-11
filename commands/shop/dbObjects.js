const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
	operatorsAliases: false,
});

const Users = sequelize.import('models/Users');
const CurrencyShop = sequelize.import('models/CurrencyShop');
const UserItems = sequelize.import('models/UserItems');

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Users.prototype.addItem = async function(item) { // jshint ignore:line
	const useritem = await UserItems.findOne({ // jshint ignore:line
		where: { user_id: this.user_id, item_id: item.id },
	});

	if (useritem) {
		useritem.amount += 1;
		return useritem.save();
	}

	return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
}; // jshint ignore:line

Users.prototype.getItems = function() {
	return UserItems.findAll({
		where: { user_id: this.user_id },
		include: [ 'item' ],
	});
};

module.exports = { Users, CurrencyShop, UserItems };