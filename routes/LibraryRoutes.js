const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/LibraryController');

// 1. Create library entry
router.post('/create', libraryController.createLibrary);

// 2. Get distinct sections
router.get('/sections', libraryController.getDistinctSections);

// 3. Get libraries by section
router.get('/section/:section', libraryController.getLibrariesBySection);

// 4. Update library entry
router.put('/update/:id', libraryController.updateLibrary);

// 5. Delete library entry
router.delete('/delete/:id', libraryController.deleteLibrary);

module.exports = router;
