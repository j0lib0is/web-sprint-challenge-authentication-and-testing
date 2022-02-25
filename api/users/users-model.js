const db = require('../../data/dbConfig');

function getById(id) {
	return db('users').where({ id }).first();
};

function getBy(filter) {
	return db('users').where(filter);
};

async function add(user) {
	const [id] = await db('users').insert(user);
	return getById(id);
};

module.exports = {
	getById,
	getBy,
	add
}