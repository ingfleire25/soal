const { DataTypes } = require( 'sequelize' );


module.exports = ( sequelize ) => {
    // defino el modelo
    sequelize.define( 'solicitud', {
        fh_apertura: { // creacion
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fh_asignacion: { // fecha en la que se le asignara un analista
            type: DataTypes.DATE,
            allowNull: true
        },
        fh_atencion: { // fecha en la que el solicitante pide ser atendido
            type: DataTypes.DATE,
            allowNull: false
        },
        fh_cierre: { // resolución (procesado o anulado)
            type: DataTypes.DATE,
            allowNull: true
        },
        tx_observacion: {
            type: DataTypes.STRING
        },
        enviadoA: { // correo(s) al que fuera enviada la confirmación de solicitud
            type: DataTypes.ARRAY( DataTypes.STRING )
        },
        n_ticket: {
            type: DataTypes.STRING,
            unique: true
        }
    }, { timestamps: false } )
};
