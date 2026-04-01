const {Locations} = require ('../db.js')

 

exports.getAll = async (req, res) => {
  try {
    const modservs = await Locations.findAll({ 
      attributes: ['LOCATION', 'DESCRIPTION'], // Solo traemos 3 columnas
    });
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'OK', 
      result: modservs 
    });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al obtener servicios', 
      error: err.message 
    });
  }
};