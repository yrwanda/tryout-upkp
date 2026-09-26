// Data mini game "Kelompokkan": kartu dimasukkan ke kelompok yang tepat. Isi dari tabel/daftar PPT kisi-kisi BKN 2025 (hal. per set).
// Satu kartu hanya boleh ada di satu kelompok. Butir yang muncul di dua daftar sekaligus sengaja tidak dipakai (lihat note).
window.KELOMPOK = [
  { id: "k-butir-sila", topic: "pancasila", title: "Butir pengamalan per sila", pages: "35-38", q: "Butir ini termasuk pengamalan sila ke berapa?", bins: [
    { label: "Sila 1", items: ["Kebebasan menjalankan ibadah", "Tidak memaksakan agama kepada orang lain"] },
    { label: "Sila 2", items: ["Tenggang rasa dan tepa selira", "Berani membela kebenaran dan keadilan", "Tidak semena-mena terhadap orang lain"] },
    { label: "Sila 3", items: ["Rela berkorban untuk bangsa dan negara", "Persatuan atas dasar Bhinneka Tunggal Ika", "Bangga berkebangsaan dan bertanah air Indonesia"] },
    { label: "Sila 4", items: ["Musyawarah untuk mufakat diliputi kekeluargaan", "Menerima hasil musyawarah dengan iktikad baik", "Memberi kepercayaan kepada wakil yang dipercayai"] },
    { label: "Sila 5", items: ["Menjaga keseimbangan hak dan kewajiban", "Tidak bergaya hidup mewah", "Suka bekerja keras", "Suasana kekeluargaan dan kegotongroyongan"] }] },
  { id: "k-lembaga", topic: "uud", title: "Fungsi lembaga negara", pages: "57", q: "Lembaga ini termasuk kelompok mana?", bins: [
    { label: "Legislatif (membuat UU)", items: ["MPR", "DPR", "DPD"] },
    { label: "Eksekutif (melaksanakan UU)", items: ["Presiden"] },
    { label: "Yudikatif (mengawasi jalannya UU)", items: ["MA", "MK", "KY"] },
    { label: "Eksaminatif (memeriksa keuangan)", items: ["BPK"] }] },
  { id: "k-amandemen-lembaga", topic: "uud", title: "Lembaga sebelum dan sesudah amandemen", pages: "56-57", q: "Lembaga ini ada di bagan yang mana?", bins: [
    { label: "Ada sebelum dan sesudah", items: ["MPR", "DPR", "Presiden", "MA", "BPK"] },
    { label: "Hanya sebelum amandemen", items: ["DPA"] },
    { label: "Baru setelah amandemen", items: ["DPD", "MK", "KY"] }] },
  { id: "k-presiden", topic: "sejarah", title: "Kebijakan dan peristiwa per presiden", pages: "62-67", q: "Ini terjadi pada masa presiden siapa?", bins: [
    { label: "B.J. Habibie", items: ["Referendum Timor Timur", "UU 40/1999 tentang Pers"] },
    { label: "Abdurrahman Wahid", items: ["Pengakuan Tahun Baru Imlek", "Kesetaraan agama Konghucu", "Dialog kebangsaan pemberantasan korupsi"] },
    { label: "Megawati", items: ["Kabinet Gotong Royong", "Pemilu presiden langsung mulai 2004"] },
    { label: "SBY", items: ["Melunasi utang IMF", "Masuk G-20 (2009)", "UU 24/2011 tentang BPJS"] },
    { label: "Joko Widodo", items: ["Kartu Indonesia Sehat dan Kartu Indonesia Pintar", "Menghadapi pandemi COVID-19"] },
    { label: "Prabowo Subianto", items: ["Kabinet Merah Putih, 48 kementerian", "Program Makan Siang Gratis"] }] },
  { id: "k-kapital", topic: "bindo", title: "Huruf kapital: benar atau salah", pages: "72-76", q: "Penulisan huruf kapitalnya sudah benar?", bins: [
    { label: "Penulisan benar", items: ["bulan Agustus", "15 watt", "Abdul Rahman bin Zaini", "jeruk bali", "berlayar ke teluk", "Wakil Presiden Adam Malik", "belajar bahasa Jepang", "Teluk Persia", "menurut hukum Archimedes", "Surat Saudara telah kami terima."] },
    { label: "Penulisan salah", items: ["bulan agustus", "15 Watt", "Abdul Rahman Bin Zaini", "jeruk Bali", "berlayar ke Teluk", "wakil presiden Adam Malik", "belajar Bahasa Jepang", "teluk Persia", "menurut Hukum Archimedes", "memperingati Proklamasi Kemerdekaan setiap tahun"] }] },
  { id: "k-konjungsi", topic: "bindo", title: "Konjungsi dan tanda koma", pages: "87-88", q: "Bagaimana aturan koma untuk konjungsi ini?", note: "Semua kartu ditulis huruf kecil supaya huruf kapital tidak jadi petunjuk.", bins: [
    { label: "Di awal kalimat, diikuti koma", items: ["agaknya", "akan tetapi", "akhirnya", "misalnya", "namun", "oleh karena itu", "sebagai kesimpulan", "sebaliknya"] },
    { label: "Di tengah kalimat, didahului koma", items: ["kecuali", "melainkan", "sedangkan", "seperti", "yaitu", "yakni"] },
    { label: "Tanpa koma", items: ["bahwa", "jika", "karena", "maka", "sebab", "sehingga", "supaya", "ketika", "lalu"] }] },
  { id: "k-tanda-baca", topic: "bindo", title: "Lima kelompok tanda baca", pages: "86", q: "Tanda baca ini masuk kelompok mana?", bins: [
    { label: "Penutup", items: ["titik ( . )", "tanda seru ( ! )", "tanda tanya ( ? )"] },
    { label: "Penjeda", items: ["koma ( , )", "titik koma ( ; )", "titik dua ( : )"] },
    { label: "Pembatas", items: ["tanda hubung ( - )", "tanda pisah ( – )", "garis miring ( / )"] },
    { label: "Pengapit", items: ["tanda petik ( \" \" )", "petik tunggal ( ' ' )", "tanda kurung ( ( ) )", "kurung siku ( [ ] )"] },
    { label: "Penyingkat", items: ["elipsis ( ... )", "apostrof ( ' )"] }] },
  { id: "k-umum-khusus", topic: "bindo", title: "Kata umum atau kata khusus", pages: "84", q: "Kata ini bermakna luas atau sempit?", bins: [
    { label: "Kata umum", items: ["bunga", "membawa", "melihat", "indah", "kendaraan", "pohon"] },
    { label: "Kata khusus", items: ["mawar", "anggrek", "menjinjing", "memikul", "melirik", "menengadah", "elok", "menakjubkan", "becak", "pulpen"] }] },
  { id: "k-baku", topic: "bindo", title: "Kata baku atau tidak baku", pages: "85", q: "Kata ini baku menurut KBBI?", bins: [
    { label: "Baku", items: ["apotek", "ajek", "analisis", "antre", "asas"] },
    { label: "Tidak baku", items: ["apotik", "ajeg", "analisa", "antri", "azas"] }] },
  { id: "k-hak-kewajiban", topic: "kepegawaian", title: "Hak atau kewajiban ASN", pages: "111", q: "Ini hak atau kewajiban ASN?", bins: [
    { label: "Hak ASN", items: ["Penghasilan", "Penghargaan yang bersifat motivasi", "Tunjangan dan fasilitas", "Jaminan sosial", "Lingkungan kerja", "Pengembangan diri", "Bantuan hukum"] },
    { label: "Kewajiban ASN", items: ["Setia dan taat pada Pancasila, UUD 1945, NKRI, pemerintah yang sah", "Menjaga persatuan dan kesatuan bangsa", "Menaati peraturan perundang-undangan", "Menunjukkan integritas dan keteladanan", "Menyimpan rahasia jabatan", "Bersedia ditempatkan di seluruh wilayah NKRI"] }] },
  { id: "k-hukuman", topic: "kepegawaian", title: "Tingkat hukuman disiplin", pages: "113", q: "Hukuman ini termasuk tingkat apa?", note: "Kisi-kisi menulis \"penurunan pangkat\"; PP 94/2021 menyebut penurunan jabatan. Tingkatnya sama: berat.", bins: [
    { label: "Ringan", items: ["Teguran lisan", "Teguran tertulis", "Pernyataan tidak puas secara tertulis"] },
    { label: "Sedang", items: ["Potong tunjangan kinerja 25% selama 6 bulan", "Potong tunjangan kinerja 25% selama 9 bulan", "Potong tunjangan kinerja 25% selama 12 bulan"] },
    { label: "Berat", items: ["Penurunan jabatan setingkat lebih rendah selama 12 bulan", "Pembebasan dari jabatan menjadi pelaksana selama 12 bulan", "Pemberhentian dengan hormat tidak atas permintaan sendiri"] }] },
  { id: "k-anggota-korpri", topic: "kepegawaian", title: "Keanggotaan KORPRI", pages: "121", q: "Termasuk jenis anggota KORPRI yang mana?", bins: [
    { label: "Anggota kehormatan", items: ["Penasihat KORPRI yang ditetapkan DP KORPRI Nasional"] },
    { label: "Anggota biasa", items: ["PNS", "Pegawai BUMN", "Pegawai BUMD", "Pegawai BLU/BLUD", "Pegawai LPP RI", "Aparatur pemerintah desa"] },
    { label: "Anggota luar biasa", items: ["Pensiunan anggota biasa"] }] },
  { id: "k-asas-gg", topic: "gg", title: "Asas pelayanan publik atau karakteristik good governance", pages: "125, 143", q: "Istilah ini ada di daftar yang mana?", note: "Kepastian hukum, akuntabilitas, dan partisipasi ada di kedua daftar, jadi tidak dimunculkan.", bins: [
    { label: "Asas pelayanan publik", items: ["Kepentingan umum", "Kesamaan hak", "Keseimbangan hak dan kewajiban", "Keprofesionalan", "Persamaan perlakuan/tidak diskriminatif", "Keterbukaan", "Fasilitas dan perlakuan khusus bagi kelompok rentan", "Ketepatan waktu", "Kecepatan, kemudahan, dan keterjangkauan"] },
    { label: "Karakteristik good governance", items: ["Transparansi", "Tanggung jawab", "Berorientasi pada kesepakatan", "Keadilan", "Efektivitas dan efisiensi", "Visi strategik"] }] },
  { id: "k-tingkat-kebijakan", topic: "kebijakan", title: "Tingkatan kebijakan publik", pages: "148", q: "Produk hukum ini termasuk kebijakan tingkat apa?", bins: [
    { label: "Makro", items: ["UUD", "Undang-Undang", "Peraturan Pemerintah", "Perppu"] },
    { label: "Meso", items: ["Peraturan Menteri", "SKB antarmenteri"] },
    { label: "Mikro", items: ["Peraturan Gubernur", "Peraturan Wali Kota/Bupati"] }] },
  { id: "k-literasi", topic: "literasi", title: "Pilar literasi digital", pages: "139", q: "Contoh ini termasuk pilar yang mana?", bins: [
    { label: "Etika digital", items: ["Tidak menyebarkan berita bohong", "Tidak melakukan perundungan"] },
    { label: "Budaya digital", items: ["Aktif di media sosial", "Berbelanja online"] },
    { label: "Keterampilan digital", items: ["Memakai Zoom meeting", "Memakai Google Docs dan spreadsheet"] },
    { label: "Keamanan digital", items: ["Memakai password", "Memahami OTP", "Waspada terhadap cybercrime"] }] },
  { id: "k-naskah", topic: "perkantoran", title: "Jenis naskah dinas", pages: "132", q: "Naskah ini termasuk jenis apa?", bins: [
    { label: "Arahan: pengaturan", items: ["Peraturan", "Pedoman", "SOP", "Surat edaran"] },
    { label: "Arahan: penetapan", items: ["Keputusan"] },
    { label: "Arahan: penugasan", items: ["Instruksi", "Surat perintah", "Surat tugas"] },
    { label: "Korespondensi", items: ["Nota dinas", "Memorandum", "Surat undangan"] },
    { label: "Khusus", items: ["Surat perjanjian", "Surat kuasa", "Surat pengantar", "Berita acara", "Surat keterangan", "Pengumuman"] }] },
  { id: "k-lisan-tertulis", topic: "perkantoran", title: "Komunikasi lisan atau tertulis", pages: "128", q: "Ciri ini milik komunikasi yang mana?", bins: [
    { label: "Komunikasi lisan", items: ["Dua arah", "Fleksibel", "Umpan balik langsung", "Bisa dibantu gestur"] },
    { label: "Komunikasi tertulis", items: ["Satu arah", "Bahasa lebih terstruktur", "Ada kelonggaran waktu memilih diksi"] }] },
  { id: "k-ragam", topic: "perkantoran", title: "Ragam beku atau ragam resmi", pages: "129-130", q: "Ini contoh atau ciri ragam yang mana?", bins: [
    { label: "Ragam beku", items: ["Pengambilan sumpah", "Akta notaris", "Upacara kenegaraan", "Naskah perjanjian jual beli", "Surat sewa menyewa", "Pola dan kaidahnya tidak boleh diubah"] },
    { label: "Ragam resmi", items: ["Naskah dinas", "Bahasa baku sesuai kaidah dan PUEBI", "Kalimat lengkap, lugas, dan sopan"] }] },
  { id: "k-level-manajemen", topic: "manajemen", title: "Level manajemen", pages: "159", q: "Jabatan ini termasuk level mana?", bins: [
    { label: "Top management", items: ["Kepala institusi", "CEO", "Direktur"] },
    { label: "Middle management", items: ["Manajer cabang", "Kepala pengawas", "Kepala departemen", "Kepala bagian"] },
    { label: "Low management", items: ["Mandor", "Supervisor", "Pengawas lapangan"] }] },
  { id: "k-fungsi-manajemen", topic: "manajemen", title: "Kegiatan per fungsi manajemen", pages: "158", q: "Kegiatan ini bagian dari fungsi apa?", bins: [
    { label: "Planning", items: ["Menetapkan tujuan", "Identifikasi masalah", "Menentukan strategi"] },
    { label: "Organizing", items: ["Pembagian tugas/pekerjaan", "Pendelegasian"] },
    { label: "Coordinating", items: ["Penyatuan tindakan untuk tujuan bersama", "Sinkronisasi kegiatan"] },
    { label: "Controlling", items: ["Routing (alur kerja)", "Scheduling", "Dispatching", "Follow up"] }] }
];
