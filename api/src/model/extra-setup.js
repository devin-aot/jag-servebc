function applyExtraSetup(sequelize) {
	const { 
		attachment, 
		documentStatus,
		documentType,
		note,
		servedDocument,
		staffGroup
	} = sequelize.models;


	// servedDocument relationships
	servedDocument.hasMany(attachment)
	attachment.belongsTo(servedDocument)

	servedDocument.hasMany(note)
	note.belongsTo(servedDocument)
	

}

module.exports = { applyExtraSetup };
