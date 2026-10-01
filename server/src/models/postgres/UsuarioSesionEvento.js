const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('usuarioSesionEvento', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: true, field: 'usuario_id' },
    sesionId: { type: DataTypes.BIGINT, allowNull: true, field: 'sesion_id' },
    tipo: { type: DataTypes.STRING(40), allowNull: false },
    metodo: { type: DataTypes.STRING(10), allowNull: true },
    ruta: { type: DataTypes.TEXT, allowNull: true },
    ipAddress: { type: DataTypes.STRING(64), allowNull: true, field: 'ip_address' },
    userAgent: { type: DataTypes.TEXT, allowNull: true, field: 'user_agent' },
    ocurridoEn: { type: DataTypes.DATE, allowNull: false, field: 'ocurrido_en' }
  }, {
    tableName: 'usuario_sesion_evento',
    timestamps: false,
    freezeTableName: true
  });
};