const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('serviciosPortuarios', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    origen: { type: DataTypes.STRING, allowNull: false },
    descripcionOrigen: { type: DataTypes.TEXT, allowNull: true },
    destino: { type: DataTypes.STRING, allowNull: false },
    descripcionDestino: { type: DataTypes.TEXT, allowNull: true },
    fechaInicio: { type: DataTypes.DATE, allowNull: false },
    organizacionCcOi: { type: DataTypes.STRING, allowNull: false },
    multiplesCcOi: { type: DataTypes.JSON, allowNull: true },
    sumatoriaPorcentaje: { type: DataTypes.DECIMAL(5,2), allowNull: true },
    tipoServicio: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Maniobras Especiales' },
    unidadMovilizar: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Tanquero Buque Petrolero' },
    aprobador: { type: DataTypes.STRING, allowNull: false },
    correo: { type: DataTypes.STRING, allowNull: false },
    solicitante: { type: DataTypes.STRING, allowNull: false },
    cedulaSolicitante: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    tipoSolicitud: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Servicios Portuarios' },
    subtipo: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'), defaultValue: 'pendiente', allowNull: false },
    motivoRechazo: { type: DataTypes.TEXT, allowNull: true }
  }, { timestamps: true });
};