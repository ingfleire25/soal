const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Companies', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    company: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
      field: 'COMPANY'
    },
    type: {
      type: DataTypes.STRING(12),
      field: 'TYPE'
    },
    name: {
      type: DataTypes.STRING(50),
      field: 'NAME'
    },
    address1: { type: DataTypes.STRING(36), field: 'ADDRESS1' },
    address2: { type: DataTypes.STRING(36), field: 'ADDRESS2' },
    address3: { type: DataTypes.STRING(36), field: 'ADDRESS3' },
    address4: { type: DataTypes.STRING(36), field: 'ADDRESS4' },
    contact: {
      type: DataTypes.STRING(50),
      field: 'CONTACT'
    },
    phone: {
      type: DataTypes.STRING(20),
      field: 'PHONE'
    },
    fob: {
      type: DataTypes.STRING(20),
      field: 'FOB'
    },
    freightterms: {
      type: DataTypes.STRING(50),
      field: 'FREIGHTTERMS'
    },
    shipvia: {
      type: DataTypes.STRING(20),
      field: 'SHIPVIA'
    },
    paymentterms: {
      type: DataTypes.STRING(20),
      field: 'PAYMENTTERMS'
    },
    customernum: {
      type: DataTypes.STRING(16),
      field: 'CUSTOMERNUM'
    },
    // Campos de extensión CO1 - CO10
    co1: { type: DataTypes.STRING(10), field: 'CO1' },
    co2: { type: DataTypes.STRING(10), field: 'CO2' },
    co3: { type: DataTypes.STRING(10), field: 'CO3' },
    co4: { type: DataTypes.STRING(10), field: 'CO4' },
    co5: { type: DataTypes.STRING(10), field: 'CO5' },
    co6: { type: DataTypes.STRING(10), field: 'CO6' },
    co7: { type: DataTypes.DECIMAL(10, 2), field: 'CO7' },
    co8: { type: DataTypes.DATE, field: 'CO8' },
    co9: { type: DataTypes.NUMBER, field: 'CO9' },
    co10: { type: DataTypes.STRING(1), field: 'CO10' },

    ldkey: {
      type: DataTypes.NUMBER,
      field: 'LDKEY'
    },
    fax: {
      type: DataTypes.STRING(20),
      field: 'FAX'
    },
    co11: { type: DataTypes.STRING(10), field: 'CO11' },
    co12: { type: DataTypes.DATE, field: 'CO12' },
    co13: { type: DataTypes.DECIMAL(15, 2), field: 'CO13' },
    
    changeby: {
      type: DataTypes.STRING(18),
      field: 'CHANGEBY'
    },
    changedate: {
      type: DataTypes.DATE,
      field: 'CHANGEDATE'
    },
    inclusive1: {
      type: DataTypes.STRING(1),
      defaultValue: 'N',
      allowNull: false,
      field: 'INCLUSIVE1'
    },
    inclusive2: {
      type: DataTypes.STRING(1),
      defaultValue: 'N',
      allowNull: false,
      field: 'INCLUSIVE2'
    },
    inclusive3: {
      type: DataTypes.STRING(1),
      defaultValue: 'N',
      allowNull: false,
      field: 'INCLUSIVE3'
    },
    tax1code: { type: DataTypes.STRING(8), field: 'TAX1CODE' },
    tax2code: { type: DataTypes.STRING(8), field: 'TAX2CODE' },
    tax3code: { type: DataTypes.STRING(8), field: 'TAX3CODE' },
    currencycode: {
      type: DataTypes.STRING(8),
      field: 'CURRENCYCODE'
    },
    location: {
      type: DataTypes.STRING(15),
      field: 'LOCATION'
    },
    registration1: { type: DataTypes.STRING(20), field: 'REGISTRATION1' },
    registration2: { type: DataTypes.STRING(20), field: 'REGISTRATION2' },
    registration3: { type: DataTypes.STRING(20), field: 'REGISTRATION3' },
    apcontrolacc: { type: DataTypes.STRING(24), field: 'APCONTROLACC' },
    apsuspenseacc: { type: DataTypes.STRING(24), field: 'APSUSPENSEACC' },
    rbniacc: { type: DataTypes.STRING(24), field: 'RBNIACC' },
    payvendor: { type: DataTypes.STRING(12), field: 'PAYVENDOR' },
    bankaccount: { type: DataTypes.STRING(20), field: 'BANKACCOUNT' },
    inclusive4: {
      type: DataTypes.STRING(1),
      defaultValue: 'N',
      allowNull: false,
      field: 'INCLUSIVE4'
    },
    inclusive5: {
      type: DataTypes.STRING(1),
      defaultValue: 'N',
      allowNull: false,
      field: 'INCLUSIVE5'
    },
    registration4: { type: DataTypes.STRING(20), field: 'REGISTRATION4' },
    registration5: { type: DataTypes.STRING(20), field: 'REGISTRATION5' },
    tax4code: { type: DataTypes.STRING(8), field: 'TAX4CODE' },
    tax5code: { type: DataTypes.STRING(8), field: 'TAX5CODE' },
    disabled: { type: DataTypes.STRING(1), field: 'DISABLED' },
    remitaddress1: { type: DataTypes.STRING(36), field: 'REMITADDRESS1' },
    remitaddress2: { type: DataTypes.STRING(36), field: 'REMITADDRESS2' },
    remitaddress3: { type: DataTypes.STRING(36), field: 'REMITADDRESS3' },
    remitaddress4: { type: DataTypes.STRING(36), field: 'REMITADDRESS4' },
    remitcontact: { type: DataTypes.STRING(50), field: 'REMITCONTACT' },
    payonreceipt: { type: DataTypes.STRING(1), field: 'PAYONRECEIPT' },
    homepage: { type: DataTypes.STRING(124), field: 'HOMEPAGE' },
    banknum: { type: DataTypes.STRING(16), field: 'BANKNUM' },
    dunsnum: { type: DataTypes.STRING(16), field: 'DUNSNUM' },
    taxexemptcode: { type: DataTypes.STRING(1), field: 'TAXEXEMPTCODE' },
    taxexemptnum: { type: DataTypes.STRING(20), field: 'TAXEXEMPTNUM' },
    ecommerceenabled: { type: DataTypes.STRING(1), field: 'ECOMMERCEENABLED' },
    mnetcompanyid: { type: DataTypes.STRING(50), field: 'MNETCOMPANYID' },
    // Más campos de extensión
    co14: { type: DataTypes.STRING(10), field: 'CO14' },
    co15: { type: DataTypes.STRING(10), field: 'CO15' },
    co16: { type: DataTypes.STRING(10), field: 'CO16' },
    co17: { type: DataTypes.STRING(10), field: 'CO17' },
    co18: { type: DataTypes.STRING(10), field: 'CO18' },
    
    sourcesysid: { type: DataTypes.STRING(10), field: 'SOURCESYSID' },
    ownersysid: { type: DataTypes.STRING(10), field: 'OWNERSYSID' },
    externalrefid: { type: DataTypes.STRING(10), field: 'EXTERNALREFID' },
    apiseq: { type: DataTypes.STRING(50), field: 'APISEQ' },
    interid: { type: DataTypes.STRING(50), field: 'INTERID' },
    migchangeid: { type: DataTypes.STRING(50), field: 'MIGCHANGEID' },
    sendersysid: { type: DataTypes.STRING(50), field: 'SENDERSYSID' },
    autoreceiveonasn: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'AUTORECEIVEONASN'
    },
    vendorsendsasn: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'VENDORSENDSASN'
    },
    vendorsendsinv: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'VENDORSENDSINV'
    },
    ecominterface: { type: DataTypes.STRING(30), field: 'ECOMINTERFACE' },
    mnetecomnum1: { type: DataTypes.STRING(30), field: 'MNETECOMNUM1' },
    mnetecomnum2: { type: DataTypes.STRING(1), field: 'MNETECOMNUM2' },
    mnetecomnum3: { type: DataTypes.STRING(1), field: 'MNETECOMNUM3' },
    mnetecomnum4: { type: DataTypes.STRING(1), field: 'MNETECOMNUM4' },
    vendorsendsstatus: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'VENDORSENDSSTATUS'
    },
    autoapproveinv: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'AUTOAPPROVEINV'
    },
    autosendpocancel: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'AUTOSENDPOCANCEL'
    },
    defaultwarehouse: {
      type: DataTypes.STRING(12),
      field: 'DEFAULTWAREHOUSE'
    }
  }, {
    tableName: 'COMPANIES',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};