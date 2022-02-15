function applyExtraSetup(sequelize) {
	const { 
		attachment, 
		category,
		communicationLog,
		contact,
		dispositionStatus,
		intakeStatus,
		intakeType,
		intake,
		issue,
		regulatoryBody,
		responseType,
		role,
		user
	} = sequelize.models;

	// orchestra.hasMany(instrument);
	// instrument.belongsTo(orchestra);

	intake.hasMany(attachment)
	attachment.belongsTo(intake)
	contact.hasOne(intake)
	intake.belongsTo(contact)

	issue.hasOne(intake)
	intake.belongsTo(issue)

	intakeType.hasOne(intake)
	intake.belongsTo(intakeType)

	responseType.hasOne(intake)
	intake.belongsTo(responseType)

	intakeStatus.hasOne(intake)
	intake.belongsTo(intakeStatus)

}

module.exports = { applyExtraSetup };
