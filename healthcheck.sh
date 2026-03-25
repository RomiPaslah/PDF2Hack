#!/bin/bash
# PDF2Hack - Health Check & Test Script
# Run this to verify all systems are working

echo "================================"
echo "PDF2Hack Health Check v1.0"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Node.js
echo -n "[1/8] Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
fi

# Test 2: npm
echo -n "[2/8] Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
fi

# Test 3: LibreOffice
echo -n "[3/8] Checking LibreOffice... "
if command -v libreoffice &> /dev/null || command -v soffice &> /dev/null; then
    LO_VERSION=$(libreoffice --version 2>/dev/null || soffice --version 2>/dev/null)
    echo -e "${GREEN}✓${NC} $LO_VERSION"
else
    echo -e "${YELLOW}⚠${NC}  Optional - needed for Office to PDF conversion"
fi

# Test 4: Backend Dependencies
echo -n "[4/8] Checking backend dependencies... "
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC}  Run: cd backend && npm install"
fi

# Test 5: Backend Health
echo -n "[5/8] Checking backend server... "
if curl -s http://localhost:7860/health &> /dev/null; then
    echo -e "${GREEN}✓${NC} Running"
else
    echo -e "${YELLOW}⚠${NC}  Not running - start with: cd backend && npm start"
fi

# Test 6: Frontend files
echo -n "[6/8] Checking frontend files... "
if [ -f "frontend/index.html" ] && [ -f "frontend/ads.txt" ]; then
    echo -e "${GREEN}✓${NC} Found"
else
    echo -e "${RED}✗${NC} Missing frontend files"
fi

# Test 7: ads.txt configuration
echo -n "[7/8] Checking ads.txt... "
if grep -q "google.com, pub-" frontend/ads.txt 2>/dev/null; then
    ADS_CONTENT=$(cat frontend/ads.txt)
    if grep -q "ca-pub-3704599190260136" frontend/ads.txt; then
        echo -e "${YELLOW}⚠${NC}  Using placeholder publisher ID"
    else
        echo -e "${GREEN}✓${NC} Valid Google publisher ID"
    fi
else
    echo -e "${RED}✗${NC} ads.txt not configured"
fi

# Test 8: AdSense IDs in HTML
echo -n "[8/8] Checking AdSense in HTML... "
if grep -q "ca-pub-" frontend/index.html 2>/dev/null; then
    if grep -q "ca-pub-3704599190260136" frontend/index.html; then
        echo -e "${YELLOW}⚠${NC}  Using placeholder AdSense ID"
        echo ""
        echo -e "${YELLOW}IMPORTANT: Replace placeholder ad IDs before production!${NC}"
    else
        echo -e "${GREEN}✓${NC} Custom AdSense ID found"
    fi
else
    echo -e "${RED}✗${NC} AdSense code not found"
fi

echo ""
echo "================================"
echo "Summary"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && npm start"
echo "2. Serve frontend: python -m http.server 8000"
echo "3. Open browser: http://localhost:8000"
echo "4. Test the features"
echo ""
echo "Before production:"
echo "- Replace placeholder ad IDs in frontend/index.html"
echo "- Update ads.txt with your publisher ID"
echo "- Deploy on HTTPS"
echo "- Test all features"
echo ""
echo -e "${GREEN}Health check complete!${NC}"
echo ""