const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('documentStatus', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        documentStatus: {
            type: DataTypes.STRING,
            field: 'document_status'
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
