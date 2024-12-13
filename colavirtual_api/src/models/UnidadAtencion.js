const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'ua', { // unidades de atención
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: { // lo nombre pueden contener todo tipo de símbolos parece
            //     is: /^[ a-zA-Z0-9À-ÿ\u00f1\u00d1]*$/g
            // }
        },
        co_ubicacion_interna: {     // id en siga
            type: DataTypes.INTEGER,
            // allowNull: false,
            unique: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        t_ddesde: {                 // hora de apertura en la mañana
            type: DataTypes.TIME,
            defaultValue: '08:00'
        },
        t_dhasta: {                 // hora de cierre en la mañana
            type: DataTypes.TIME,
            defaultValue: '11:30'
        },
        t_tdesde: {                 // hora de apertura en la tarde
            type: DataTypes.TIME,
            defaultValue: '13:00'
        },
        t_thasta: {                 // hora de cierre en la tarde
            type: DataTypes.TIME,
            defaultValue: '16:30'
        },
        t_ndesde: {                 // hora de apertura en la noche
            type: DataTypes.TIME,
            allowNull: true
        },
        t_nhasta: {                 // hora de cierre en la noche
            type: DataTypes.TIME,
            allowNull: true
        },
        tx_detalle: {               // el o los pisos donde se encuentre la(s) oficina(s)
            type: DataTypes.STRING
        },
        limite_solicitudes: {
            type: DataTypes.INTEGER,
            defaultValue: 40,
        }
    } )
}