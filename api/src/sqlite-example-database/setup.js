const sequelize = require('../model');
const { pickRandom, randomDate } = require('./helpers/random');

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


async function reset() {
	console.log('Will rewrite the SQLite example database, adding some dummy data.');
	
	await sequelize.sync({ force: true });
	

	await sequelize.models.intakeStatus.bulkCreate([
		{ 
			intakeStatus: 1,
			isActive: true
		}
	]);
	
	await sequelize.models.intakeType.bulkCreate([
		{ 
			intakeType: 1,
			isActive: true
		}
	]);

	await sequelize.models.category.bulkCreate([
		{ 
			categoryName: 'category1',
			isActive: true
		},
		{ 
			categoryName: 'category2',
			isActive: true
		},
		{ 
			categoryName: 'category3',
			isActive: true
		},
	]);

	await sequelize.models.communicationLog.bulkCreate([
		{ 
			issueId: 1,
			date: new Date(),
			body: 'test...'
		}
	]);
	
	await sequelize.models.contact.bulkCreate([
		{ 
			dateAdded: new Date(),
			contactType: 1,
			name: 'Mickey Mouse',
			phone: '778 123 4567',
			address: '123 Disney St.',
			notes: 'Notes...'
		}
	]);
	
	
	await sequelize.models.dispositionStatus.bulkCreate([
		{ 
			dispositionStatusName: 'dispositionStatus1',
			isActive: true
		},
		{ 
			dispositionStatusName: 'dispositionStatus2',
			isActive: true
		},
		{ 
			dispositionStatusName: 'dispositionStatus3',
			isActive: true
		},
	]);

	await sequelize.models.regulatoryBody.bulkCreate([
		{ 
			regulatoryBodyName: 'regulatoryBody1',
			isActive: true
		},
		{ 
			regulatoryBodyName: 'regulatoryBody2',
			isActive: true
		},
		{ 
			regulatoryBodyName: 'regulatoryBody3',
			isActive: true
		},
	]);

	await sequelize.models.responseType.bulkCreate([
		{ 
			responseType: 1,
			isActive: true
		}
	]);
	
	await sequelize.models.role.bulkCreate([
		{ 
			roleName: 'Manager'
		}
	]);

	await sequelize.models.user.bulkCreate([
		{ 
			idir: 'jack-sparrow',
			dateAdded: new Date(),
			roleId: 1
		},
		{ 
			idir: 'white-beard',
			dateAdded: new Date(),
			roleId: 1
		},
		{ 
			idir: 'black-beard',
			dateAdded: new Date(),
			roleId: 1
		},
		{ 
			idir: 'brown-beard',
			dateAdded: new Date(),
			roleId: 1
		},
	]);

	await sequelize.models.issue.bulkCreate([
		{ 
			issueNumber: 1,
			issueName: 'test1',
			dateOpened: new Date(),
			statusId: 1
		},
		{ 
			issueNumber: 2,
			issueName: 'test2',
			dateOpened: new Date(),
			statusId: 4
		},
		{ 
			issueNumber: 3,
			issueName: 'test3',
			dateOpened: new Date(),
			statusId: 3
		},
	]);

	await sequelize.models.intake.bulkCreate([
		{ 
			issueId: 1,
			intakeTypeId: 1,
			dateReceived: new Date(),
			contactId: 1,
			details: 'Test details',
			responseTypeId: 1,
			dueDate: 1,
			resolution: 'Test resolution',
			intakeStatusId: 1,
			responseCompleteDate: new Date()
		}
	], {
		include: [ contact, responseType, intakeStatus, intakeType ]
	  });

	await sequelize.models.attachment.bulkCreate([
		{ 
			intakeId: 1,
			dateAdded: new Date(),
			fileName: 'document.doc',
			fileType: 'Contract'
		}
	]);
	// await sequelize.models.orchestra.bulkCreate([
	// 	{ name: 'Jalisco Philharmonic' },
	// 	{ name: 'Symphony No. 4' },
	// 	{ name: 'Symphony No. 8' },
	// ]);

	// // Let's create random instruments for each orchestra
	// for (const orchestra of await sequelize.models.orchestra.findAll()) {
	// 	for (let i = 0; i < 10; i++) {
	// 		const type = pickRandom([
	// 			'violin',
	// 			'trombone',
	// 			'flute',
	// 			'harp',
	// 			'trumpet',
	// 			'piano',
	// 			'guitar',
	// 			'pipe organ',
	// 		]);

	// 		await orchestra.createInstrument({
	// 			type: type,
	// 			purchaseDate: randomDate()
	// 		});

	// 		// The following would be equivalent in this case:
	// 		// await sequelize.models.instrument.create({
	// 		// 	type: type,
	// 		// 	purchaseDate: randomDate(),
	// 		// 	orchestraId: orchestra.id
	// 		// });
	// 	}
	// }

	console.log('Done!');
}

reset();
