const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('materiales', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    renglon: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    fechaEntregaMuelle: { type: DataTypes.DATE, allowNull: false },
    observacion: { type: DataTypes.TEXT, allowNull: true },
    suministroLacustreId: {
      type: DataTypes.UUID,
      allowNull: true
    }
  }, { timestamps: true });
};