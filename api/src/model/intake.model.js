const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('intake', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // issueId: {
        //     type: DataTypes.INTEGER,
        //     field: 'issue_id'
        // },
        // typeId: {
        //     type: DataTypes.INTEGER,
        //     field: 'type_id'
        // },
        dateReceived: {
            type: DataTypes.DATE,
            field: 'date_received'
        },
        // contactId: {
        //     type: DataTypes.INTEGER,
        //     field: 'contact_id'
        // },
        details: {
            type: DataTypes.STRING,
            field: 'details'
        },
        // responseTypeId: {
        //     type: DataTypes.INTEGER,
        //     field: 'response_type_id'
        // },
        dueDate: {
            type: DataTypes.DATE,
            field: 'due_date'
        },
        resolution: {
            type: DataTypes.STRING,
            field: 'resolution'
        },
        // intakeStatusId: {
        //     type: DataTypes.INTEGER,
        //     field: 'intake_status_id'
        // },
        responseCompleteDate: {
            type: DataTypes.DATE,
            field: 'response_complete_date'
        },
	});
};
