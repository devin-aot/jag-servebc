const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
	sequelize.define('staffGroup', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        staffGroup: {
            type: DataTypes.STRING,
            field: 'staff_group'
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
