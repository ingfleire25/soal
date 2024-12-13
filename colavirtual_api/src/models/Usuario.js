const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'usuario', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g
            }
        },
        tx_apellido: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g
            }
        },
        tx_cedula: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        tx_indicador: {
            type: DataTypes.STRING,
            allowNull: true, // por si es jubilado o sobreviviente
            unique: true,
            validate: {
                is: /^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g
            }
        },
        tx_correo: { // si es activo, pdvsa; si es jubilado o sobreviviente, blank
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        tx_correo_alt: { // lo trae del directorio activo o de lo que el usuario introduzca en la solicitud
            type: DataTypes.STRING,
            allowNull: true
        },
        tx_estado: {
            type: DataTypes.ENUM( 'ACTIVO', 'JUBILADO', 'SOBREVIVIENTE' ),
            allowNull: false
        },
        auth: { // token para controlar sesiones y acceso (refresh token)
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, { timestamps: false } )
};
