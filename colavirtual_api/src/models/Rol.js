const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'rol', {
        rolId: {
            type: DataTypes.UUID,
            primaryKey: true,
            unique: true,
            defaultValue: DataTypes.UUIDV4
        },
        co_rol: { // validar vistas
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tx_nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tx_descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, { timestamps: false } )
};
