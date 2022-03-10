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
	
	documentType.hasOne(servedDocument)
	servedDocument.belongsTo(documentType)

	documentStatus.hasOne(servedDocument)
	servedDocument.belongsTo(documentStatus)

	staffGroup.hasOne(servedDocument)
	servedDocument.belongsTo(staffGroup)

}

module.exports = { applyExtraSetup };
