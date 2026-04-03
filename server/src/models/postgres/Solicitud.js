const { DataTypes } = require( 'sequelize' );

module.exports = ( sequelize ) => {
    sequelize.define('solicitud', {
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
        fechaFin: { type: DataTypes.DATE, allowNull: true },
        organizacionCcOi: { type: DataTypes.STRING, allowNull: false },
        multiplesCcOi: { type: DataTypes.JSON, allowNull: true }, // Array of {ccOi, porcentaje}
        sumatoriaPorcentaje: { type: DataTypes.DECIMAL(5,2), allowNull: true }, // Calculated
        lunes: { type: DataTypes.BOOLEAN, defaultValue: false },
        martes: { type: DataTypes.BOOLEAN, defaultValue: false },
        miercoles: { type: DataTypes.BOOLEAN, defaultValue: false },
        jueves: { type: DataTypes.BOOLEAN, defaultValue: false },
        viernes: { type: DataTypes.BOOLEAN, defaultValue: false },
        sabado: { type: DataTypes.BOOLEAN, defaultValue: false },
        domingo: { type: DataTypes.BOOLEAN, defaultValue: false },
        cantidadPasajeros: { type: DataTypes.INTEGER, allowNull: true },
        tipoServicio: { type: DataTypes.STRING, allowNull: false }, // Subtipo
        aprobador: { type: DataTypes.STRING, allowNull: false },
        correo: { type: DataTypes.STRING, allowNull: false },
        solicitante: { type: DataTypes.STRING, allowNull: false },
        cedulaSolicitante: { type: DataTypes.STRING, allowNull: false },
        tipoSolicitud: { type: DataTypes.STRING, allowNull: false }, // e.g., 'Transporte de Personal'
        subtipo: { type: DataTypes.STRING, allowNull: true }, // e.g., 'Ocasional', 'Recurrente'
        estado: { type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'), defaultValue: 'pendiente', allowNull: false },
        motivoRechazo: { type: DataTypes.TEXT, allowNull: true },
        unidadMovilizar: { type: DataTypes.STRING, allowNull: true },
        descripcionUnidad: { type: DataTypes.TEXT, allowNull: true },
        fecha: { type: DataTypes.DATE, allowNull: true }
    }, { timestamps: true });
};
