const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const servedDocuments = await models.servedDocument.findAll();
	res.status(200).json(servedDocuments);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const servedDocument = await models.servedDocument.findByPk(id, { include: { all: true }});
	if (servedDocument) {
		res.status(200).json(servedDocument);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByQuery(req, res) {
	if (req.query.applicationId) {
		const servedDocument = await models.servedDocument.findOne({ where: { applicationId: req.query.applicationId } });
		if (servedDocument) {
			res.status(200).json(servedDocument);
		} else {
			res.status(404).send('404 - Not found');
		}
	} else getAll(req, res)
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		req.body.dateSubmitted = new Date()
		const persistedObj = await models.servedDocument.create(req.body);
		res.status(201).json(persistedObj.dataValues);
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.servedDocument.update(req.body, {
			where: {
				id: id
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
	}
};

async function updateByApplicationId(req, res) {
	if (req.query.applicationId) { 
		await models.servedDocument.update(req.body, {
			where: {
				applicationId: req.query.applicationId
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: applicationId query required.`);
	}
}

async function remove(req, res) {
	const id = getIdParam(req);
	await models.servedDocument.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	getByQuery,
	create,
	update,
	updateByApplicationId,
	remove,
};
