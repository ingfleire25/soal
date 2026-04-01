const { DataTypes } = require( 'sequelize' );

module.exports = ( sequelize ) => {
    // basic request for aquatic transport
    sequelize.define('solicitud', {
        nombre: { type: DataTypes.STRING, allowNull: false },
        correo: { type: DataTypes.STRING, allowNull: false },
        origen: { type: DataTypes.STRING, allowNull: false },
        destino: { type: DataTypes.STRING, allowNull: false },
        fechaViaje: { type: DataTypes.DATE, allowNull: false },
        comentario: { type: DataTypes.TEXT, allowNull: true }
    }, { timestamps: true });
};
