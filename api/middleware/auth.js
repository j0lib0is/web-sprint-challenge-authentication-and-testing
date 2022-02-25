const Users = require('../users/users-model');

const checkUser = async (req, res, next) => {
	const { username } = req.body;
	const existingUser = await Users.getBy({ username }).first();

	if (existingUser) {
		req.user = existingUser;
		next();
	} else {
		next({ status: 401, message: 'invalid credentials'})
	}
};

module.exports = {
	checkUser
}