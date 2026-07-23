const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return  sequelize.define('Servacct', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    wonum: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: 'WONUM'
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'DESCRIPTION'
    },
    
    // Grupo 1
    glaccount1: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT1'
    },
    company1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY1'
    },
    rate1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE1'
    },

    // Grupo 2
    glaccount2: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT2'
    },
    company2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY2'
    },
    rate2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE2'
    },

    // Grupo 3
    glaccount3: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT3'
    },
    company3: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY3'
    },
    rate3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE3'
    },

    // Grupo 4
    glaccount4: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT4'
    },
    company4: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY4'
    },
    rate4: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE4'
    },

    // Grupo 5
    glaccount5: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT5'
    },
    company5: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY5'
    },
    rate5: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE5'
    },

    // Grupo 6
    glaccount6: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT6'
    },
    company6: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY6'
    },
    rate6: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE6'
    },

    // Grupo 7
    glaccount7: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT7'
    },
    company7: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY7'
    },
    rate7: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE7'
    },

    // Grupo 8
    glaccount8: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT8'
    },
    company8: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY8'
    },
    rate8: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE8'
    },

    // Grupo 9
    glaccount9: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT9'
    },
    company9: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY9'
    },
    rate9: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE9'
    },

    // Grupo 10
    glaccount10: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT10'
    },
    company10: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'COMPANY10'
    },
    rate10: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'RATE10'
    },

    // Campos SERV
    serv1: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'SERV1'
    },
    serv2: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'SERV2'
    },
    serv3: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'SERV3'
    },
    serv4: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'SERV4'
    },
    serv5: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'SERV5'
    },
    serv6: {
      type: DataTypes.STRING(1),
      allowNull: true,
      field: 'SERV6'
    },
    ldkey: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'LDKEY'
    }
  }, {
    tableName: 'SERVACCT',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};