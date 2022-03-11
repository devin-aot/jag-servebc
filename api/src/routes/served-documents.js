const Sequelize = require('sequelize');
const { models } = require('../model');
const { getIdParam } = require('../helpers');
const Op = Sequelize.Op;

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
		req.body.documentStatusId = 1 // Received
		try {
			const persistedObj = await models.servedDocument.create(req.body, 
			{	
				include: [
					{ model: models.attachment }, 
					{ model: models.note }
				] 
			} );
			res.status(201).json(persistedObj.dataValues);            
        } catch(e) {
            if (e instanceof Sequelize.ValidationError) {
				return res.status(422).send(e.errors);
			} else {
				return res.status(400).send({
					message: e.message
				});
			}
        };
	}
};


function getUpdatableFields(fullObj) {
	const fieldsToExclude = ['id', 'applicationId']; 
	return Object.keys(fullObj).filter( s => !fieldsToExclude.includes(s))
}

async function updateByApplicationId(req, res) {
	if (req.query.applicationId) { 
		
		const updatableFields = getUpdatableFields(req.body)
		const updatedRows = await models.servedDocument.update(req.body, {
			where: {
				applicationId: req.query.applicationId
			},
			fields: updatableFields
		});
		if (updatedRows[0] > 0) {
			await updateNotes(req);
			const updatedObj = await models.servedDocument.findOne({ where: { applicationId: req.query.applicationId } , include: { all: true }});
			if (updatedObj) {
				res.status(200).json(updatedObj);
			} 
		} else {
			res.status(404).send('404 - Not found');
		}
	} else {
		res.status(400).send(`Bad request: applicationId query required.`);
	}
}

async function updateNotes(req) {
	const id = req.body.id;
	const newNotes = req.body.notes || [];
		
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


module.exports = {
	"getById_auth": true,
	"getByQuery_auth": true,
	"updateByApplicationId_auth": true,
	getById,
	getByQuery,
	create,
	updateByApplicationId,

};
