const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('documentType', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        documentType: {
            type: DataTypes.STRING,
            field: 'document_type'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active'
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
