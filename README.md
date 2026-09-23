# Tryout UPKP

Aplikasi belajar, latihan, dan simulasi Ujian Penyesuaian Kenaikan Pangkat (UPKP) S1
Kementerian Imigrasi dan Pemasyarakatan, mengikuti SE Kepala BKN No. 10 Tahun 2024
(Lampiran III, UPKP D3-S3: 100 soal, 90 menit, TWK 30 / TKT 25 / TSI 30 / TKP 15).

## Cara pakai
- **Online:** https://yrwanda.github.io/tryout-upkp/ (bisa dipasang ke layar utama HP: tombol *Pasang* atau menu browser > Add to Home Screen; jalan offline).
- Buka `index.html` langsung di browser (tanpa server), atau jalankan `python -m http.server 8765` lalu buka http://localhost:8765.
- Progres tersimpan di localStorage browser. Gunakan Pengaturan > Ekspor/Impor untuk memindahkan progres.

## Bank soal: kisi-kisi BKN 2025 (+ pelengkap yang ditandai)
Total 565 soal, dibedakan lewat field `set`:
- `set: "bkn"` (473): dari isi PPT kisi-kisi PPSS BKN "PPT UDIN & UPKP - IMIPAS" (hal. 18-172), termasuk halaman bergambar; rujukan "Kisi-kisi BKN hal. X".
- `set: "form"` (50): soal asli Google Form "Latihan Soal UD/UPKP 2025", 4 opsi, urutan asli. BKN tidak menerbitkan kunci; kunci disusun aplikasi dan diberi label "kunci disusun AI".
- `set: "ext"` (42+): **pelengkap**, isinya dari luar PPT kisi-kisi dan ditandai "Pelengkap": SOTK dari Permenimipas 1/2024 dan 2/2024 (kisi-kisi hal. 151 hanya berisi judul subtopik), sistematika Renstra, dan tata bahasa Inggris di luar tenses. Bisa disembunyikan di Pengaturan (akibatnya SOTK tidak cukup untuk simulasi 100 soal).
- Bank kurasi riset lama (488 soal) ada di `arsip/kurasi/` dan tidak dimuat.

Fitur belajar: **Sesi Hari Ini** (soal salah diulang besok, benar sekali diulang 3 hari kemudian, dikuasai = benar di 2 hari berbeda; sisanya soal baru dari jenis tes terlemah), kesiapan per jenis tes, tombol **Ragukan kunci** (daftarnya bisa disalin dari Riwayat untuk dicek), pengingat ekspor data mingguan, simulasi UPKP 100 soal/90 menit dan Resmi 50 soal/45 menit dengan ambang **perkiraan**.

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
