// Data mini game "Jodohkan": pasangan fakta dari tabel/bagan PPT kisi-kisi BKN 2025 (hal. disebut per set).
// Setiap sisi kanan dalam satu set harus unik agar pasangannya tidak ambigu. ext: true = pelengkap di luar isi kisi-kisi.
window.JODOH = [
  { id: "lambang-sila", topic: "pancasila", title: "Lambang dan sila", pages: "23", left: "Lambang", right: "Sila", pairs: [
    ["Bintang", "Sila 1 Ketuhanan Yang Maha Esa"], ["Rantai", "Sila 2 Kemanusiaan yang adil dan beradab"], ["Pohon beringin", "Sila 3 Persatuan Indonesia"],
    ["Kepala banteng", "Sila 4 Kerakyatan yang dipimpin oleh hikmat kebijaksanaan"], ["Padi dan kapas", "Sila 5 Keadilan sosial bagi seluruh rakyat"],
    ["Perisai Garuda", "Perjuangan, pertahanan, dan perlindungan diri"], ["Warna emas Garuda", "Kejayaan atau keagungan"]] },
  { id: "esensi-sila", topic: "pancasila", title: "Esensi pengamalan sila", pages: "39", left: "Sila", right: "Esensi", pairs: [
    ["Sila 1 (religion)", "Tuhan, agama, kepercayaan"], ["Sila 2 (humanity)", "HAM, hubungan manusia dengan manusia"], ["Sila 3 (nationalism)", "Bela negara, rela berkorban, cinta tanah air"],
    ["Sila 4 (democracy)", "Pemilu, musyawarah, kekeluargaan"], ["Sila 5 (justice)", "Seimbang antara hak dan kewajiban"]] },
  { id: "fungsi-pancasila", topic: "pancasila", title: "Fungsi Pancasila", pages: "29-33", left: "Fungsi", right: "Maknanya", pairs: [
    ["Jiwa bangsa", "Volksgeist: agar Indonesia tetap hidup dalam jiwa Pancasila"], ["Kepribadian bangsa", "Corak khas pembeda bangsa Indonesia dari bangsa lain"],
    ["Pandangan hidup", "Pedoman dan petunjuk kehidupan sehari-hari"], ["Falsafah hidup", "Pemersatu karena nilainya dianggap paling bijaksana, adil, benar"],
    ["Perjanjian luhur", "Disahkan PPKI sebagai wakil rakyat pada 18 Agustus 1945"], ["Sumber segala sumber hukum", "Setiap hukum tidak boleh bertentangan dengannya"],
    ["Dasar negara", "Dasar mengatur pemerintahan dan penyelenggaraan negara"]] },
  { id: "tokoh-pancasila", topic: "pancasila", title: "Tokoh dan istilah Pancasila", pages: "21, 25-28", left: "Tokoh/istilah", right: "Keterangan", pairs: [
    ["Ir. Soekarno", "Pertama kali menyampaikan istilah Pancasila, 1 Juni 1945"], ["Muhammad Yamin", "Sila = sendi, asas, dasar tingkah laku yang baik"],
    ["Notonegoro", "Dasar falsafah dan ideologi negara, pemersatu bangsa"], ["Mpu Tantular", "Kitab Sutasoma: pelaksanaan kesusilaan yang lima"],
    ["Panca", "Lima"], ["PPKI", "Mengesahkan Pancasila pada 18 Agustus 1945"]] },
  { id: "alinea", topic: "uud", title: "Makna alinea Pembukaan UUD", pages: "44", left: "Alinea", right: "Makna", pairs: [
    ["Alinea I", "Kemerdekaan hak segala bangsa, penjajahan harus dihapuskan"], ["Alinea II", "Kemerdekaan adalah langkah awal menuju merdeka, bersatu, berdaulat, adil, makmur"],
    ["Alinea III", "Kemerdekaan atas berkat rahmat Allah dan didorong nilai luhur"], ["Alinea IV", "Tujuan negara, dasar negara Pancasila, politik bebas aktif"]] },
  { id: "bab-pasal", topic: "uud", title: "Bab dan pasal UUD 1945", pages: "45-46", left: "Judul bab", right: "Pasal", pairs: [
    ["Bentuk dan Kedaulatan", "Pasal 1"], ["MPR", "Pasal 2-3"], ["Kekuasaan Pemerintahan Negara", "Pasal 4-16"], ["Kementerian Negara", "Pasal 17"],
    ["Pemerintahan Daerah", "Pasal 18-18B"], ["DPR", "Pasal 19-22B"], ["DPD", "Pasal 22C-22D"], ["Pemilihan Umum", "Pasal 22E"], ["Hal Keuangan", "Pasal 23-23D"],
    ["BPK", "Pasal 23E-23G"], ["Kekuasaan Kehakiman", "Pasal 24-25"], ["Wilayah Negara", "Pasal 25A"], ["Warga Negara dan Penduduk", "Pasal 26-28"],
    ["Hak Asasi Manusia", "Pasal 28A-28J"], ["Agama", "Pasal 29"], ["Pertahanan dan Keamanan Negara", "Pasal 30"], ["Pendidikan dan Kebudayaan", "Pasal 31-32"],
    ["Perekonomian Nasional dan Kesejahteraan Sosial", "Pasal 33-34"], ["Bendera, Bahasa, Lambang, Lagu Kebangsaan", "Pasal 35-36C"], ["Perubahan UUD", "Pasal 37"]] },
  { id: "amandemen-lembaga", topic: "uud", title: "Amandemen dan lembaga negara", pages: "42, 57", left: "Istilah", right: "Keterangan", pairs: [
    ["Amandemen I", "14-21 Oktober 1999"], ["Amandemen II", "7-18 Agustus 2000"], ["Amandemen III", "1-9 November 2001"], ["Amandemen IV", "1-11 Agustus 2002"],
    ["Lembaga legislatif", "Membuat UU (MPR, DPR, DPD)"], ["Lembaga eksekutif", "Melaksanakan UU (Presiden)"], ["Lembaga yudikatif", "Mengawasi jalannya UU (MA, MK, KY)"],
    ["Lembaga eksaminatif", "Memeriksa keuangan negara (BPK)"]] },
  { id: "presiden-kabinet", topic: "sejarah", title: "Presiden dan kabinet", pages: "60-67", left: "Presiden", right: "Kabinet", pairs: [
    ["B.J. Habibie", "Reformasi Pembangunan (37 menteri)"], ["Abdurrahman Wahid", "Persatuan Nasional (36 menteri)"], ["Megawati Soekarnoputri", "Gotong Royong (33 menteri)"],
    ["Susilo Bambang Yudhoyono", "Indonesia Bersatu dan Indonesia Bersatu II"], ["Joko Widodo", "Kerja dan Indonesia Maju"], ["Prabowo Subianto", "Merah Putih (48 kementerian)"]] },
  { id: "reformasi", topic: "sejarah", title: "Peristiwa era Reformasi", pages: "59, 62-65", left: "Waktu/tokoh", right: "Peristiwa", pairs: [
    ["12 Mei 1998", "Peristiwa Trisakti"], ["14-15 Mei 1998", "Kerusuhan massal, pusat perbelanjaan dijarah"], ["17-19 Mei 1998", "Mahasiswa menduduki Gedung DPR/MPR"],
    ["21 Mei 1998", "Soeharto mundur, digantikan B.J. Habibie"], ["Masa Habibie", "Referendum Timor Timur, UU Pers No. 40/1999"], ["Masa Gus Dur", "Pengakuan Imlek dan agama Konghucu"],
    ["Masa Megawati", "Pemilu presiden langsung pertama (2004)"], ["Masa SBY", "Melunasi utang IMF, masuk G-20"]] },
  { id: "tanda-baca", topic: "bindo", title: "Kelompok tanda baca", pages: "86", left: "Kelompok", right: "Tanda baca", pairs: [
    ["Penutup", "Titik, seru, tanya"], ["Penjeda", "Koma, titik koma, titik dua"], ["Pembatas", "Tanda hubung, tanda pisah, garis miring"],
    ["Pengapit", "Tanda petik, petik tunggal, kurung, kurung siku"], ["Penyingkat", "Elipsis, apostrof"]] },
  { id: "kata-baku", topic: "bindo", title: "Tidak baku ke baku", pages: "85", left: "Tidak baku", right: "Baku", pairs: [
    ["apotik", "apotek"], ["ajeg", "ajek"], ["analisa", "analisis"], ["antri", "antre"], ["azas", "asas"], ["nasehat", "nasihat"], ["dirubah", "diubah"], ["managemen", "manajemen"]] },
  { id: "umum-khusus", topic: "bindo", title: "Kata umum dan kata khusus", pages: "84", left: "Kata umum", right: "Kata khusus", pairs: [
    ["Membawa", "menjinjing, memikul, menggotong"], ["Melihat", "melirik, menengok, menengadah"], ["Bunga", "mawar, melati, kamboja"], ["Indah", "elok, menawan, menakjubkan"], ["Kendaraan", "becak"]] },
  { id: "berakhlak", topic: "kepegawaian", title: "Nilai dasar BerAKHLAK", pages: "109", left: "Nilai", right: "Penjabaran", pairs: [
    ["Berorientasi pelayanan", "Pelayanan prima demi kepuasan masyarakat"], ["Akuntabel", "Bertanggung jawab atas kepercayaan yang diberikan"], ["Kompeten", "Terus belajar dan mengembangkan kapabilitas"],
    ["Harmonis", "Saling peduli dan menghargai perbedaan"], ["Loyal", "Berdedikasi, mengutamakan kepentingan bangsa"], ["Adaptif", "Terus berinovasi menghadapi perubahan"], ["Kolaboratif", "Membangun kerja sama yang sinergis"]] },
  { id: "cuti", topic: "kepegawaian", title: "Jenis cuti PNS", pages: "115", left: "Cuti", right: "Ketentuan", pairs: [
    ["Cuti tahunan", "12 hari, permintaan tertulis ke PPK"], ["Cuti besar", "3 bulan, setelah bekerja 5 tahun"], ["Cuti sakit", "Maks. 1 tahun, bisa + 6 bulan (tim penguji kesehatan)"],
    ["Cuti melahirkan", "Anak ke-1 sampai ke-3"], ["Cuti alasan penting", "Paling lama 1 bulan"], ["CLTN", "Paling lama 3 tahun, setelah bekerja 5 tahun"], ["Cuti bersama", "Ditetapkan Keputusan Presiden"]] },
  { id: "disiplin-penghargaan", topic: "kepegawaian", title: "Disiplin, penghargaan, kenaikan pangkat", pages: "113-114", left: "Istilah", right: "Isi", pairs: [
    ["Hukuman ringan", "Teguran lisan, teguran tertulis, pernyataan tidak puas"], ["Hukuman sedang", "Potong tunjangan kinerja 25% selama 6/9/12 bulan"],
    ["Hukuman berat", "Penurunan jabatan, bebas jabatan jadi pelaksana, PDH-TAPS"], ["Penghargaan PNS", "Tanda kehormatan, kenaikan pangkat istimewa"],
    ["Jenis kenaikan pangkat", "Reguler, pilihan, anumerta, pengabdian"]] },
  { id: "korpri", topic: "kepegawaian", title: "KORPRI", pages: "116-121", left: "Istilah", right: "Keterangan", pairs: [
    ["Pohon lambang KORPRI", "Pengayom dan pelindung bangsa"], ["Bangunan lambang KORPRI", "Tempat pemersatu anggota, perekat bangsa"], ["Sayap lambang KORPRI", "Pengabdian dan perjuangan KORPRI"],
    ["Warna emas lambang KORPRI", "Keluhuran cita-cita kemerdekaan"], ["Anggota luar biasa", "Pensiunan anggota biasa"], ["Anggota kehormatan", "Penasihat, ditetapkan DP KORPRI Nasional"],
    ["Keppres 82/1971", "Pembentukan KORPRI, 29 November 1971"], ["Janji anggota", "Panca Prasetya KORPRI"], ["Doktrin", "Bhinneka Karya Abdi Negara"]] },
  { id: "yanlik-gg", topic: "gg", title: "Pelayanan publik dan good governance", pages: "124, 142-144", left: "Pihak/prinsip", right: "Peran", pairs: [
    ["Menteri PANRB", "Perumus kebijakan nasional pelayanan publik"], ["Ombudsman", "Pengawas penyelenggaraan pelayanan publik"], ["Gubernur, bupati, wali kota", "Pembina pelayanan publik di daerah"],
    ["Pemerintah (GG)", "Lingkungan politik dan hukum yang kondusif"], ["Dunia usaha (GG)", "Kegiatan ekonomi dan lapangan kerja"], ["Masyarakat (GG)", "Interaksi sosial, ekonomi, dan politik"],
    ["Transparansi", "Kebebasan arus informasi yang bisa dimonitor"], ["Kepastian hukum", "Hukum adil, dilaksanakan tanpa pandang bulu"]] },
  { id: "kebijakan", topic: "kebijakan", title: "Siklus dan tingkatan kebijakan", pages: "147-148", left: "Tahap/tingkat", right: "Isi", pairs: [
    ["Penyusunan agenda", "Mengidentifikasi masalah"], ["Formulasi", "Mendefinisikan masalah dan mendaftar alternatif"], ["Adopsi", "Memilih satu alternatif kebijakan"],
    ["Implementasi", "Melaksanakan kebijakan yang diambil"], ["Evaluasi", "Menilai sejauh mana masalah terpecahkan"], ["Kebijakan makro", "UUD, UU, PP, Perppu"],
    ["Kebijakan meso", "Peraturan Menteri, SKB antarmenteri"], ["Kebijakan mikro", "Peraturan gubernur, bupati, wali kota"]] },
  { id: "perencanaan", topic: "renstra", title: "Dokumen perencanaan", pages: "93, 150", left: "Dokumen", right: "Ciri", pairs: [
    ["RPJP Nasional", "20 tahun"], ["RPJM Nasional", "5 tahun, pedoman Renstra K/L"], ["RKP", "1 tahun, dasar penyusunan APBN"], ["Renja K/L", "1 tahun, penjabaran Renstra K/L"],
    ["UU 25/2004", "Sistem Perencanaan Pembangunan Nasional"]] },
  { id: "prioritas-nasional", topic: "renstra", title: "Prioritas Nasional RPJMN 2025-2029", pages: "97-101", left: "PN", right: "Isi", pairs: [
    ["PN 1", "Ideologi Pancasila, demokrasi, HAM"], ["PN 2", "Hankam dan swasembada pangan, energi, air"], ["PN 3", "Infrastruktur dan lapangan kerja berkualitas"],
    ["PN 4", "SDM, sains, pendidikan, kesehatan, olahraga"], ["PN 5", "Hilirisasi dan industri berbasis SDA"], ["PN 6", "Membangun dari desa dan dari bawah"],
    ["PN 7", "Reformasi politik, hukum, birokrasi; berantas korupsi, narkoba"], ["PN 8", "Harmoni lingkungan, budaya, toleransi beragama"]] },
  { id: "eselon", topic: "sotk", title: "Eselonisasi Kemenimipas", pages: "151 (subtopik)", ext: true, left: "Jabatan", right: "Eselon", pairs: [
    ["Sesjen, Dirjen, Irjen, Kepala Badan", "JPT madya, I.a"], ["Staf Ahli Menteri", "JPT madya, I.b"], ["Direktur, Kepala Biro, Kepala Pusat", "JPT pratama, II.a"],
    ["Kakanwil Ditjen Imigrasi tipe B", "JPT pratama, II.b"], ["Kepala Bagian, Kepala Bidang", "Administrator, III.a"], ["Kepala Subbagian", "Pengawas, IV.a"]] },
  { id: "tenses", topic: "inggris", title: "Tenses dan contohnya", pages: "166-171", left: "Tense", right: "Contoh", pairs: [
    ["Simple present", "She reads the newspaper every morning."], ["Present continuous", "Right now, I am looking at the board."], ["Present perfect", "We have been here since seven o'clock."],
    ["Simple past", "I went to bed early yesterday."], ["Past continuous", "While I was doing my homework, my mother got home."], ["Past perfect", "We went to the station, but the train had gone."],
    ["Future continuous", "She will be watching K-drama when you eat dinner."], ["Future perfect", "By the time I finish, my mother will have finished cooking."]] },
  { id: "literasi", topic: "literasi", title: "Pilar literasi digital", pages: "137-139", left: "Pilar", right: "Isi", pairs: [
    ["Digital skills", "Menguasai perangkat keras dan lunak"], ["Digital culture", "Pancasila dan Bhinneka Tunggal Ika di dunia digital"], ["Digital ethics", "Netiket, tidak menyebar hoaks"],
    ["Digital safety", "Proteksi data: kata sandi, OTP"]] },
  { id: "naskah-email", topic: "perkantoran", title: "Naskah dinas dan tools e-mail", pages: "132-133", left: "Istilah", right: "Isi", pairs: [
    ["Naskah arahan pengaturan", "Peraturan, pedoman, SOP, surat edaran"], ["Naskah arahan penetapan", "Keputusan"], ["Naskah arahan penugasan", "Instruksi, surat perintah, surat tugas"],
    ["Korespondensi intern", "Nota dinas dan memorandum"], ["Naskah dinas khusus", "Surat kuasa, berita acara, surat keterangan"], ["Inbox", "Kotak surat masuk"],
    ["Sent", "Kotak surat terkirim"], ["Forward", "Meneruskan surat"], ["Attach files", "Melampirkan file"]] },
  { id: "gaya-pimpin", topic: "manajemen", title: "Gaya kepemimpinan", pages: "154", left: "Gaya", right: "Ciri", pairs: [
    ["Otokratik", "Sentralisasi wewenang"], ["Paternalistik", "Pimpinan sebagai pusat informasi"], ["Kharismatik", "Memiliki daya tarik khusus"], ["Militeristik", "Sistem perintah, kaku, formal"],
    ["Pseudo-demokratik", "Manipulatif"], ["Demokratik", "Aktif, dinamis, terarah"], ["Laissez faire", "Kendali bebas atau masa bodoh"]] },
  { id: "fungsi-manajemen", topic: "manajemen", title: "Fungsi manajemen", pages: "158", left: "Fungsi", right: "Kegiatan", pairs: [
    ["Planning", "Menetapkan tujuan dan menentukan strategi"], ["Organizing", "Pembagian tugas dan pendelegasian"], ["Commanding", "Sharing knowledge dan penugasan"],
    ["Coordinating", "Penyatuan tindakan dan sinkronisasi kegiatan"], ["Actuating", "Menggerakkan semua orang dalam organisasi"], ["Controlling", "Routing, scheduling, dispatching, follow up"]] },
  { id: "tokoh-manajemen", topic: "manajemen", title: "Tokoh dan teori manajemen", pages: "157, 161-164", left: "Tokoh", right: "Teori", pairs: [
    ["Max Weber", "Teori birokrasi"], ["J.D. Mooney dan A. Reiley", "Teori administrasi (koordinasi, skalar, fungsional)"], ["Hugo Munsterberg", "Teori neo-klasik"],
    ["Abraham Maslow", "Teori modern"], ["George R. Terry", "POAC"], ["Mintzberg", "10 peran manajer dalam 3 kategori"], ["McKinsey 7S", "Tujuh unsur organisasi agar berjalan baik"]] }
];
