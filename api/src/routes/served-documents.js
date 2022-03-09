const Sequelize = require('sequelize');
const { models } = require('../model');
const { getIdParam } = require('../helpers');
const Op = Sequelize.Op;

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
		const servedDocument = await models.servedDocument.findOne({ where: { applicationId: req.query.applicationId } , include: { all: true }});
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
		const persistedObj = await models.servedDocument.create(req.body, {	include: [{ model: models.attachment}, {model: models.note}] } );
		res.status(201).json(persistedObj.dataValues);
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		updateNotes(req);
		const updatedObj = await models.servedDocument.update(req.body, {
			where: {
				id: id
			}
		});
		res.status(200).json(updatedObj.dataValues);
	} else {
		res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
	}
};

async function updateByApplicationId(req, res) {
	if (req.query.applicationId) { 
		updateNotes(req);
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

async function updateNotes(req) {
	const id = req.body.id;
	const newNotes = req.body.notes;
		
	const newNotesIds = newNotes.map(note => note.id);
	const oldNotes = await models.note.findAll({
		where: {
			servedDocumentId: id 
		}
	});
	const oldNotesIds = oldNotes.map(note => note.id)

	const deletedNotes = oldNotesIds.filter(x => !newNotesIds.includes(x));
	const addedNotes = newNotesIds.filter(x => !oldNotesIds.includes(x));
	const updatedNotes = newNotesIds.filter(x => oldNotesIds.includes(x));
	
	oldNotes.forEach(async n => {
		if (deletedNotes.includes(n.id)) {
			await models.note.destroy({
				where: {
					id: n.id
				}
			});
		}
	});
	newNotes.forEach(async n => {
		if (addedNotes.includes(n.id)) {
			n.servedDocumentId = id;
			await models.note.create(n);
		}
	});
	newNotes.forEach(async n => {
		if (updatedNotes.includes(n.id)) {
			n.servedDocumentId = id;
			await models.note.update(n, {
				where: {
					id: n.id
				}
			});
		}
	});
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
