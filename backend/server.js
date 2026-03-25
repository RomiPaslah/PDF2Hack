const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 7860; // Port khusus untuk Hugging Face

// 1. BUKA GERBANG KEAMANAN (Sangat Penting agar tidak Failed to Fetch)
app.use(cors());

// 2. SIAPKAN FOLDER PENAMPUNG SEMENTARA
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: 'uploads/' });

// =========================================================
// RUTE 1: KONVERSI OFFICE (WORD/EXCEL/PPT) KE PDF
// =========================================================
app.post('/convert/office-to-pdf', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('Tidak ada file yang diunggah.');

    const inputPath = req.file.path;
    
    // Perintah LibreOffice untuk mengubah ke PDF
    const cmd = `libreoffice --headless --invisible --nologo --convert-to pdf "${inputPath}" --outdir "${uploadDir}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error("Gagal Konversi ke PDF:", error);
            return res.status(500).send('Terjadi kesalahan saat konversi.');
        }

        // Cari file PDF hasil konversi
        const outputFileName = req.file.filename + '.pdf';
        const outputPath = path.join(uploadDir, outputFileName);

        // Kirim file ke HP pengguna, lalu hapus sampah filenya agar server tidak penuh
        res.download(outputPath, 'Hasil_Konversi_PDF2Hack.pdf', (err) => {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

// =========================================================
// RUTE 2: KONVERSI PDF KE WORD (DOCX)
// =========================================================
app.post('/convert/pdf-to-office', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('Tidak ada file yang diunggah.');

    const inputPath = req.file.path;
    
    // "Mantra Khusus" LibreOffice untuk mengubah PDF ke Word (DOCX)
    const cmd = `libreoffice --headless --invisible --nologo --infilter="writer_pdf_import" --convert-to docx:"MS Word 2007 XML" "${inputPath}" --outdir "${uploadDir}"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error("Gagal Konversi ke Word:", error);
            return res.status(500).send('Terjadi kesalahan saat konversi.');
        }

        // Cari file DOCX hasil konversi
        const outputFileName = req.file.filename + '.docx';
        const outputPath = path.join(uploadDir, outputFileName);

        // Kirim file ke HP pengguna, lalu hapus sampah filenya
        res.download(outputPath, 'Hasil_Konversi_PDF2Hack.docx', (err) => {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });
    });
});

// Jalankan Server
app.listen(port, () => {
    console.log(`Mesin PDF2Hack menyala di port ${port}`);
});