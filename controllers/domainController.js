const Domain = require("../models/Domain");

// 1️⃣ Insert Data
exports.insertDomain = async (req, res) => {
  try {
    const { domain, subDomain, subjects } = req.body;

    // Check if the entry already exists
    const existingEntry = await Domain.findOne({ domain, subDomain });
    if (existingEntry) {
      return res.status(400).json({ message: "Entry already exists!" });
    }

    const newDomain = new Domain({
      domain,
      subDomain,
      subjects
    });

    await newDomain.save();
    res.status(201).json({ message: "Domain inserted successfully!", data: newDomain });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 2️⃣ Fetch Discrete Domains
exports.getDistinctDomains = async (req, res) => {
  try {
    const domains = await Domain.distinct("domain");
    res.status(200).json(domains);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 3️⃣ Fetch Discrete Sub-Domains Based on Domain
exports.getSubDomainsByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    const subDomains = await Domain.find({ domain }).distinct("subDomain");
    res.status(200).json(subDomains);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 4️⃣ Fetch Subjects Based on Sub-Domain
exports.getSubjectsBySubDomain = async (req, res) => {
  try {
    const { subDomain } = req.params;

    const domainData = await Domain.findOne({ subDomain });
    if (!domainData) {
      return res.status(404).json({ message: "Sub-domain not found!" });
    }

    res.status(200).json(domainData.subjects);

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
