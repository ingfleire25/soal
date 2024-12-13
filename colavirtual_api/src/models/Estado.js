const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'estado', { // DE LAS SOLICITUDES
        tx_nombre: {                 // Ej: Abierto (amarillo), Procesado (verde), Anulado (rojo)
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g
            }
        },
        tx_color: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    } )
};
