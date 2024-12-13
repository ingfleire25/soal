const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'localidad', {
        tx_nombre: {                 // abierto (amarillo), procesado (verde), anulado (rojo)
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
            defaultValue: false,
        }
    } )
};
// ['co_ubicacion_interna', 'tx_ubicacion_interna','in_logica']
