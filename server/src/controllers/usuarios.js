const { Usuario } = require('../db');

exports.search = async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const where = search
      ? {
          [require('sequelize').Op.or]: [
            { username: { [require('sequelize').Op.iLike]: `%${search}%` } },
            { nombres: { [require('sequelize').Op.iLike]: `%${search}%` } },
            { apellidos: { [require('sequelize').Op.iLike]: `%${search}%` } },
            { cedula: { [require('sequelize').Op.iLike]: `%${search}%` } },
            { gerencia: { [require('sequelize').Op.iLike]: `%${search}%` } },
            { departamento: { [require('sequelize').Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const users = await Usuario.findAll({ where, order: [['createdAt', 'DESC']] });
    res.status(200).json({ statusCode: 200, statusText: 'OK', result: users });
  } catch (error) {
    console.error('Error buscar usuarios', error);
    res.status(500).json({ statusCode: 500, statusText: 'Error interno', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ statusCode: 404, statusText: 'Usuario no encontrado' });

    res.status(200).json({ statusCode: 200, statusText: 'OK', result: user });
  } catch (error) {
    console.error('Error get usuario', error);
    res.status(500).json({ statusCode: 500, statusText: 'Error interno', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { username, password, nombres, apellidos, cedula, telefono, gerencia, departamento, rol } = req.body;

    if (!username || !password || !nombres || !apellidos || !cedula || !rol) {
      return res.status(400).json({ statusCode: 400, statusText: 'Faltan datos obligatorios' });
    }

    const existing = await Usuario.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ statusCode: 409, statusText: 'Usuario ya existe' });
    }

    const newUser = await Usuario.create({ username, password, nombres, apellidos, cedula, telefono, gerencia, departamento, rol });
    res.status(201).json({ statusCode: 201, statusText: 'Usuario creado', result: newUser });
  } catch (error) {
    console.error('Error crear usuario', error);
    res.status(500).json({ statusCode: 500, statusText: 'Error interno', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, nombres, apellidos, cedula, telefono, gerencia, departamento, rol, activo } = req.body;

    const user = await Usuario.findByPk(id);
    if (!user) return res.status(404).json({ statusCode: 404, statusText: 'Usuario no encontrado' });

    if (username && username !== user.username) {
      const clash = await Usuario.findOne({ where: { username } });
      if (clash) return res.status(409).json({ statusCode: 409, statusText: 'Username en uso' });
    }

    await user.update({ username, password, nombres, apellidos, cedula, telefono, gerencia, departamento, rol, activo });
    res.status(200).json({ statusCode: 200, statusText: 'Usuario actualizado', result: user });
  } catch (error) {
    console.error('Error actualizar usuario', error);
    res.status(500).json({ statusCode: 500, statusText: 'Error interno', error: error.message });
  }
};