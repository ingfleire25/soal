const { Chartofaccounts } = require('../../db');
const { QueryTypes } = require('sequelize');

const getChartOfAccounts = async (req, res) => {
  try {
    const result = await Chartofaccounts.findAll({
      order: [['glaccount', 'ASC']]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChartOfAccountsWithCompanies = async (req, res) => {
  try {
    const query = `
      SELECT CH.*, CO.*
      FROM MAXIMO.CHARTOFACCOUNTS CH
      JOIN MAXIMO.COMPANIES CO ON CH.CH3 = CO.COMPANY
      WHERE CH.CH1 IS NOT NULL
        AND CH.CH2 > SYSDATE
      ORDER BY CH.CH3
    `;

    const result = await Chartofaccounts.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getChartOfAccounts, getChartOfAccountsWithCompanies };
