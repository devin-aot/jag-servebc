const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class Issue extends Model {}
Issue.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    issueNumber: {
        type: DataTypes.INTEGER,
        field: 'issue_number'
    },
    issueName: {
        type: DataTypes.STRING,
        field: 'issue_name'
    },
    dateOpened: {
        type: DataTypes.DATE,
        field: 'date_opened'
    },
    statusId: {
        type: DataTypes.INTEGER,
        field: 'status_id'
    }
}, { sequelize, modelName: 'issue' });

(async () => {
    await sequelize.sync();
    const issue1 = await Issue.create({
        issueNumber: 98765,
        issueName: 'Test Issue',
        dateOpened: new Date(),
        statusId: 1  
    });
    console.log(issue1.toJSON());
})();