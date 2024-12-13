const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'conteo', {
        fh_atencion: {                 // abierto (amarillo), procesado (verde), anulado (rojo)
            type: DataTypes.STRING,
            allowNull: false
        },
        uaId: {     // id en siga
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    }, { timestamps: false } )
};
// ['co_ubicacion_interna', 'tx_ubicacion_interna','co_ubicacion_interna_padre','in_logica']
