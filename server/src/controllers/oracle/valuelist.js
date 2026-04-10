const { ValueList } = require('../../db');

const getValueListBySubtype = async (req, res) => {
  const { listname } = req.body; 
  // Podrás llamar a /api/valuelist/SUBTYPETP, etc.
  try {
    const values = await ValueList.findAll({
      where: { listname: listname.toUpperCase() }
    });
    res.json(values);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getValueListBySubtype };