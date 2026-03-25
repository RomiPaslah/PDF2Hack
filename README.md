# PDF2Hack - Platform Manipulasi PDF & ATS CV Builder 🚀

Platform web premium untuk konversi, manipulasi, dan keamanan PDF dengan fitur CV Builder yang ATS-friendly.

## ✨ Fitur Utama

### Konversi ke PDF
- ✅ Word/DOCX ke PDF
- ✅ Excel/XLSX ke PDF  
- ✅ PowerPoint/PPTX ke PDF
- ✅ Gambar/JPG/PNG ke PDF

### Ekstrak dari PDF
- ✅ PDF ke Word (DOCX)
- ✅ PDF ke Excel (XLSX)
- ✅ OCR - Ekstrak Teks dari PDF/Gambar Scan

### Manipulasi PDF
- ✅ Gabung (Merge) PDF - Kombinasi file PDF
- ✅ Pisah (Split) PDF - Ekstrak halaman tertentu
- ✅ Kompres PDF - Kurangi ukuran file
- ✅ Putar (Rotate) PDF - Ubah orientasi halaman
- ✅ Watermark PDF - Tambahkan tanda air teks
- ✅ Nomor Halaman - Penomoran otomatis

### Keamanan PDF
- ✅ Kunci PDF - Proteksi dengan password
- ✅ Buka Kunci PDF - Hapus password

### CV Builder 🔥
- ✅ Editor CV Langsung - Ketik langsung di template ATS-friendly
- ✅ Template Standar HRD - Struktur yang diakui sistem ATS
- ✅ Download PDF ATS - Terbaca 100% oleh sistem ATS perusahaan
- ✅ Download Word - Format DOCX yang dapat diedit

### Google AdSense Integration
- ✅ Native Ads (Top Section)
- ✅ In-Article Ads (Between Content)
- ✅ Interstitial Ads (Processing Screen)
- ✅ Sticky/Responsive Ads (Bottom Bar)

## 📋 Persyaratan

