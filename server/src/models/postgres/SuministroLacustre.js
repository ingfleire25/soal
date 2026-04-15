const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('suministroLacustre', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    origen: { type: DataTypes.STRING, allowNull: false },
    descripcionOrigen: { type: DataTypes.TEXT, allowNull: true },
    destino: { type: DataTypes.STRING, allowNull: false },
    descripcionDestino: { type: DataTypes.TEXT, allowNull: true },
    fechaInicio: { type: DataTypes.DATE, allowNull: false },
    fechaFin: { type: DataTypes.DATE, allowNull: false },
    organizacionCcOi: { type: DataTypes.STRING, allowNull: false },
    multiplesCcOi: { type: DataTypes.JSON, allowNull: true },
    sumatoriaPorcentaje: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    tipoServicio: { type: DataTypes.STRING, allowNull: false },
    personaEnvia: { type: DataTypes.STRING, allowNull: false },
    descripcionPersonaEnvia: { type: DataTypes.STRING, allowNull: false },
    personaRecibe: { type: DataTypes.STRING, allowNull: false },
    descripcionPersonaRecibe: { type: DataTypes.STRING, allowNull: false },
    aprobador: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, allowNull: false },
    solicitante: { type: DataTypes.STRING, allowNull: false },
    cedulaSolicitante: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: true },
    tipoSolicitud: { type: DataTypes.STRING, defaultValue: 'Suministro Lacustre', allowNull: false },
    subtipo: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'), defaultValue: 'pendiente', allowNull: false },
    motivoRechazo: { type: DataTypes.TEXT, allowNull: true }
  }, { timestamps: true });
};