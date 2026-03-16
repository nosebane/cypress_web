# Cypress Automation Test — demoqa.com

Proyek ini berisi automation test untuk website [demoqa.com](https://demoqa.com) menggunakan **Cypress 13** dengan pola **Page Object Model (POM)** dan data-driven testing.

---

## Prasyarat

| Tool | Versi Minimum |
|------|--------------|
| Node.js | v18+ |
| npm | v9+ |
| Google Chrome | terbaru |

---

## Instalasi

```bash
# Clone repository
git clone <url-repository>
cd cypresstest

# Install semua dependency
npm install

# Salin file environment dan sesuaikan jika perlu
cp .env.example .env
```

---

## Cara Menjalankan Test

### 1. Mode Interaktif (Cypress GUI)

Membuka Cypress Test Runner agar dapat memilih dan menjalankan test satu per satu secara visual.

```bash
npm run cy:open
```

---

### 2. Mode Headless (Command Line)

Menjalankan semua test secara otomatis di background tanpa membuka browser.

```bash
npm run cy:run
```

---

### 3. Menjalankan Per Fitur

| Perintah | Fitur yang Dijalankan |
|----------|-----------------------|
| `npm run cy:run:positive` | Web Tables — skenario positif |
| `npm run cy:run:negative` | Web Tables — skenario negatif |
| `npm run cy:run:all` | Semua test Web Tables |

---

### 4. Menjalankan Spec Tertentu Secara Manual

```bash
# Web Tables — semua
npx cypress run --browser chrome --spec "cypress/e2e/webTables/*.cy.js"

# Droppable
npx cypress run --browser chrome --spec "cypress/e2e/droppable/droppable.cy.js"

# Resizable
npx cypress run --browser chrome --spec "cypress/e2e/resizable/resizable.cy.js"

# Semua sekaligus
npx cypress run --browser chrome --spec "cypress/e2e/**/*.cy.js"
```

---

## Struktur Proyek

```
cypresstest/
├── cypress/
│   ├── e2e/
│   │   ├── webTables/
│   │   │   ├── positive.cy.js      # Test positif Web Tables
│   │   │   └── negative.cy.js      # Test negatif Web Tables
│   │   ├── droppable/
│   │   │   └── droppable.cy.js     # Test Drag & Drop
│   │   └── resizable/
│   │       └── resizable.cy.js     # Test Resize Element
│   ├── fixtures/
│   │   └── users.csv               # Data pengguna untuk data-driven test
│   ├── pages/
│   │   ├── WebTablesPage.js        # POM — halaman Web Tables
│   │   ├── DroppablePage.js        # POM — halaman Droppable
│   │   └── ResizablePage.js        # POM — halaman Resizable
│   └── support/
│       ├── commands.js             # Custom Cypress commands
│       └── e2e.js                  # Global setup & plugin registration
└── cypress.config.js               # Konfigurasi Cypress
```

---

## Daftar Test Case

### Web Tables (`cypress/e2e/webTables/`)
| ID | Skenario |
|----|----------|
| TC-WT-01 | Tambah pengguna baru — data valid |
| TC-WT-02 | Tambah pengguna dari file CSV (data-driven) |
| TC-WT-03 | Cari pengguna menggunakan search box |
| TC-WT-04 | Hapus pengguna dari tabel |
| TC-WT-05 | Submit form kosong — validasi wajib diisi |
| TC-WT-06 | Submit email tidak valid — validasi format |

### Droppable (`cypress/e2e/droppable/`)
| ID | Skenario |
|----|----------|
| TC-DROP-01 | Simple drag & drop — teks berubah menjadi "Dropped!" |
| TC-DROP-02 | Accept tab — draggable yang diterima berhasil di-drop |
| TC-DROP-03 | Accept tab — draggable yang ditolak tidak mengubah teks |

### Resizable (`cypress/e2e/resizable/`)
| ID | Skenario |
|----|----------|
| TC-RES-01 | Resize free box ke ukuran 400×200 |
| TC-RES-02 | Resize free box ke ukuran minimum 150×150 |
| TC-RES-03 | Resize restricted box dalam batas maksimum 500×300 |

---

## Hasil Test

- **Video** hasil run tersimpan di `cypress/videos/`
- **Screenshot** saat test gagal tersimpan di `cypress/screenshots/`
