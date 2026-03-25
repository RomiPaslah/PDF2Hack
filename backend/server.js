const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 7860;

// =========================================================
// SECURITY & MIDDLEWARE
// =========================================================
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'https://localhost', '*'],
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// =========================================================
// FOLDER SETUP
// =========================================================
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer with size limit
const upload = multer({ 
    dest: uploadDir,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// =========================================================
// HELPER FUNCTIONS
// =========================================================
function sanitizeFileName(fileName) {
    return path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_');
}

function cleanupFiles(filePaths) {
    filePaths.forEach(filePath => {
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error(`Failed to delete ${filePath}:`, err);
            }
        }
    });
}

function findConvertedFile(uploadDir, baseFileName, extension) {
    try {
        const files = fs.readdirSync(uploadDir);
        const fileWithExt = baseFileName + extension;
        const found = files.find(f => f.includes(baseFileName) && f.endsWith(extension));
        return found ? path.join(uploadDir, found) : path.join(uploadDir, fileWithExt);
    } catch (err) {
        console.error('Error finding converted file:', err);
        return path.join(uploadDir, baseFileName + extension);
    }
}

// =========================================================
// HEALTH CHECK
// =========================================================
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'PDF2Hack Backend is running' });
});

app.get('/', (req, res) => {
    res.status(200).json({ 
        service: 'PDF2Hack Backend API',
        version: '1.0.0',
        endpoints: [
            'POST /api/convert/office-to-pdf',
            'POST /api/convert/pdf-to-office',
            'GET /health'
        ]
    });
});

// =========================================================
// RUTE 1: KONVERSI OFFICE (WORD/EXCEL/PPT) KE PDF
// =========================================================
app.post(['/api/convert/office-to-pdf', '/convert/office-to-pdf'], upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const baseFileName = path.basename(req.file.filename);
    
    // Validate file type
    const allowedExt = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExt.includes(fileExt)) {
        cleanupFiles([inputPath]);
        return res.status(400).json({ error: 'Unsupported file type. Allowed: ' + allowedExt.join(', ') });
    }

    const cmd = `libreoffice --headless --invisible --nologo --convert-to pdf "${inputPath}" --outdir "${uploadDir}"`;

    exec(cmd, (error, stdout, stderr) => {
        const outputPath = findConvertedFile(uploadDir, baseFileName, '.pdf');

        if (error) {
            console.error("LibreOffice conversion error:", error.message);
            cleanupFiles([inputPath, outputPath]);
            return res.status(500).json({ 
                error: 'Conversion failed',
                details: error.message.substring(0, 200)
            });
        }

        if (!fs.existsSync(outputPath)) {
            cleanupFiles([inputPath]);
            return res.status(500).json({ error: 'Output file not created' });
        }

        // Send file and cleanup
        res.download(outputPath, sanitizeFileName(req.file.originalname) + '.pdf', (err) => {
            if (err) console.error('Download error:', err);
            cleanupFiles([inputPath, outputPath]);
        });
    });
});

// =========================================================
// RUTE 2: KONVERSI PDF KE OFFICE (WORD/EXCEL)
// =========================================================
app.post(['/api/convert/pdf-to-office', '/convert/pdf-to-office'], upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type
    if (!req.file.mimetype.includes('pdf')) {
        cleanupFiles([req.file.path]);
        return res.status(400).json({ error: 'File must be PDF' });
    }

    const inputPath = req.file.path;
    const baseFileName = path.basename(req.file.filename);
    const format = (req.body.format || 'docx').toLowerCase().replace('.', '');
    const outputExt = format === 'xlsx' ? 'xlsx' : 'docx';

    const cmd = `libreoffice --headless --invisible --nologo --infilter="writer_pdf_import" --convert-to ${outputExt}:"MS Word 2007 XML" "${inputPath}" --outdir "${uploadDir}"`;

    exec(cmd, (error, stdout, stderr) => {
        const outputPath = findConvertedFile(uploadDir, baseFileName, '.' + outputExt);

        if (error) {
            console.error("PDF conversion error:", error.message);
            cleanupFiles([inputPath, outputPath]);
            return res.status(500).json({ 
                error: 'PDF conversion failed',
                details: error.message.substring(0, 200)
            });
        }

        if (!fs.existsSync(outputPath)) {
            cleanupFiles([inputPath]);
            return res.status(500).json({ error: 'Output file not created' });
        }

        const fileName = sanitizeFileName(req.file.originalname);
        const downloadName = fileName.replace(/\.pdf$/i, '') + '.' + outputExt;

        res.download(outputPath, downloadName, (err) => {
            if (err) console.error('Download error:', err);
            cleanupFiles([inputPath, outputPath]);
        });
    });
});

// =========================================================
// ERROR HANDLING
// =========================================================
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(413).json({ error: 'File too large (max 100MB)' });
        }
        return res.status(400).json({ error: 'File upload error: ' + err.message });
    }

    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// =========================================================
// START SERVER
// =========================================================
app.listen(port, () => {
    console.log(`🚀 PDF2Hack Backend Server is running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`API Endpoints:`);
    console.log(`  - POST http://localhost:${port}/api/convert/office-to-pdf`);
    console.log(`  - POST http://localhost:${port}/api/convert/pdf-to-office`);
});