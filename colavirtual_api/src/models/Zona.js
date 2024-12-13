const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'zona', {
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        co_ubicacion_interna: {     // id en siga
            type: DataTypes.INTEGER,
            // allowNull: false,
            unique: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    } )
}