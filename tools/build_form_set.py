# Membangun js/bank/bkn_form.js dari data Google Form latihan resmi BKN 2025 (gform.json)
# Teks soal/opsi dipertahankan; kunci dan pembahasan disusun di sini.
import json, re, sys
src = sys.argv[1]
data = json.load(open(src, encoding="utf-8"))
items = data[1][1]
sections = {"PANCASILA": "pancasila", "UUD 1945": "uud", "SEJARAH INDONESIA": "sejarah", "BAHASA INDONESIA": "bindo",
            "RPJMN": "renstra", "KEPEGAWAIAN": "kepegawaian", "KORPRI": "kepegawaian", "PERKANTORAN": "perkantoran"}
K = [
 (2, "Keramahtamahan dan sopan santun adalah corak khas yang membedakan bangsa Indonesia dari bangsa lain, yaitu Pancasila sebagai kepribadian bangsa (deck hal. 32). Dasar negara berkaitan dengan pengaturan penyelenggaraan negara; pandangan hidup berkaitan dengan pedoman hidup sehari-hari."),
 (1, "Fondasi untuk mengatur penyelenggaraan ketatanegaraan/tata pemerintahan adalah rumusan Pancasila sebagai dasar negara (deck hal. 30)."),
 (1, "Taat beribadah adalah pengamalan sila pertama (Ketuhanan Yang Maha Esa) yang berlambang bintang emas. Rantai = sila 2, pohon beringin = sila 3, padi dan kapas = sila 5."),
 (0, "Hari Lahir Pancasila 1 Juni (Keppres 24/2016; pidato Soekarno 1 Juni 1945, deck hal. 21). 18 Agustus pengesahan UUD, 1 Oktober Hari Kesaktian Pancasila, 28 Oktober Sumpah Pemuda."),
 (3, "Deck hal. 23: perisai melambangkan perjuangan, pertahanan, dan perlindungan diri; 'perdamaian' bukan makna perisai."),
 (2, "Padi dan kapas (sila kelima) melambangkan kemakmuran dan kesejahteraan (pangan dan sandang) bagi seluruh rakyat."),
 (0, "Kerakyatan yang dipimpin hikmat kebijaksanaan dalam permusyawaratan/perwakilan = kedaulatan rakyat = demokrasi (deck hal. 39)."),
 (3, "Pasal 7 UUD 1945: masa jabatan 5 tahun dan dapat dipilih kembali hanya untuk satu kali masa jabatan (maksimal 2 periode). Presiden dilantik MPR (bukan DPR), harus WNI sejak lahir dan tidak pernah menerima kewarganegaraan lain atas kehendak sendiri, serta diusulkan parpol tanpa keharusan menjadi anggota parpol."),
 (1, "Batang tubuh UUD 1945 memuat lembaga negara, HAM (Bab XA), warga negara dan penduduk (Bab X), tetapi tidak mengatur manajemen pegawai negeri sipil (diatur UU 20/2023 dan PP)."),
 (3, "Bab IV Dewan Pertimbangan Agung dihapus pada perubahan keempat UUD 1945 (deck hal. 45). MK dan HAM justru ditambahkan; kekuasaan kehakiman tetap ada (Bab IX)."),
 (0, "Pasal 3 ayat (2): MPR melantik Presiden dan/atau Wakil Presiden (deck hal. 49)."),
 (2, "Pasal 27 ayat (3): setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara."),
 (3, "Pokok pikiran kedaulatan rakyat/kerakyatan dalam Pembukaan UUD 1945 diwujudkan dengan mengutamakan musyawarah untuk mufakat dalam menyelesaikan masalah (butir sila ke-4, deck hal. 38)."),
 (1, "Pasal 1 ayat (1): Negara Indonesia ialah negara kesatuan yang berbentuk republik (deck hal. 47)."),
 (1, "Urutan presiden: Soekarno (1), Soeharto (2), B.J. Habibie (3), Abdurrahman Wahid (4), Megawati (5), SBY (6), Joko Widodo (7), Prabowo (8)."),
 (0, "Tekanan menjelang kejatuhan Orde Baru 1998 terutama datang dari gerakan mahasiswa (demonstrasi dan pendudukan gedung DPR/MPR), bukan dari PBB, MPR, atau DPR yang saat itu dikuasai pendukung pemerintah."),
 (0, "G30S/PKI terjadi 30 September 1965 pada masa Presiden Soekarno; peristiwa ini mengawali peralihan ke Orde Baru."),
 (2, "Kabinet Jokowi-JK 2014-2019 bernama Kabinet Kerja; 2019-2024 Kabinet Indonesia Maju; Kabinet Indonesia Bersatu (SBY); Kabinet Pembangunan (Soeharto)."),
 (3, "Jenderal Ahmad Yani adalah salah satu perwira TNI AD yang gugur dalam G30S/PKI dan ditetapkan sebagai Pahlawan Revolusi. Sjahrir, Hasanuddin, dan Soedirman adalah pahlawan dari periode lain."),
 (1, "Sentralisasi Orde Baru berdampak pemerintah pusat mengendalikan seluruh aspek kehidupan; oposisi ditekan, bukan diberi kedudukan tinggi, dan ketenteraman yang tampak adalah hasil pembungkaman."),
 (3, "Bentuk baku: apotek, resep, diubah, teori, nasihat (deck hal. 85 dan KBBI). Catatan: pada Google Form resminya, opsi A dan B memang tertulis sama persis (cacat soal asli), dipertahankan apa adanya agar sesuai sumber."),
 (1, "Penulisan gelar yang benar: Agusthie Irvan, M.B.A. (titik pada tiap unsur, koma setelah nama). 'DR.' salah (Dr.), 'Mustikawati., S.Si, MT' salah (titik ganda, tanpa titik pada gelar), 'S.H., MH' salah (M.H.)."),
 (1, "Kunci yang paling sesuai kisi-kisi: se-DKI Jakarta (se- dirangkai dengan tanda hubung ke kata berhuruf kapital). Catatan: EYD V juga membenarkan tanda hubung untuk merangkai imbuhan dengan unsur asing yang dicetak miring (me-recall, di-back up), sehingga opsi A dan D secara kaidah juga dapat diterima; 'be-revolusi' jelas salah. Soal resmi ini kurang tegas; pilih B jika hanya satu jawaban."),
 (1, "Nama hari berhuruf kapital (Senin); 'upacara bendera' adalah kata umum sehingga huruf kecil (deck hal. 74)."),
 (3, "Kata khusus bermakna sempit: mawar (jenis bunga). Buah, pohon, dan tumbuhan adalah kata umum (deck hal. 84)."),
 (0, "'managemen' tidak baku (baku: manajemen). Antre, apotek, dan sistem adalah kata baku."),
 (0, "Empat pilar RPJMN IV 2020-2024: kelembagaan politik dan hukum yang mantap; kesejahteraan masyarakat yang terus meningkat; struktur ekonomi yang semakin maju dan kokoh; keanekaragaman hayati yang terjaga. Revolusi mental termasuk 7 agenda pembangunan."),
 (1, "UU 25/2004: RPJP Nasional berjangka 20 tahun; RPJMN 5 tahun; RKP 1 tahun (deck hal. 93). 'Rencana Pembangunan Jangka Pendek Nasional' tidak ada dalam SPPN."),
 (1, "Pembangunan SDM, infrastruktur, penyederhanaan regulasi, penyederhanaan birokrasi, dan transformasi ekonomi adalah 5 arahan Presiden Joko Widodo untuk RPJMN 2020-2024."),
 (2, "RPJMN 2020-2024 (Perpres 18/2020) memuat 9 misi Presiden (Nawacita jilid II)."),
 (1, "Penyederhanaan birokrasi ditempuh antara lain melalui penyelenggaraan e-Government/SPBE dan pemangkasan eselon. Pembangunan karakter dan PHBS termasuk agenda SDM/revolusi mental; infrastruktur ekonomi arahan tersendiri."),
 (1, "'Revolusi Mental dan Pembangunan Kebudayaan' adalah salah satu dari 7 agenda pembangunan RPJMN 2020-2024 (agenda ke-4)."),
 (1, "Cuti melahirkan untuk kelahiran anak pertama sampai ketiga; anak keempat dan seterusnya memakai cuti besar (deck hal. 115)."),
 (3, "Pejabat Pembina Kepegawaian (PPK) berwenang menetapkan pengangkatan, pemindahan, pemberhentian, dan pembinaan manajemen ASN di instansinya (UU 20/2023 Pasal 1 dan 29). Pejabat yang Berwenang (PyB) melaksanakan proses teknisnya."),
 (1, "PP 94/2021: tidak masuk kerja kumulatif 11-13 hari kerja dalam setahun = hukuman disiplin sedang (pemotongan tukin 25% selama 6 bulan)."),
 (3, "Manajemen PNS (PP 11/2017) meliputi pangkat dan jabatan, mutasi, pengembangan karier, dan komponen lain; 'peningkatan pendidikan' bukan komponen manajemen PNS (yang termasuk adalah pengembangan kompetensi)."),
 (1, "Rumusan 'pengelolaan PNS untuk menghasilkan PNS yang profesional, memiliki nilai dasar, etika profesi, bebas dari intervensi politik, bersih dari KKN' adalah definisi manajemen PNS (deck hal. 112). Sistem merit adalah dasar penyelenggaraannya."),
 (3, "Cuti besar diberikan kepada PNS yang telah bekerja paling singkat 5 tahun secara terus-menerus, lamanya paling lama 3 bulan (deck hal. 115)."),
 (2, "Lambang KORPRI terdiri atas pohon (kehidupan, kekuatan, dinamika), sayap (pengabdian), dan bangunan balairung (pengayom dan pelindung) sesuai AD/ART KORPRI (Keppres 24/2010)."),
 (3, "Anggota biasa KORPRI: PNS (termasuk camat), pegawai BUMN (Pertamina), BUMD, LPP, BLU/BLUD, Badan Otorita KEK, aparatur desa (deck hal. 121). Pegawai RS Siloam (swasta) bukan anggota."),
 (2, "Masa jabatan Dewan Pengurus KORPRI adalah 5 tahun (deck hal. 121)."),
 (1, "KORPRI netral dan tidak boleh menerima dana bantuan dari partai politik. Pernyataan lain benar: Panca Prasetya KORPRI (deck hal. 120), Dewan Pengurus Nasional di ibu kota negara (hal. 118), anggota luar biasa = pensiunan (hal. 121)."),
 (3, "HUT KORPRI 29 November (dibentuk 29 November 1971 berdasarkan Keppres 82/1971)."),
 (0, "Dalam lambang KORPRI, pohon melambangkan kekuatan, kesanggupan, dan dinamika hidup (dengan 17 ranting, 8 dahan, 45 daun); bangunan = pengayom dan pelindung; sayap = pengabdian dan perjuangan."),
 (3, "Naskah dinas arahan: pengaturan (peraturan, pedoman, juklak, SOP, surat edaran), penetapan (keputusan), penugasan (instruksi, surat perintah, surat tugas). Surat undangan termasuk naskah dinas korespondensi (deck hal. 132)."),
 (2, "UU 43/2009: arsip aktif adalah arsip yang frekuensi penggunaannya tinggi dan/atau terus-menerus. Arsip dinamis adalah kelompok besarnya (aktif, inaktif, vital); arsip terjaga terkait kelangsungan negara."),
 (3, "Naskah dinas penetapan berupa keputusan (deck hal. 132). Pedoman dan peraturan = pengaturan; instruksi = penugasan."),
 (2, "UU 43/2009 Pasal 1: arsip adalah rekaman kegiatan atau peristiwa dalam berbagai bentuk dan media sesuai perkembangan teknologi informasi dan komunikasi."),
 (2, "Definisi tersebut adalah administrasi menurut Hendi Haryadi dan A. Sugiarto (2009), dikutip deck hal. 135."),
 (3, "Kegiatan administrasi meliputi mencatat, mengirim, mengolah, menyimpan, dan mengevaluasi data (deck hal. 136); 'prosedur' adalah tata cara, bukan kegiatan administrasi."),
]
out = ['// SET "Latihan Resmi BKN 2025": 50 soal asli dari Google Form BKN (tautan di kisi-kisi hal. 172, s.id/LatihanUdinUPKP-Kemenimipas).',
       '// Teks soal dan opsi dipertahankan apa adanya (4 opsi). Kunci dan pembahasan disusun oleh aplikasi ini, bukan dari BKN.',
       'window.BANK = window.BANK || {};', 'window.BANK.perkantoran = window.BANK.perkantoran || [];']
cur = None; n = 0; counts = {}
js = lambda s: json.dumps(s, ensure_ascii=False)
for it in items:
    if it[3] == 8:
        cur = sections[it[1].strip()]; continue
    if it[3] != 2:
        continue
    q = re.sub(r'^\d+\.\s*', '', it[1].strip()); q = re.sub(r'\s+', ' ', q)
    opts = [re.sub(r'^[A-Da-d]\.\s*', '', o[0].strip()) for o in it[4][0][1]]
    a, e = K[n]; n += 1
    counts[cur] = counts.get(cur, 0) + 1
    out.append(f'window.BANK.{cur}.push({{ id: "form-{n:02d}", set: "form", topic: {js(cur)}, q: {js(q)}, o: [{", ".join(js(o) for o in opts)}], a: {a}, e: {js(e)}, src: "Latihan resmi BKN 2025 (Google Form), soal no. {n}" }});')
open("js/bank/bkn_form.js", "w", encoding="utf-8").write("\n".join(out) + "\n")
print(n, counts)
