# SETUP GUIDE - PDF2Hack

## Quick Start (5 Menit)

### Prerequisites
- Node.js v14+ dan npm
- LibreOffice atau OpenOffice (untuk konversi)
- Browser modern

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
node server.js
```
Backend akan jalan di `http://localhost:7860`

### Step 2: Serve Frontend
```bash
# Option A: Python
cd frontend
python -m http.server 8000

# Option B: Node
npx http-server frontend -p 8000

# Option C: VS Code Live Server
# Right-click index.html > Open with Live Server
```
Frontend akan tersedia di `http://localhost:8000`

### Step 3: Update AdSense IDs
Edit `frontend/index.html` line~245,290,312,338 dan replace:
- `ca-pub-3704599190260136` → Ganti dengan Publisher ID Anda
- Slot IDs (7654321098, 8765432109, etc) → Ganti dengan Ad Slot IDs Anda

## Testing Checklist

### Frontend Tests
- [ ] Load index.html - lingkungan tidak error di console
- [ ] Theme toggle (Light/Dark) berjalan lancar
- [ ] Language toggle (EN/ID) semua text berganti
- [ ] All menu items expandable
- [ ] Hero section scrollable
- [ ] Modal dapat dibuka dan ditutup

### Backend Tests
```bash
# Check server status
curl http://localhost:7860/health

# Test file upload (Word to PDF)
curl -F "file=@test.docx" http://localhost:7860/api/convert/office-to-pdf -o output.pdf

# Test PDF processing (local)
# Upload file melalui browser dan check output
```

### Features to Test
1. **Image to PDF** ✓ (Client-side, always works)
2. **Merge PDF** ✓ (Client-side, always works)
3. **Split PDF** ✓ (Client-side, always works)
4. **Compress PDF** ✓ (Client-side, always works)
5. **Rotate PDF** ✓ (Client-side, always works)
6. **Watermark PDF** ✓ (Client-side, always works)
7. **Page Numbers** ✓ (Client-side, always works)
8. **Word/Excel to PDF** ✓ (Requires backend + LibreOffice)
9. **PDF to Word/Excel** ✓ (Requires backend + LibreOffice)
10. **OCR** ✓ (Uses Tesseract.js, browser-based)
11. **CV Builder** ✓ (Edit, Print, Download PDF/Word)
12. **AdSense Display** ✓ (After approval)


## Environment Variables

Create `.env` di folder backend:
```env
PORT=7860
NODE_ENV=production
CORS_ORIGIN=*
MAX_FILE_SIZE=100000000
```

## Docker Setup

```dockerfile
FROM node:16-alpine

WORKDIR /app

# Install LibreOffice
RUN apk add --no-cache libreoffice

COPY backend/package.json .
RUN npm install --production

COPY backend/ .

EXPOSE 7860

CMD ["node", "server.js"]
```

```bash
docker build -t pdf2hack-backend .
docker run -p 7860:7860 pdf2hack-backend
```

## Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (jika belum)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

Update `firebase.json`:
```json
{
  "hosting": {
    "public": "frontend",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "apiServer"
      }
    ]
  }
}
```

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** 
Backend sudah CORS-enabled. Pastikan fetch URL benar:
```javascript
// ✓ Correct
fetch('http://localhost:7860/api/convert/office-to-pdf', ...)

// ✗ Wrong
fetch('https://example.com/api/...', ...)
```

### Issue: LibreOffice "command not found"
**Windows:**
```bash
# Add to PATH or specify full path
"C:\Program Files\LibreOffice\program\soffice.exe"
```

**Linux:**
```bash
which libreoffice
# Add to server.js if not in PATH
const cmd = '/usr/bin/libreoffice --headless ...'
```

### Issue: Tesseract.js Loading Slow
Normal! First time load downloads ~100MB model files.
- Browser cache akan mengoptimalkan load berikutnya
- Consider self-hosting worker files untuk production

### Issue: File Upload Fails
Maksimal file size adalah 100MB (configurable di multer settings):
```js
// backend/server.js
limits: { fileSize: 100 * 1024 * 1024 } // 100MB
```

## Production Checklist

- [ ] Use HTTPS only
- [ ] Set proper CORS origins (not `*`)
- [ ] Enable rate limiting
- [ ] Setup logging & monitoring
- [ ] Configure proper error handling
- [ ] Test all features in production env
- [ ] Setup backup untuk uploaded files
- [ ] Monitor server resources (CPU, RAM, Disk)
- [ ] Setup auto-cleanup untuk temp files
- [ ] Test AdSense implementation

## Performance Optimization

```javascript
// Compress responses
npm install compression
app.use(compression());

// Rate limiting
npm install express-rate-limit
const rateLimit = require("express-rate-limit");
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

// Request logging
npm install morgan
app.use(morgan('combined'));
```

## Monitoring

Setup dengan PM2:
```bash
npm install -g pm2

# Start
pm2 start backend/server.js --name "pdf2hack-backend"

# Monitor
pm2 monit

# Logs
pm2 logs pdf2hack-backend
```

## Important Notes

1. **Temporary Files:** Automatically cleanup setiap selesai processing
2. **File Size:** Max 100MB (dapat diubah di server config)
3. **Processing Time:** Tergantung file size & server specs
4. **Browser Support:** All modern browsers (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
5. **HTTPS Recommended:** Untuk production environment

---

**Need Help?** Check GitHub Issues atau hubungi support!