### Frontend
- Browser modern (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Minimal 50MB RAM tersedia

### Backend
- Node.js v14+
- npm v6+
- LibreOffice (untuk konversi Office to PDF)
- Linux/Windows/macOS

## 🚀 Instalasi & Setup

### 1. Clone/Download Project
```bash
cd "PDF2Hack"
```

### 2. Setup Backend

#### Install Dependencies
```bash
cd backend
npm install
```

#### Install LibreOffice (diperlukan untuk konversi Office)
**Windows:**
```bash
# Download dari https://www.libreoffice.org/download/
# Atau gunakan package manager
choco install libreoffice-fresh
```

**macOS:**
```bash
brew install libreoffice
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install libreoffice
```

#### Run Backend Server
```bash
# Development mode
npm start

# Atau dengan custom port
PORT=8000 npm start
```

Server akan berjalan di `http://localhost:7860` (atau port yang dipilih)

### 3. Setup Frontend

Frontend dapat dijalankan dengan:

**Opsi A: Static Server (Recommended untuk production)**
```bash
# Gunakan Firebase Hosting
firebase deploy

# Atau Python HTTP Server
cd frontend
python -m http.server 8000

# Atau Node.js http-server
npx http-server frontend -p 8000
```

**Opsi B: Development Server**
```bash
# Jika menggunakan VS Code
# Buka frontend/index.html dengan Live Server extension
```

## 🔧 Konfigurasi Google AdSense

### 1. Dapatkan Publisher ID
1. Login ke [Google AdSense](https://adsense.google.com)
2. Copy `publisher ID` Anda (format: `ca-pub-XXXXXXXXXX`)

### 3. Update Ad Slot IDs
Edit `frontend/index.html` dan replace:
- `ca-pub-3704599190260136` → Masukkan publisher ID Anda
- `7654321098` → Ad slot ID untuk native ads
- `8765432109` → Ad slot ID untuk in-article ads
- `5432109876` → Ad slot ID untuk sticky ads
- `4321098765` → Ad slot ID untuk interstitial ads

**Cara mendapat slot IDs:**
1. Di Google AdSense, buat unit iklan baru
2. Pilih tipe (Auto, Display, In-Article, dll)
3. Copy slot ID ketika disuruh generate kode iklan

### 4. Upload ads.txt
File `frontend/ads.txt` sudah ada dengan format benar. Pastikan:
```
google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

## 📱 Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

### Vercel
```bash
# Frontend
cd frontend
npm install -g vercel
vercel --prod
```

### Heroku (Backend)
```bash
# Login
heroku login

# Create app
heroku create pdf2hack-backend

# Deploy
git push heroku main
```

### Docker
```bash
# Build image
docker build -t pdf2hack-backend ./backend

# Run container
docker run -p 7860:7860 pdf2hack-backend
```

## 🛠️ Troubleshooting

### Error: "LibreOffice not found"
**Solusi:** Install LibreOffice sesuai OS Anda (lihat bagian Install LibreOffice)

### Error: "CORS error" atau "Failed to fetch"
**Solusi:** 
1. Pastikan backend server berjalan (check `http://localhost:7860/health`)
2. Jika backend di domain berbeda, pastikan CORS sudah dikonfigurasi di server.js
3. Untuk development, gunakan proxy (lihat konfigurasi di bawah)

### Error: "File too large"
**Solusi:** File maksimal 100MB. Jika lebih besar, kompresi dulu atau split file.

### Tesseract.js (OCR) Loading Lambat
**Solusi:** Normal untuk pertama kali, cache akan disimpan browser setelahnya.

## 📡 API Endpoints

### Health Check
```bash
GET http://localhost:7860/health
```
Response: `{ "status": "OK", "message": "PDF2Hack Backend is running" }`

### Office to PDF
```bash
POST http://localhost:7860/api/convert/office-to-pdf
Content-Type: multipart/form-data

Body:
- file: [binary file content]
```

### PDF to Office
```bash
POST http://localhost:7860/api/convert/pdf-to-office
Content-Type: multipart/form-data

Body:
- file: [binary PDF file]
- format: docx | xlsx
```

## 🌐 Proxy Setup untuk Development

Jika frontend dan backend di port berbeda, tambahkan proxy di file konfigurasi (jika menggunakan bundler):

**Webpack dev server:**
```js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:7860',
      changeOrigin: true
    }
  }
}
```

## 📊 Performance Tips

1. **Enable Compression** di backend:
```bash
npm install compression
```

2. **Use Service Worker** untuk caching file processing
3. **Minify Frontend** sebelum production
4. **Enable GZIP** di server

## 🔒 Security Considerations

1. ✅ Validasi file type dan size
2. ✅ Sanitasi file names
3. ✅ CORS dikonfigurasi dengan ketat
4. ✅ Auto cleanup files temporary
5. ✅ Error messages tidak expose sensitive info

**TODO untuk production:**
- [ ] Add rate limiting
- [ ] Implement auth/logging
- [ ] Add HTTPS
- [ ] Database untuk history
- [ ] Virus scanning untuk uploads

## 📝 Google AdSense Compliance

Aplikasi sudah memenuhi:
- ✅ Valid ads.txt file
- ✅ Multiple ad formats (native, in-article, interstitial)
- ✅ Proper ad labeling
- ✅ Non-intrusive ad placement
- ✅ SEO-friendly structure
- ✅ Mobile responsive design
- ✅ Fast loading time

**Tips untuk approval AdSense:**
1. Content must be original & high quality
2. Minimal 30 unique pages
3. Consistent publishing schedule
4. Natural, non-excessive ad placement
5. Privacy policy dan Terms of Service

## 📜 License

MIT License - Bebas untuk commercial & personal use

## 👨‍💻 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- 📧 Email: support@pdf2hack.com
- 💬 Discord: [Join Community]
- 🐛 Issue Tracker: GitHub Issues

## 🎯 Roadmap

- [ ] Image to PDF dengan multiple images
- [ ] PDF form filling
- [ ] Digital signature
- [ ] Batch processing
- [ ] Cloud storage integration (Google Drive, OneDrive)
- [ ] Mobile app (React Native)
- [ ] API untuk developer

---

**Created with ❤️ by PDF2Hack Team**

*Last Updated: March 25, 2026*