// Data mini game "Urutkan": items sudah dalam urutan yang benar, [teks kartu, keterangan yang dibuka setelah kartu ditempatkan].
// Isi dari PPT kisi-kisi BKN 2025 (hal. per set). Teks kartu tidak boleh membocorkan urutan (tanpa nomor/tanggal).
window.URUT = [
  { id: "u-uud", topic: "uud", title: "Dari Pancasila ke amandemen UUD", pages: "21, 41-42", dir: "Dari peristiwa paling awal", items: [
    ["Soekarno menyampaikan istilah Pancasila di sidang BPUPKI", "1 Juni 1945"], ["Panitia Sembilan merumuskan Piagam Jakarta", "22 Juni 1945"],
    ["PPKI mengesahkan UUD 1945", "18 Agustus 1945"], ["Amandemen pertama UUD 1945", "14-21 Oktober 1999"], ["Amandemen keempat UUD 1945", "1-11 Agustus 2002"]] },
  { id: "u-alinea", topic: "uud", title: "Makna alinea Pembukaan UUD", pages: "44", dir: "Dari alinea pertama", items: [
    ["Kemerdekaan hak segala bangsa, penjajahan harus dihapuskan", "Alinea I"], ["Kemerdekaan adalah langkah awal menuju merdeka, bersatu, berdaulat, adil, makmur", "Alinea II"],
    ["Kemerdekaan atas berkat rahmat Allah dan didorong nilai luhur", "Alinea III"], ["Tujuan negara, UUD, dan dasar negara Pancasila", "Alinea IV"]] },
  { id: "u-bab-uud", topic: "uud", title: "Urutan bab UUD 1945", pages: "45-46", dir: "Dari bab paling awal", items: [
    ["Bentuk dan Kedaulatan", "Bab I · Pasal 1"], ["MPR", "Bab II · Pasal 2-3"], ["Kekuasaan Pemerintahan Negara", "Bab III · Pasal 4-16"], ["Kementerian Negara", "Bab V · Pasal 17"],
    ["Pemerintahan Daerah", "Bab VI · Pasal 18-18B"], ["DPR", "Bab VII · Pasal 19-22B"], ["DPD", "Bab VIIA · Pasal 22C-22D"], ["Pemilihan Umum", "Bab VIIB · Pasal 22E"],
    ["Hal Keuangan", "Bab VIII · Pasal 23-23D"], ["BPK", "Bab VIIIA · Pasal 23E-23G"], ["Kekuasaan Kehakiman", "Bab IX · Pasal 24-25"], ["Wilayah Negara", "Bab IXA · Pasal 25A"],
    ["Warga Negara dan Penduduk", "Bab X · Pasal 26-28"], ["Hak Asasi Manusia", "Bab XA · Pasal 28A-28J"], ["Agama", "Bab XI · Pasal 29"], ["Pertahanan dan Keamanan Negara", "Bab XII · Pasal 30"],
    ["Pendidikan dan Kebudayaan", "Bab XIII · Pasal 31-32"], ["Perekonomian Nasional dan Kesejahteraan Sosial", "Bab XIV · Pasal 33-34"],
    ["Bendera, Bahasa, Lambang Negara, Lagu Kebangsaan", "Bab XV · Pasal 35-36C"], ["Perubahan UUD", "Bab XVI · Pasal 37"]] },
  { id: "u-mei98", topic: "sejarah", title: "Peristiwa Mei 1998", pages: "59", dir: "Dari peristiwa paling awal", items: [
    ["Peristiwa Trisakti", "12 Mei 1998"], ["Kerusuhan massal, pusat perbelanjaan dijarah", "14-15 Mei 1998"],
    ["Mahasiswa menduduki Gedung DPR/MPR", "17-19 Mei 1998"], ["Soeharto mundur, digantikan B.J. Habibie", "21 Mei 1998"]] },
  { id: "u-presiden", topic: "sejarah", title: "Presiden dari masa ke masa", pages: "60", dir: "Dari presiden pertama", items: [
    ["Soekarno", "1945-1967"], ["Soeharto", "1967-1998"], ["B.J. Habibie", "1998-1999"], ["Abdurrahman Wahid", "1999-2001"], ["Megawati Soekarnoputri", "2001-2004"],
    ["Susilo Bambang Yudhoyono", "2004-2014"], ["Joko Widodo", "2014-2024"], ["Prabowo Subianto", "2024-2029"]] },
  { id: "u-kabinet", topic: "sejarah", title: "Kabinet era Reformasi", pages: "60", dir: "Dari kabinet paling awal", items: [
    ["Kabinet Reformasi Pembangunan", "B.J. Habibie, 37 menteri"], ["Kabinet Persatuan Nasional", "Abdurrahman Wahid, 36 menteri"], ["Kabinet Gotong Royong", "Megawati, 33 menteri"],
    ["Kabinet Indonesia Bersatu", "SBY 2004-2009"], ["Kabinet Indonesia Bersatu II", "SBY 2009-2014"], ["Kabinet Kerja", "Joko Widodo 2014-2019"],
    ["Kabinet Indonesia Maju", "Joko Widodo 2019-2024"], ["Kabinet Merah Putih", "Prabowo Subianto, 48 kementerian"]] },
  { id: "u-berakhlak", topic: "kepegawaian", title: "Urutan nilai BerAKHLAK", pages: "109", dir: "Sesuai urutan huruf BerAKHLAK", items: [
    ["Berorientasi pelayanan", "Ber"], ["Akuntabel", "A"], ["Kompeten", "K"], ["Harmonis", "H"], ["Loyal", "L"], ["Adaptif", "A"], ["Kolaboratif", "K"]] },
  { id: "u-manajemen-asn", topic: "kepegawaian", title: "Urutan komponen manajemen ASN", pages: "112", dir: "Sesuai urutan nomor di kisi-kisi", items: [
    ["Perencanaan kebutuhan", "Nomor 1"], ["Pengadaan", "Nomor 2"], ["Penguatan budaya kerja dan citra institusi", "Nomor 3"], ["Pengelolaan kinerja", "Nomor 4"],
    ["Pengembangan talenta dan karier", "Nomor 5"], ["Pengembangan kompetensi", "Nomor 6"], ["Pemberian penghargaan dan pengakuan", "Nomor 7"], ["Pemberhentian", "Nomor 8"]] },
  { id: "u-hukuman", topic: "kepegawaian", title: "Hukuman disiplin dari ringan ke berat", pages: "113", dir: "Dari yang paling ringan", items: [
    ["Teguran lisan", "Ringan"], ["Teguran tertulis", "Ringan"], ["Pernyataan tidak puas secara tertulis", "Ringan"],
    ["Potong tunjangan kinerja 25% selama 6 bulan", "Sedang"], ["Potong tunjangan kinerja 25% selama 9 bulan", "Sedang"], ["Potong tunjangan kinerja 25% selama 12 bulan", "Sedang"],
    ["Penurunan jabatan setingkat lebih rendah selama 12 bulan", "Berat"], ["Pembebasan dari jabatan menjadi pelaksana selama 12 bulan", "Berat"],
    ["Pemberhentian dengan hormat tidak atas permintaan sendiri", "Berat"]] },
  { id: "u-korpri", topic: "kepegawaian", title: "Sejarah KORPRI", pages: "116", dir: "Dari peristiwa paling awal", items: [
    ["Seluruh pegawai pemerintah Jepang menjadi pegawai NKRI", "17 Agustus 1945"], ["Pegawai terbagi tiga pada masa RIS", "27 Desember 1949"],
    ["Dekrit Presiden, muncul upaya agar pegawai netral", "5 Juli 1959"], ["Keppres 82/1971: KORPRI satu-satunya wadah pegawai RI", "29 November 1971"]] },
  { id: "u-panca-prasetya", topic: "kepegawaian", title: "Urutan Panca Prasetya KORPRI", pages: "120", dir: "Dari janji pertama", items: [
    ["Setia dan taat kepada NKRI dan Pemerintah RI", "Janji ke-1"], ["Menjunjung kehormatan bangsa, memegang rahasia jabatan dan negara", "Janji ke-2"],
    ["Mengutamakan kepentingan negara dan masyarakat di atas pribadi dan golongan", "Janji ke-3"], ["Memelihara persatuan dan kesetiakawanan Korps", "Janji ke-4"],
    ["Menegakkan kejujuran, keadilan, dan disiplin", "Janji ke-5"]] },
  { id: "u-siklus", topic: "kebijakan", title: "Siklus kebijakan publik", pages: "147", dir: "Dari tahap pertama", items: [
    ["Penyusunan agenda", "Mengidentifikasi masalah"], ["Formulasi kebijakan", "Mendefinisikan masalah, mendaftar alternatif"], ["Adopsi kebijakan", "Memilih satu alternatif"],
    ["Implementasi kebijakan", "Melaksanakan kebijakan"], ["Evaluasi kebijakan", "Menilai sejauh mana masalah terpecahkan"]] },
  { id: "u-perencanaan", topic: "renstra", title: "Alur dokumen perencanaan", pages: "93", dir: "Dari dokumen berjangka paling panjang", items: [
    ["RPJP Nasional", "20 tahun"], ["RPJM Nasional", "5 tahun, dijabarkan ke RKP"], ["RKP", "1 tahun"], ["APBN", "dibahas bersama DPR"]] },
  { id: "u-pn", topic: "renstra", title: "Urutan Prioritas Nasional RPJMN 2025-2029", pages: "97-101", dir: "Dari PN 1", items: [
    ["Ideologi Pancasila, demokrasi, HAM", "PN 1"], ["Hankam dan swasembada pangan, energi, air", "PN 2"], ["Infrastruktur dan lapangan kerja berkualitas", "PN 3"],
    ["SDM, sains, pendidikan, kesehatan, olahraga", "PN 4"], ["Hilirisasi dan industri berbasis SDA", "PN 5"], ["Membangun dari desa dan dari bawah", "PN 6"],
    ["Reformasi politik, hukum, birokrasi; berantas korupsi dan narkoba", "PN 7"], ["Harmoni lingkungan, budaya, toleransi beragama", "PN 8"]] },
  { id: "u-poac", topic: "manajemen", title: "Fungsi manajemen menurut Terry", pages: "157", dir: "Sesuai urutan definisi Terry", items: [
    ["Perencanaan", "Planning"], ["Pengorganisasian", "Organizing"], ["Penggerakan", "Actuating"], ["Pengawasan", "Controlling"]] }
];
