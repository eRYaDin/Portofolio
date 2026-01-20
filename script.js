// TOGGLE MODE GELAP
const tombolTema = document.getElementById('tombol-tema');
const body = document.body;

// Muat tema yang tersimpan
const temaTersimpan = localStorage.getItem('tema');
if (temaTersimpan) {
  body.setAttribute('data-theme', temaTersimpan);
  perbaruiTeksTombol(temaTersimpan);
}

tombolTema.addEventListener('click', () => {
  const temaSaatIni = body.getAttribute('data-theme');
  const temaBaru = temaSaatIni === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', temaBaru);
  localStorage.setItem('tema', temaBaru);
  perbaruiTeksTombol(temaBaru);
});

function perbaruiTeksTombol(tema) {
  tombolTema.textContent = tema === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap';
}

// SMOOTH SCROLL UNTUK NAVIGASI
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// DROPDOWN INTERAKSI (UNTUK MOBILE ATAU TOUCH DEVICES)
document.addEventListener('click', (e) => {
  if (!e.target.matches('.dropbtn')) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    });
  }
});

// TOGGLE DROPDOWN PADA CLICK (UNTUK MOBILE)
document.querySelectorAll('.dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = btn.nextElementSibling;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});

// DETEKSI PERANGKAT UNTUK OPTIMASI RESPONSIVE
function deteksiPerangkat() {
  const lebar = window.innerWidth;
  
  if (lebar <= 768) {
    return 'mobile';
  } else if (lebar <= 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// OPTIMASI BERDASARKAN PERANGKAT
function optimasiUntukPerangkat() {
  const perangkat = deteksiPerangkat();
  const menuNav = document.querySelector('.nav-menu');
  
  if (perangkat === 'mobile') {
    // Sembunyikan nav menu di mobile (sudah di CSS, tapi bisa tambah JS)
    if (menuNav) {
      menuNav.style.display = 'none';
    }
    console.log('Dioptimasi untuk mobile');
  } else if (perangkat === 'tablet') {
    // Sesuaikan gap atau padding
    if (menuNav) {
      menuNav.style.gap = '18px';
    }
    console.log('Dioptimasi untuk tablet');
  } else {
    // Desktop: fitur penuh
    console.log('Dioptimasi untuk desktop');
  }
}

// JALANKAN OPTIMASI PADA LOAD DAN RESIZE
window.addEventListener('load', optimasiUntukPerangkat);
window.addEventListener('resize', optimasiUntukPerangkat);

// ANIMASI PROGRESS BAR KEAHLIAN
function animasiBarProgress() {
  const progressFills = document.querySelectorAll('.isi-progress');
  progressFills.forEach(fill => {
    const lebar = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = lebar;
    }, 500);
  });
}

// ANIMASI FADE-IN UNTUK TIMELINE DAN SECTION
function animasiScrollFadeIn() {
  const elemen = document.querySelectorAll('.fade');
  
  // Cek apakah ada elemen dengan class fade
  if (elemen.length === 0) {
    console.log('Tidak ada elemen dengan class .fade');
    return;
  }
  
  console.log(`Ditemukan ${elemen.length} elemen fade`);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        console.log('Elemen muncul:', entry.target);
      }
    });
  }, { 
    threshold: 0.1, // Turunkan dari 0.2 jadi 0.1 biar lebih mudah trigger
    rootMargin: '0px 0px -50px 0px'
  });
  
  elemen.forEach(el => {
    observer.observe(el);
    console.log('Mengamati elemen:', el);
  });
}

// FALLBACK: Jika Intersection Observer tidak support
function fallbackAnimasiFade() {
  const elemen = document.querySelectorAll('.fade');
  console.log('Menggunakan fallback animasi');
  
  elemen.forEach(el => {
    el.classList.add('show');
  });
}

// CEK SUPPORT INTERSECTION OBSERVER
if (!('IntersectionObserver' in window)) {
  console.warn('Browser tidak support Intersection Observer, menggunakan fallback');
  window.addEventListener('load', fallbackAnimasiFade);
} else {
  window.addEventListener('load', animasiScrollFadeIn);
}

// ANIMASI UNTUK SECTION (OPSIONAL)
function aturAnimasiSection() {
  const sections = document.querySelectorAll('.bagian');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
  });
}

// JALANKAN SEMUA ANIMASI PADA LOAD
window.addEventListener('load', () => {
  console.log('Halaman selesai dimuat, menjalankan animasi...');
  animasiBarProgress();
  // animasiScrollFadeIn sudah dipanggil di atas dengan pengecekan support
  aturAnimasiSection();
});

// FITUR TAMBAHAN: KLIK KARTU TIMELINE UNTUK EXPAND (OPSIONAL)
// Uncomment jika ingin menambahkan fitur ini
/*
document.querySelectorAll('.kartu-timeline').forEach(kartu => {
  kartu.addEventListener('click', () => {
    kartu.classList.toggle('expanded');
  });
});
*/

// LOG KONFIRMASI
console.log("Portfolio dimuat dengan fitur responsive penuh!");
console.log("Fitur aktif: Mode Gelap, Smooth Scroll, Animasi Timeline, Progress Bar");

// DETEKSI SCROLL UNTUK NAVBAR (OPSIONAL - NAVBAR BERUBAH SAAT SCROLL)
let scrollTerakhir = 0;
window.addEventListener('scroll', () => {
  const scrollSaatIni = window.pageYOffset;
  const navbar = document.querySelector('.navbar');
  
  if (scrollSaatIni > 100) {
    navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  
  scrollTerakhir = scrollSaatIni;
});

// FUNGSI UTILITAS: DETEKSI BROWSER
function deteksiBrowser() {
  const userAgent = navigator.userAgent;
  let namaBrowser = "Tidak diketahui";
  
  if (userAgent.indexOf("Chrome") > -1) {
    namaBrowser = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    namaBrowser = "Safari";
  } else if (userAgent.indexOf("Firefox") > -1) {
    namaBrowser = "Firefox";
  } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
    namaBrowser = "Internet Explorer";
  }
  
  console.log("Browser terdeteksi:", namaBrowser);
  return namaBrowser;
}

// JALANKAN DETEKSI BROWSER
deteksiBrowser();

// FUNGSI UNTUK MENGHITUNG WAKTU LOADING
const waktuMulai = performance.now();
window.addEventListener('load', () => {
  const waktuSelesai = performance.now();
  const waktuLoading = ((waktuSelesai - waktuMulai) / 1000).toFixed(2);
  console.log(`Halaman dimuat dalam ${waktuLoading} detik`);
});

// PROTEKSI DARI SPAM KLIK TOMBOL
let sedangAnimasi = false;
tombolTema.addEventListener('click', () => {
  if (sedangAnimasi) return;
  sedangAnimasi = true;
  setTimeout(() => {
    sedangAnimasi = false;
  }, 300);
});

// FUNGSI UNTUK MENDETEKSI KONEKSI INTERNET (OPSIONAL)
function cekKoneksi() {
  if (navigator.onLine) {
    console.log("Status: Online");
  } else {
    console.log("Status: Offline");
  }
}

window.addEventListener('online', () => {
  console.log("Koneksi kembali!");
});

window.addEventListener('offline', () => {
  console.log("Koneksi terputus!");
});

// JALANKAN CEK KONEKSI
cekKoneksi();
