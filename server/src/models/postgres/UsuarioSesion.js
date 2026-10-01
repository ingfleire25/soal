const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('usuarioSesion', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false, field: 'usuario_id' },
    tokenHash: { type: DataTypes.STRING(64), allowNull: false, unique: true, field: 'token_hash' },
    ipAddress: { type: DataTypes.STRING(64), allowNull: true, field: 'ip_address' },
    userAgent: { type: DataTypes.TEXT, allowNull: true, field: 'user_agent' },
    startedAt: { type: DataTypes.DATE, allowNull: false, field: 'started_at' },
    lastActivityAt: { type: DataTypes.DATE, allowNull: false, field: 'last_activity_at' },
    expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' },
    endedAt: { type: DataTypes.DATE, allowNull: true, field: 'ended_at' },
    endReason: { type: DataTypes.STRING(40), allowNull: true, field: 'end_reason' }
  }, {
    tableName: 'usuario_sesion',
    timestamps: false,
    freezeTableName: true
  });
};