const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'area', {
        tx_nombre: {                 // abierto, procesado, anulado, diferido, en proceso
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
// ['co_ubicacion_interna', 'tx_ubicacion_interna','co_ubicacion_interna_padre','in_logica']
