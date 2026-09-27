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

Simulasi bergaya CAT BKN (mengikuti pemberitaan Kompas 2019 dan Liputan6 2022 tentang layar CAT): halaman konfirmasi data peserta lalu Mulai Ujian; menu aplikasi disembunyikan dan layar selalu terang; kotak nomor soal hijau (sudah dijawab) / merah (belum); pilih jawaban lalu **Simpan dan Lanjutkan** (pilihan yang belum disimpan tidak dihitung) atau **Lewatkan**; Selesai Ujian dan tampilan 1/2 di kanan atas, sisa waktu di kanan bawah. Tidak ada tombol ragu-ragu karena CAT tidak memilikinya. Keyboard: huruf memilih, Enter menyimpan, panah kanan melewatkan. Di komputer (mouse, layar minimal 900 px) tombol Mulai Ujian sekaligus membuka layar penuh; tombol **Layar penuh** di kepala layar ujian untuk masuk lagi setelah Esc atau setelah halaman dimuat ulang. Layar penuh ditutup otomatis saat keluar dari layar ujian.

## Struktur
- `js/bank/*.js` bank soal (id, soal, 4-5 opsi, kunci, pembahasan, rujukan halaman kisi-kisi BKN).
- `js/materi.js` materi per topik + metadata komposisi (`TOPICS`, `TESTS`).
- Menu **Selingan** (`#selingan`, dari Beranda/Latihan dan tombol jeda saat latihan): 7 mini game dari PPT kisi-kisi. Catatan benar/keliru per kartu di `state.jodoh` dipakai bersama, kartu yang terakhir keliru didahulukan.
  - **Kursi Panas** (`#kursi`, di app.js): kuis 15 tingkat bergaya acara kuis TV dari bank soal (bukan data baru); topik diundi berbobot komposisi soal ujian (tidak sama berturut-turut), soal yang tampil di 3 ronde terakhir tidak diulang (`state.kpSeen`, `state.kpRound`), lalu sebisa mungkin level 1-5 soal yang pernah benar, 6-10 soal baru, 11-15 soal yang pernah salah; titik aman level 5 dan 10; bantuan 50:50, Telepon Rekan, Tanya Peserta Diklat (disimulasikan, bisa keliru); jawaban tercatat ke statistik; rekor di `state.kpBest`, suara di `settings.kpSound` (default mati). Nama, emblem, dan suara buatan sendiri, bukan aset acara TV.
  - `js/jodoh.js` **Jodohkan** (46 set, 345 pasangan, 6 per ronde); sisi kanan dalam satu set harus unik. Juga sumber **Benar atau Salah** (60 detik, pernyataan salah = pasangan ditukar dalam set yang sama).
  - `js/kelompok.js` **Kelompokkan** (20 set, 246 kartu, 8 per ronde); satu kartu hanya di satu kelompok.
  - `js/urut.js` **Urutkan** (15 set, 103 kartu, maks. 6 per ronde); items sudah urut, teks kartu tidak boleh membocorkan urutan.
  - `js/tebak.js` **Tebak dari Petunjuk** (8 set, 70 teka-teki, 5 per ronde, 6 pilihan); petunjuk urut dari tersulit, tidak boleh menyebut jawaban, minimal 6 jawaban per set.
  - `js/detektif.js` **Detektif Kisi-kisi** (10 set, 68 paragraf, 5 per ronde); tepat satu bagian `[salah, benar]` per paragraf, bagian lain harus benar menurut PPT.
  - Tampilan: tiap game memakai panggung bertema (`arenaWrap()` di app.js, kelas `.arena-<id>` di style.css) yang menimpa token warna secara lokal; komponen berbahan kertas memakai token terang. Tema: Jodohkan meja beludru, Benar atau Salah arena neon, Kelompokkan meja arsip kayu, Urutkan linimasa, Tebak ruang berkas, Detektif meja penyidik.
  - Set `ext: true` = pelengkap (disembunyikan bila soal pelengkap dimatikan).
- `js/app.js` logika aplikasi; `css/style.css` tampilan (token warna terang/gelap).

## Keamanan dan ketahanan data
- Semua data (localStorage dan file impor) melewati `sanitize()`: hanya kolom dikenal dengan tipe benar, kunci `__proto__`/`constructor`/`prototype` dibuang, riwayat rusak dilewati. Data rusak tidak boleh membuat aplikasi macet.
- Impor: maks. 5 MB, harus berisi `stats` dan `history`, konfirmasi sebelum mengganti progres.
- Gagal menyimpan (penyimpanan penuh/diblokir) memunculkan spanduk tetap; aplikasi terbuka di dua tab memunculkan peringatan.
- Content Security Policy lewat meta tag (skrip hanya dari origin sendiri; pendaftaran service worker ada di `js/boot.js`). Teks dari pengguna/berkas selalu dirender sebagai teks, bukan HTML.
- Service worker hanya menyimpan respons sukses dari folder aplikasi ini; cadangan `index.html` saat offline hanya untuk navigasi.
- Penyimpanan permanen (`navigator.storage.persist()`) diminta saat progres pertama disimpan, agar browser tidak menghapus data saat ruang disk menipis. Bila diizinkan, pengingat ekspor di Beranda muncul 30 hari sekali (bukan 7).
- Versi baru tidak memuat ulang halaman di tengah simulasi, latihan, atau ronde mini game; muat ulang ditunda sampai pindah ke halaman lain (`window.upkpBusy` di `app.js`, `controllerchange` di `boot.js`).
- Batasan yang tersisa: origin `yrwanda.github.io` dipakai bersama semua repo GitHub Pages milik akun ini (localStorage ikut terbagi); GitHub Pages tidak bisa mengirim header keamanan seperti `frame-ancestors`.

## Menambah soal
Tambahkan soal ke berkas `js/bank/bkn_*.js` (pola `window.BANK.<topik>.push({...})`, `set: "bkn"`, rujukan "Kisi-kisi BKN hal. X" di `src` saja, jangan diulang di pembahasan `e` karena halamannya sudah tampil di label soal dan baris Rujukan; teks soal `q` juga tidak memakai frasa "menurut kisi-kisi BKN"; berkas baru juga didaftarkan di `index.html` dan `sw.js`). Lalu:
1. `node tools/rebalance.js .` menyeimbangkan posisi kunci A-E (kecuali `bkn_form.js` dan pilihan berurutan seperti Pertama-Kelima / angka / Romawi). Argumen ketiga opsional: JSON `{id:{o,a}}` untuk menimpa opsi.
2. `node tools/validate.js .` memeriksa struktur, opsi ganda, kuota per topik, dan jawaban benar yang jauh lebih panjang dari pengecoh.
3. Naikkan `VERSION` di `sw.js` dan `?v=` di `index.html`.

`bkn_form.js` dibangkitkan oleh `python tools/build_form_set.py` dari `tools/gform_bkn_2025.json`.

## Sumber
PPT kisi-kisi PPSS BKN "PPT UDIN & UPKP - IMIPAS" (2025); Google Form latihan resmi BKN 2025 (s.id/LatihanUdinUPKP-Kemenimipas); SE BKN 10/2024. Pelengkap untuk catatan perbedaan dan subtopik yang di kisi-kisi BKN hanya berupa judul: Permenimipas 1/2024, 2/2024, 11/2025; PP 94/2021; PP 18/2016; UU 23/2014; UU 25/2009; UU 9/1998.
