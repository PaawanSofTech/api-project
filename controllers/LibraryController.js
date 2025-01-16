const Library = require('../models/Library'); // Adjust the path to your schema
const multer = require('multer');
const { Buffer } = require('buffer');

// Configure multer for in-memory storage for PDF files
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true); // Accept PDF files
        } else {
            cb(new Error('Only PDF files are allowed'), false); // Reject non-PDF files
        }
    }
});

// 1. Enter library data (create a new entry)
exports.createLibrary = async (req, res) => {
    try {
        // Handle the PDF upload in the request
        upload.single('pdf')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'File upload error', error: err.message });
            }

            const { section, name } = req.body;
            const pdfFile = req.file;

            if (!section || !name || !pdfFile) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Convert PDF to Base64
            const pdfBase64 = pdfFile ? Buffer.from(pdfFile.buffer).toString('base64') : null;

            const newLibrary = new Library({
                section,
                name,
                pdf: pdfBase64
            });

            await newLibrary.save();
            res.status(201).json({ message: 'Library entry created', data: newLibrary });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating library entry', error });
    }
};

// 2. Fetch all distinct sections
exports.getDistinctSections = async (req, res) => {
    try {
        const sections = await Library.distinct('section');
        res.status(200).json({ data: sections });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching distinct sections', error });
    }
};

// 3. Fetch all data related to a specific section
exports.getLibrariesBySection = async (req, res) => {
    try {
        const { section } = req.params;

        if (!section) {
            return res.status(400).json({ message: 'Section is required' });
        }

        // Perform a case-insensitive search using the $regex operator
        const libraries = await Library.find({
            section: { $regex: new RegExp('^' + section + '$', 'i') }
        });

        if (libraries.length === 0) {
            return res.status(404).json({ message: 'No entries found for this section' });
        }

        res.status(200).json({ data: libraries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching library entries by section', error });
    }
};


// 4. Update library data
exports.updateLibrary = async (req, res) => {
    try {
        // Handle the PDF upload in the request
        upload.single('pdf')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'File upload error', error: err.message });
            }

            const { id } = req.params;
            const { section, name } = req.body;
            const pdfFile = req.file;

            // Prepare PDF base64 if file is provided
            let pdfBase64 = null;
            if (pdfFile) {
                pdfBase64 = Buffer.from(pdfFile.buffer).toString('base64');
            }

            // Update the library
            const updatedLibrary = await Library.findByIdAndUpdate(
                id,
                { section, name, pdf: pdfBase64 },
                { new: true, runValidators: true }
            );

            if (!updatedLibrary) {
                return res.status(404).json({ message: 'Library entry not found' });
            }

            res.status(200).json({ message: 'Library entry updated', data: updatedLibrary });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating library entry', error });
    }
};

// 5. Delete library data
exports.deleteLibrary = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLibrary = await Library.findByIdAndDelete(id);

        if (!deletedLibrary) {
            return res.status(404).json({ message: 'Library entry not found' });
        }

        res.status(200).json({ message: 'Library entry deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting library entry', error });
    }
};
