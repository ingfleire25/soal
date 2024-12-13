const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'tipo', {
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    } )
};