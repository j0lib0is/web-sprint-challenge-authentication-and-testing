const Users = require('../users/users-model');

const validateFields = async (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		next({status: 401, message: 'username and password required' });
	} else {
		next();
	}
};

const checkUsername = async (req, res, next) => {
	const { username } = req.body;
	const existingUser = await Users.getBy({ username }).first();

	if (existingUser) {
		next({ status: 401, message: 'username taken' });
	} else {
		next();
	}
};

const checkUser = async (req, res, next) => {
	const { username } = req.body;
	const existingUser = await Users.getBy({ username }).first();

	if (existingUser) {
		req.user = existingUser;
		next();
	} else {
		next({ status: 401, message: 'invalid credentials' });
	}
};

module.exports = {
	validateFields,
	checkUsername,
	checkUser
};