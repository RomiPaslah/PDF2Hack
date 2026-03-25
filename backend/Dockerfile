# Gunakan sistem operasi dasar yang sudah ada Node.js
FROM node:18

# Perintahkan server untuk menginstal LibreOffice
RUN apt-get update && apt-get install -y libreoffice

# Buat folder untuk aplikasi kita di dalam server
WORKDIR /app

# Salin catatan aplikasi dan instal
COPY package*.json ./
RUN npm install

# Salin semua kode backend Anda
COPY . .

# Buka port 3000
EXPOSE 7860

# Jalankan server
CMD [ "node", "server.js" ]