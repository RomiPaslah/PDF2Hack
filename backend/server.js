// Lokasi File: HelloPDF_Project/backend/server.js

const express = require('express');
const multer = require('multer');
const libre = require('libreoffice-convert');
const cors = require('cors');

// Promisify agar kode lebih bersih (async/await)
libre.convertAsync = require('util').promisify(libre.convert);

const app = express();
const port = 7860;

app.use(cors());

// Limit file maksimal 50MB di memori
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
});

// SATU ENDPOINT UNTUK SEMUA (Word, Excel, PPT)
app.post('/convert/office', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('File tidak ditemukan.');

        console.log(`Mengonversi: ${req.file.originalname}`);
        
        // Proses konversi ajaib LibreOffice
        const pdfBuf = await libre.convertAsync(req.file.buffer, '.pdf', undefined);
        
        // Kirim balik ke pengguna
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${req.file.originalname.split('.')[0]}.pdf"`
        });
        
        res.send(pdfBuf);
        console.log('Selesai!');

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Gagal melakukan konversi. Pastikan LibreOffice terinstal.');
    }
});

app.listen(port, () => {
    console.log(`Backend API siap di http://localhost:${port}`);
});