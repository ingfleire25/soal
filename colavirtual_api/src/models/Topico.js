const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'topico', {
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numerico: {
            type: DataTypes.INTEGER
        },
        tx_requisitos: {
            type: DataTypes.STRING
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    } )
};