const { WoStatus } = require('../../db');

const updateWoStatus = async (req, res) => {
  const { wonum } = req.params; 
  const { status, changeby, memo } = req.body; 

  try {
    // 1. Buscamos el registro actual (para tener los valores del WHERE original)
    const currentStatus = await WoStatus.findOne({
      where: { wonum: wonum.toUpperCase() },
      order: [['changedate', 'DESC']]
    });

    if (!currentStatus) {
      return res.status(404).json({ message: `No se encontró historial para la orden ${wonum}` });
    }

    // Guardamos los valores actuales antes de que se pierdan o cambien
    const originalStatus = currentStatus.status;
    const originalChangeDate = currentStatus.changedate;

    // 2. Forzamos la actualización directa usando el Modelo
    await WoStatus.update(
      {
        status: status ? status.toUpperCase() : originalStatus,
        changeby: changeby || currentStatus.changeby,
        memo: memo || currentStatus.memo,
        changedate: new Date() // Actualizamos la fecha a hoy (obligatorio en Maximo al cambiar estado)
      },
      {
        where: {
          wonum: wonum.toUpperCase(),
          status: originalStatus, // El estatus viejo ('CERRADO')
          changedate: originalChangeDate // La fecha vieja
        }
      }
    );

    // 3. Buscamos el registro recién actualizado para responderle a tu frontend Vue
    const updatedRecord = await WoStatus.findOne({
      where: { wonum: wonum.toUpperCase() },
      order: [['changedate', 'DESC']]
    });

    res.json({ message: 'Estado actualizado con éxito', data: updatedRecord });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { updateWoStatus };