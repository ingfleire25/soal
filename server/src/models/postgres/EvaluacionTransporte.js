const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('evaluacionTransporte', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    codigoSolicitud: { type: DataTypes.STRING, allowNull: false },
    tipoSolicitud: { type: DataTypes.STRING, allowNull: true },
    subtipo: { type: DataTypes.STRING, allowNull: true },
    evaluadorNombre: { type: DataTypes.STRING, allowNull: false },
    evaluadorCedula: { type: DataTypes.STRING, allowNull: true },
    evaluadorCorreo: { type: DataTypes.STRING, allowNull: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    puntualidad: { type: DataTypes.INTEGER, allowNull: false },
    calidad: { type: DataTypes.INTEGER, allowNull: false },
    comunicacion: { type: DataTypes.INTEGER, allowNull: false },
    seguridad: { type: DataTypes.INTEGER, allowNull: false },
    satisfaccion: { type: DataTypes.INTEGER, allowNull: false },
    comentarios: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: false, defaultValue: 'registrada' }
  }, { timestamps: true });
};