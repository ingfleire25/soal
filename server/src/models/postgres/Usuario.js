const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('usuario', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    nombres: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    cedula: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING, allowNull: true },
    correo: { type: DataTypes.STRING, allowNull: true },
    gerencia: { type: DataTypes.STRING, allowNull: true },
    departamento: { type: DataTypes.STRING, allowNull: true },
    rol: { type: DataTypes.ENUM('Solicitante', 'Aprobador', 'Administrador'), allowNull: false },
    nivelAprobacion: { type: DataTypes.ENUM('1', '2', '3'), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    timestamps: true,
    freezeTableName: true
  });
}; 