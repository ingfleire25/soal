const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');


const envPath = path.resolve(__dirname, '../../.env'); 
dotenv.config({ path: envPath });

const { DB_USER_SIGA, DB_PASSWORD_SIGA, DB_HOST_SIGA, DB_NAME_SIGA, DB_PORT_SIGA } = process.env;


const pool = new Pool({
  user: DB_USER_SIGA,
  host: DB_HOST_SIGA,
  database: DB_NAME_SIGA,
  password: DB_PASSWORD_SIGA,
  port: DB_PORT_SIGA, 
});



async function obtenerUsuarios(cedula) {
 
    try {
    const client = await pool.connect(); // Obtiene un cliente del pool
    const result = await client.query('SELECT * FROM rrhh.i001t_persona rh WHERE rh.nu_cedula = $1;', [cedula]); // Parametrizamos la consulta
    client.release(); // Libera el cliente de vuelta al pool

    
    if (result.rows.length === 0) {
      throw new Error('No se encontró la cedula');
    }

    const persona = result.rows[0];
    const co_persona = persona.co_persona;

    // Obtener co_solicitante de la tabla i007t_solicitante
    const solicitanteResult = await client.query('SELECT co_solicitante FROM servicio.i007t_solicitante WHERE co_persona = $1;', [co_persona]);
    const co_solicitante = solicitanteResult.rows[0]?.co_solicitante || null; // Manejar el caso donde no se encuentra co_solicitante
    console.log(persona, co_solicitante);
    return { persona, co_solicitante };
  } catch (error) {
    console.error('Error en obtenerUsuario: ', error);
    
  }
}

async function insertarRegistro(esquema, tabla, datos) {
  try {
    const client = await pool.connect(); // Obtiene un cliente del pool
    const datosParaInsertar = { ...datos };
    delete datosParaInsertar.id;

    const columnas = Object.keys(datosParaInsertar);
    const valores = Object.values(datosParaInsertar);

    const consulta = `INSERT INTO ${esquema}.${tabla} (${columnas.join(', ')}) VALUES (${valores.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;

    const resultado = await client.query(consulta, valores);
    client.release(); // Libera el cliente de vuelta al pool

    console.log('Registro insertado:', resultado.rows[0]);
    return resultado.rows[0];
  } catch (error) {
    console.error('Error al insertar registro:', error);
    throw error;
  }
}

async function insertarCaso(co_solicitante) {
  
  try {
    const nuevoRegistro = await insertarRegistro('servicio','c001t_caso', {
      fe_creacion: new Date(),
      fe_ultima_actualizacion: new Date(),
      in_prioridad: 'B', // A o B. A->alta B->Baja priorida del requerimiento. influye en el tiempo de respuesta
      co_clasificacion_caso: 2, //Requerimiento
      tx_resumen_caso: 'Resumen del caso de ejemplo COAL', //Descripsion breve del caso
      tx_detalle_caso: 'Detalle del caso de ejemplo...',  //Descripsion breve del caso
      co_alcance_grupo: 1,
      co_caso_origen: null, //codigoque representa la relacion de depndencia de otro caso.
      co_tipo_trabajo: 8, //Tipo de trbajo realizado. El 8 es soporte basico
      co_fuente: 12, //fuente que origino el caso. el 12 es presencial
      co_tipo_caso: 1, //Tipo caso. el 1 es ordinario
      co_solicitante: co_solicitante,  // vERIFICAR EL SOLICITANTE CORRECTO ESTE  CAMPO DEBE SER DINAMICO
      co_organizacion: 3, // Codigo organizacion. 3 es pdvsa occidente
      co_detalle_estado: 1, //todo deberia ser 1 ya que es NUEVO.
      co_ubicacion_general: 4305, // NO SE COMO SACAR LA UBICACION GENERAL
      co_emisor: 6030, // CODIGO DEL ANALISTA QUE GENERA EL CASO. AQUI SIEMPRE DEBERIOA SER null
      nu_tiempo_total_caso: 0.00,
      nu_tiempo_total_grupo: 0.00,
      nu_ti_efectivo_caso: 0.00,
      nu_ti_efectivo_grupo: 0.00,
      nu_ti_efectivo_analista: 0.00,
      fe_fin_plan: null,
      tx_caso_proveedor: 'Proveedor Ejemplo',
      in_garantia: 'S',
      in_control_remoto: 'N',
      fe_inicio_plan: new Date(),
      nu_cant_activo_solicitada: 1,
      nu_cant_activo_otorgada: 1,
      co_control_cambio: null,
      tx_direccion: 'Dirección de ejemplo',
      co_ec: null,
      co_tipificacion: 3172,
      tx_ubicacion_caso: '3|OCCIDENTE|4147|Maracaibo|4290|Centro Petrolero|4302|Torre Lama|4305|2',
      tx_solucion_caso: 'Solución del caso...',
      tx_prueba_caso: 'Prueba del caso...',
      in_reabierto: '0',
      nu_tiempo_total_analista: 0.00,
      tx_telefono_secundario_usuario: '0412-0000000',
      co_ultimo_registro_trabajo: null,
      co_reg_trabajo_no_seg_cerrado: null,
    });
    
    return nuevoRegistro;
  } catch (error) {
    console.error('Error en insertarCaso: ', error);
  }

}

async function registroTrabajo(co_caso) {
  
  
  try {
    const nuevoRegistroTrabajo = await insertarRegistro('servicio','c004t_registro_trabajo', {
      
      //co_registro_trabajo: 987654321, // Ejemplo de un número entero de 9 dígitos (puede ser null)
      in_seguimiento: null,
      tx_registro_trabajo: 'prueba CASO SIGA',
      co_caso: co_caso, // aqui va la variable dinamica para pasarle co_caso a registro trabajo
      co_grupo_solucionador: 40,
      nu_horas: 0.0119,
      fe_registro_trabajo: new Date(),
      co_analista: null, // analista que tiene el caso asignado
      co_persona: 127239, //persona que actualiza el caso, averiguar si puede ir null
      co_detalle_estado_actual: 1,
      co_detalle_estado_ant: null
    });
    
        return nuevoRegistroTrabajo
    
  } catch (error) {
    console.error('Error en registroTrabajo: ', error);
   
  }

}


async function crearCaso(req, res) {
  const { cedula } = req.params;
  try {
    const usuario = await obtenerUsuarios(cedula);
    const nuevoCaso = await insertarCaso(usuario.co_solicitante);
    const registro = await registroTrabajo(nuevoCaso.co_caso); // Asumiendo que 'co_caso' está en la respuesta de insertarCaso

    res.status(201).json({
      statusCode: 201,
      statusText: 'Caso y registro de trabajo creados con éxito',
      caso: nuevoCaso,
      registroTrabajo: registro,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, statusText: 'Error al crear caso y registro de trabajo', error: error.message });
  }
}
 
 
module.exports = {
  crearCaso
}

//VARIABLES QUE DEBEN PASARSE A OTRA FUNCION
// CO_SOLICITANTE-> despues de obtener la consulta con la cedula del usuario hay que 
// obtener el co_solicitante y pasarlo a insertarCaso()

//CO_CASO -> necesita relacionarse con registro_trabajo de manera dinamica no estatica

//co_persona debe pasarse a registro de trabjo

// hay que registra en la base de datos una persoan que sea cola virtual para el co_persona que actualiza el caso