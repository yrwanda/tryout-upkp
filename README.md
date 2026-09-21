# Tryout UPKP

Aplikasi belajar, latihan, dan simulasi Ujian Penyesuaian Kenaikan Pangkat (UPKP) S1
Kementerian Imigrasi dan Pemasyarakatan, mengikuti SE Kepala BKN No. 10 Tahun 2024
(Lampiran III, UPKP D3-S3: 100 soal, 90 menit, TWK 30 / TKT 25 / TSI 30 / TKP 15).

## Cara pakai
- **Online:** https://yrwanda.github.io/tryout-upkp/ (bisa dipasang ke layar utama HP: tombol *Pasang* atau menu browser > Add to Home Screen; jalan offline).
- Buka `index.html` langsung di browser (tanpa server), atau jalankan `python -m http.server 8765` lalu buka http://localhost:8765.
- Progres tersimpan di localStorage browser. Gunakan Pengaturan > Ekspor/Impor untuk memindahkan progres.

## Dua sumber bank soal (bisa dibandingkan)
Pilih sumber di menu atas atau Pengaturan:
- **Kurasi (riset)** - 488 soal (`twk_*`, `tkt_*`, `tsi_*`, `tkp_*`, `x2_*`, `bonus_imigrasi`) yang disusun dari peraturan primer (JDIH).
- **Kisi-kisi BKN** - 296 soal dari deck resmi PPSS BKN "PPT UDIN & UPKP - IMIPAS" (kisi-kisi hal. 18 dst.):
  246 soal turunan deck (`bkn_twk`, `bkn_tkt`, `bkn_tsi_tkp`, `bkn_ekstra`; `set: "bkn"`, rujukan ke halaman deck)
  dan 50 soal asli Google Form "Latihan Soal UD/UPKP 2025" (`bkn_form`; `set: "form"`, 4 opsi, urutan asli, kunci + pembahasan disusun aplikasi karena form tidak memuat kunci).
  Topik tambahan dari deck yang tidak ada di komposisi SE: Perkantoran dan Manajemen & Kepemimpinan.
- **Semua sumber** - gabungan.
Mode Simulasi "Latihan Resmi BKN 2025" mengerjakan 50 soal asli secara utuh (45 menit).
Bila deck BKN berbeda dari sumber primer (mis. jumlah pasal UUD pascaamandemen, "UU 9/1999"), pembahasan mencatat keduanya.

## Struktur
- `js/bank/*.js` bank soal per topik (id, soal, 4-5 opsi, kunci, pembahasan, rujukan; `set` menandai sumber).
- `js/materi.js` ringkasan materi per topik + metadata komposisi soal.
- `js/app.js` logika aplikasi; `css/style.css` tampilan.
- `js/bank/bonus_imigrasi.js` dan soal bertanda `imi: true` hanya tampil jika opsi
  "Sertakan soal substansi keimigrasian" diaktifkan (di luar komposisi resmi BKN).

## Menambah soal
Soal tambahan ada di `js/bank/x2_*.js` dan `js/bank/bkn_*.js` (memakai `push`). Setelah menambah, jalankan `node tools/rebalance.js .` (menyeimbangkan posisi kunci A-E untuk berkas x2_* dan bkn_*, kecuali `bkn_form.js` yang dipertahankan asli; argumen ketiga opsional: JSON `{id:{o,a}}` untuk menimpa opsi). `bkn_form.js` dibangkitkan oleh `python tools/build_form_set.py` dari `tools/gform_bkn_2025.json`. Setelah itu dan naikkan `VERSION` di `sw.js` serta `?v=` di `index.html` agar cache pengguna diperbarui.
Tambahkan objek baru ke array di file bank yang sesuai. Aturan mutu: 5 opsi setara
panjang, satu jawaban benar, pembahasan menjelaskan kenapa benar dan kenapa pengecoh salah,
sertakan rujukan pasal/dokumen. Jalankan `node tools/validate.js .` untuk memeriksa.

## Sumber utama
SE BKN 10/2024; Permenimipas 1/2024, 2/2024, 11/2025; UU 20/2023; PP 94/2021;
Peraturan BKN 4/2023; UU 25/2009; UU 30/2014; UU 28/1999; UU 6/2011 jo. UU 63/2024;
UUD NRI 1945; UU 12/2011; EYD V (2022).
