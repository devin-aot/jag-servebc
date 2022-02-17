const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('attachment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dateAdded: {
            type: DataTypes.DATE,
            field: 'date_added'
        },
        fileName: {
            type: DataTypes.STRING,
            field: 'file_name'
        },
        fileType: {
            type: DataTypes.STRING,
            field: 'file_type'
        },
        file: {
            type: DataTypes.STRING,
            field: 'file'
        }
	},
    {
        underscored: true,
        timestamps: false,
    });
};
