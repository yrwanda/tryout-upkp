# Tryout UPKP

Aplikasi belajar, latihan, dan simulasi Ujian Penyesuaian Kenaikan Pangkat (UPKP) S1
Kementerian Imigrasi dan Pemasyarakatan, mengikuti SE Kepala BKN No. 10 Tahun 2024
(Lampiran III, UPKP D3-S3: 100 soal, 90 menit, TWK 30 / TKT 25 / TSI 30 / TKP 15).

## Cara pakai
- **Online:** https://yrwanda.github.io/tryout-upkp/ (bisa dipasang ke layar utama HP: tombol *Pasang* atau menu browser > Add to Home Screen; jalan offline).
- Buka `index.html` langsung di browser (tanpa server), atau jalankan `python -m http.server 8765` lalu buka http://localhost:8765.
- Progres tersimpan di localStorage browser. Gunakan Pengaturan > Ekspor/Impor untuk memindahkan progres.

## Bank soal: hanya kisi-kisi BKN 2025
Aplikasi hanya memuat soal yang bersumber dari PPT kisi-kisi resmi PPSS BKN "PPT UDIN & UPKP - IMIPAS" (kisi-kisi hal. 18-172):
- **427 soal dari materi kisi-kisi BKN** (`js/bank/bkn_*.js`, `set: "bkn"`, rujukan "Kisi-kisi BKN hal. X").
- **50 soal asli** Google Form "Latihan Soal UD/UPKP 2025" (`bkn_form.js`, `set: "form"`, 4 opsi, urutan asli; kunci dan pembahasan disusun aplikasi karena form tidak memuat kunci).
- Materi bacaan (`js/materi.js`) diringkas dari kisi-kisi BKN per halaman. Bila kisi-kisi BKN berbeda dari sumber primer (jumlah pasal UUD pascaamandemen, "UU 9/1999", "penurunan pangkat", manajemen ilmiah = Fayol), materi dan pembahasan mencatat keduanya.
- SOTK dan Renstra instansi di kisi-kisi BKN hanya berupa judul subtopik; soalnya dilengkapi dari Permenimipas 1/2024, 2/2024, 11/2025.
- Bank kurasi riset (488 soal) dipindah ke `arsip/kurasi/` dan tidak dimuat aplikasi.

Mode simulasi: **UPKP D3-S2** (100 soal, 90 menit, komposisi kisi-kisi BKN hal. 6 / SE BKN 10/2024) dan **Latihan Resmi BKN 2025** (50 soal, 45 menit). Simulasi yang sedang berjalan tersimpan otomatis bila halaman tertutup.

## Struktur
- `js/bank/*.js` bank soal (id, soal, 4-5 opsi, kunci, pembahasan, rujukan halaman kisi-kisi BKN).
- `js/materi.js` materi per topik + metadata komposisi (`TOPICS`, `TESTS`).
- `js/app.js` logika aplikasi; `css/style.css` tampilan (token warna terang/gelap).

## Menambah soal
Tambahkan soal ke berkas `js/bank/bkn_*.js` (pola `window.BANK.<topik>.push({...})`, `set: "bkn"`, rujukan "Kisi-kisi BKN hal. X"; berkas baru juga didaftarkan di `index.html` dan `sw.js`). Lalu:
1. `node tools/rebalance.js .` menyeimbangkan posisi kunci A-E (kecuali `bkn_form.js` dan pilihan berurutan seperti Pertama-Kelima / angka / Romawi). Argumen ketiga opsional: JSON `{id:{o,a}}` untuk menimpa opsi.
2. `node tools/validate.js .` memeriksa struktur, opsi ganda, kuota per topik, dan jawaban benar yang jauh lebih panjang dari pengecoh.
3. Naikkan `VERSION` di `sw.js` dan `?v=` di `index.html`.

`bkn_form.js` dibangkitkan oleh `python tools/build_form_set.py` dari `tools/gform_bkn_2025.json`.

## Sumber
PPT kisi-kisi PPSS BKN "PPT UDIN & UPKP - IMIPAS" (2025); Google Form latihan resmi BKN 2025 (s.id/LatihanUdinUPKP-Kemenimipas); SE BKN 10/2024. Pelengkap untuk catatan perbedaan dan subtopik yang di kisi-kisi BKN hanya berupa judul: Permenimipas 1/2024, 2/2024, 11/2025; PP 94/2021; PP 18/2016; UU 23/2014; UU 25/2009; UU 9/1998.
