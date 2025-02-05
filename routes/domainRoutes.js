const express = require("express");
const router = express.Router();
const domainController = require("../controllers/domainController");

// Insert Data
router.post("/insert", domainController.insertDomain);

// Fetch Discrete Domains
router.get("/domains", domainController.getDistinctDomains);

// Fetch Sub-Domains Based on Domain
router.get("/sub-domains/:domain", domainController.getSubDomainsByDomain);

// Fetch Subjects Based on Sub-Domain
router.get("/subjects/:subDomain", domainController.getSubjectsBySubDomain);

module.exports = router;
