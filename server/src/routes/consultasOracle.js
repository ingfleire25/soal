const express = require('express');
const router = express.Router();
const consultasOracle = require('../controllers/consultasOracle');
const locations = require('../controllers/locations');
// const oracle = require('../controllers/oracle');
const osel = require('../controllers/oracle/osel');
const labor = require('../controllers/oracle/labor');
const valuelist = require('../controllers/oracle/valuelist');
const companies = require('../controllers/oracle/companies');
const chartofaccounts = require('../controllers/oracle/chartofaccounts');
const item = require('../controllers/oracle/item');


// public endpoints
router.get('/modserv', consultasOracle.getAll);
router.get('/locations', locations.getAll);

router.get('/companies', companies.getCompaniesSimple);
router.post('/valuelist/listname', valuelist.getValueListBySubtype); // Aquí pasas SUBTYPETP, SUBTYPESL, etc.
router.get('/labor/active', labor.getActiveLabor);
router.get('/labor/filtered', labor.getFilteredLabor);

router.get('/osel', osel.getOselData);
router.get('/chartofaccounts', chartofaccounts.getChartWithCompanies);
router.get('/item', item.getBasicItems)



module.exports = router;  