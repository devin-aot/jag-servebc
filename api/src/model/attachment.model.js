const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('attachment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
        timestamps: true,
        updatedAt: false,
        createdAt: 'dateAdded' 
    });
};
