# Tryout UPKP

Aplikasi belajar, latihan, dan simulasi Ujian Penyesuaian Kenaikan Pangkat (UPKP) S1
Kementerian Imigrasi dan Pemasyarakatan, mengikuti SE Kepala BKN No. 10 Tahun 2024
(Lampiran III, UPKP D3-S3: 100 soal, 90 menit, TWK 30 / TKT 25 / TSI 30 / TKP 15).

## Cara pakai
- **Online:** https://yrwanda.github.io/tryout-upkp/ (bisa dipasang ke layar utama HP: tombol *Pasang* atau menu browser > Add to Home Screen; jalan offline).
- Buka `index.html` langsung di browser (tanpa server), atau jalankan `python -m http.server 8765` lalu buka http://localhost:8765.
- Progres tersimpan di localStorage browser. Gunakan Pengaturan > Ekspor/Impor untuk memindahkan progres.

## Struktur
- `js/bank/*.js` bank soal per topik (id, soal, 5 opsi, kunci, pembahasan, rujukan).
- `js/materi.js` ringkasan materi per topik + metadata komposisi soal.
- `js/app.js` logika aplikasi; `css/style.css` tampilan.
- `js/bank/bonus_imigrasi.js` dan soal bertanda `imi: true` hanya tampil jika opsi
  "Sertakan soal substansi keimigrasian" diaktifkan (di luar komposisi resmi BKN).

## Menambah soal
Soal tambahan batch 2 ada di `js/bank/x2_*.js` (memakai `push`). Setelah menambah, jalankan `node tools/rebalance.js .` (menyeimbangkan posisi kunci A-E untuk berkas x2_*) dan naikkan `VERSION` di `sw.js` serta `?v=` di `index.html` agar cache pengguna diperbarui.
Tambahkan objek baru ke array di file bank yang sesuai. Aturan mutu: 5 opsi setara
panjang, satu jawaban benar, pembahasan menjelaskan kenapa benar dan kenapa pengecoh salah,
sertakan rujukan pasal/dokumen. Jalankan `node tools/validate.js .` untuk memeriksa.

## Sumber utama
SE BKN 10/2024; Permenimipas 1/2024, 2/2024, 11/2025; UU 20/2023; PP 94/2021;
Peraturan BKN 4/2023; UU 25/2009; UU 30/2014; UU 28/1999; UU 6/2011 jo. UU 63/2024;
UUD NRI 1945; UU 12/2011; EYD V (2022).
