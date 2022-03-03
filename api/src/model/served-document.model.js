const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('servedDocument', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contactFullName: {
            type: DataTypes.STRING,
            field: 'contact_full_name'
        },
        contactEmail: {
            type: DataTypes.STRING,
            field: 'contact_email'
        },
        contactPhone: {
            type: DataTypes.STRING,
            field: 'contact_phone'
        },
        lawyerName: {
            type: DataTypes.STRING,
            field: 'lawyer_name'
        },
        lawyerPhone: {
            type: DataTypes.STRING,
            field: 'lawyer_phone'
        },
        partyName: {
            type: DataTypes.STRING,
            field: 'party_name'
        },
        streetAddress: {
            type: DataTypes.STRING,
            field: 'street_address'
        },
        city: {
            type: DataTypes.STRING,
            field: 'city'
        },
        province: {
            type: DataTypes.STRING,
            field: 'province'
        },
        postalCode: {
            type: DataTypes.STRING,
            field: 'postal_code'
        },
        country: {
            type: DataTypes.STRING,
            field: 'country'
        },
        serviceEmail: {
            type: DataTypes.STRING,
            field: 'service_email'
        },
        serviceFaxNumber: {
            type: DataTypes.STRING,
            field: 'service_fax_number'
        },
        courtOrTribunal: {
            type: DataTypes.STRING,
            field: 'court_or_tribunal'
        },
        registry: {
            type: DataTypes.STRING,
            field: 'registry'
        },
        courtNumber: {
            type: DataTypes.STRING,
            field: 'court_number'
        },
        isCriminal: {
            type: DataTypes.BOOLEAN,
            field: 'is_criminal'
        },
        dateSubmitted: {
            type: DataTypes.DATE,
            field: 'date_submitted'
        },
        submitterEmailSent: {
            type: DataTypes.STRING,
            field: 'submitter_email_sent'
        },
        servedDate: {
            type: DataTypes.DATE,
            field: 'served_date'
        },
        closedDate: {
            type: DataTypes.DATE,
            field: 'closed_date'
        },
	},
    {
        underscored: true,
        timestamps: false,
    });
};
