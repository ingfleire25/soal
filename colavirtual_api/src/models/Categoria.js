const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('categoria', {
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
};
