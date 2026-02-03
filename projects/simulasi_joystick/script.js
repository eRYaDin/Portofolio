// ============================================
// OPTIMASI ANDROID - MENCEGAH KLIK BERGANDA
// ============================================

// Debounce function untuk mencegah klik terlalu cepat
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Mencegah double tap zoom di iOS/Android
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// ============================================
// TOGGLE MODE GELAP
// ============================================
const tombolTema = document.getElementById('tombol-tema');
const body = document.body;

// Muat tema yang tersimpan
const temaTersimpan = localStorage.getItem('tema');
if (temaTersimpan) {
  body.setAttribute('data-theme', temaTersimpan);
  perbaruiTeksTombol(temaTersimpan);
}

// Handler toggle tema dengan debounce
const toggleTema = debounce(() => {
  const temaSaatIni = body.getAttribute('data-theme');
  const temaBaru = temaSaatIni === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', temaBaru);
  localStorage.setItem('tema', temaBaru);
  perbaruiTeksTombol(temaBaru);
}, 300);

// Event listener dengan passive untuk performa lebih baik
if (tombolTema) {
  tombolTema.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTema();
  }, { passive: false });
  
  // Tambah visual feedback untuk touch
  tombolTema.addEventListener('touchstart', () => {
    tombolTema.style.opacity = '0.7';
  }, { passive: true });
  
  tombolTema.addEventListener('touchend', () => {
    tombolTema.style.opacity = '1';
  }, { passive: true });
}

function perbaruiTeksTombol(tema) {
  if (tombolTema) {
    tombolTema.textContent = tema === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap';
  }
}

// ============================================
// SMOOTH SCROLL UNTUK NAVIGASI
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      // Smooth scroll
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Tutup semua dropdown setelah klik
      const dropdowns = document.querySelectorAll('.dropdown-content');
      dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
      });
    }
  }, { passive: false });
  
  // Visual feedback untuk touch
  anchor.addEventListener('touchstart', function() {
    this.style.opacity = '0.7';
  }, { passive: true });
  
  anchor.addEventListener('touchend', function() {
    this.style.opacity = '1';
  }, { passive: true });
});

// ============================================
// DROPDOWN INTERAKSI (OPTIMASI MOBILE)
// ============================================

// Tutup dropdown ketika klik di luar
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
      dropdown.style.display = 'none';
    });
  }
}, { passive: true });

// Toggle dropdown dengan debounce
const toggleDropdown = debounce((dropdown) => {
  // Tutup semua dropdown lain
  document.querySelectorAll('.dropdown-content').forEach(dd => {
    if (dd !== dropdown) {
      dd.style.display = 'none';
    }
  });
  
  // Toggle dropdown yang diklik
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}, 200);

document.querySelectorAll('.dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropdown = btn.nextElementSibling;
    if (dropdown) {
      toggleDropdown(dropdown);
    }
  }, { passive: false });
  
  // Visual feedback
  btn.addEventListener('touchstart', function() {
    this.style.opacity = '0.7';
  }, { passive: true });
  
  btn.addEventListener('touchend', function() {
    this.style.opacity = '1';
  }, { passive: true });
});

// ============================================
// KARTU PROYEK - OPTIMASI KLIK
// ============================================
document.querySelectorAll('.tautan-proyek').forEach(link => {
  // Mencegah klik berganda
  let isClicking = false;
  
  link.addEventListener('click', function(e) {
    if (isClicking) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    isClicking = true;
    setTimeout(() => {
      isClicking = false;
    }, 1000);
  }, { passive: false });
  
  // Visual feedback
  link.addEventListener('touchstart', function() {
    this.querySelector('.kartu-proyek').style.transform = 'scale(0.98)';
  }, { passive: true });
  
  link.addEventListener('touchend', function() {
    this.querySelector('.kartu-proyek').style.transform = '';
  }, { passive: true });
});

// ============================================
// DETEKSI PERANGKAT UNTUK OPTIMASI RESPONSIVE
// ============================================
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
    if (menuNav) {
      menuNav.style.display = 'none';
    }
    console.log('Dioptimasi untuk mobile');
  } else if (perangkat === 'tablet') {
    if (menuNav) {
      menuNav.style.gap = '18px';
    }
    console.log('Dioptimasi untuk tablet');
  } else {
    console.log('Dioptimasi untuk desktop');
  }
}

// JALANKAN OPTIMASI PADA LOAD DAN RESIZE (dengan debounce)
window.addEventListener('load', optimasiUntukPerangkat);
window.addEventListener('resize', debounce(optimasiUntukPerangkat, 250));

// ============================================
// ANIMASI PROGRESS BAR KEAHLIAN
// ============================================
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

// ============================================
// ANIMASI FADE-IN UNTUK TIMELINE DAN SECTION
// ============================================
function animasiScrollFadeIn() {
  const elemen = document.querySelectorAll('.fade');
  
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
    threshold: 0.1,
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

// ============================================
// ANIMASI UNTUK SECTION
// ============================================
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

// ============================================
// JALANKAN SEMUA ANIMASI PADA LOAD
// ============================================
window.addEventListener('load', () => {
  console.log('Halaman selesai dimuat, menjalankan animasi...');
  animasiBarProgress();
  aturAnimasiSection();
});

// ============================================
// LOG KONFIRMASI
// ============================================
console.log("Portfolio dimuat dengan optimasi Android!");
console.log("Fitur aktif: Mode Gelap, Smooth Scroll, Animasi Timeline, Progress Bar");
console.log("Optimasi: Debounce, Touch Feedback, Prevent Double Click");

// ============================================
// DETEKSI SCROLL UNTUK NAVBAR
// ============================================
let scrollTerakhir = 0;
const handleScroll = debounce(() => {
  const scrollSaatIni = window.pageYOffset;
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    if (scrollSaatIni > 100) {
      navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }
  
  scrollTerakhir = scrollSaatIni;
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// ============================================
// FUNGSI UTILITAS: DETEKSI BROWSER
// ============================================
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

// ============================================
// FUNGSI UNTUK MENGHITUNG WAKTU LOADING
// ============================================
const waktuMulai = performance.now();
window.addEventListener('load', () => {
  const waktuSelesai = performance.now();
  const waktuLoading = ((waktuSelesai - waktuMulai) / 1000).toFixed(2);
  console.log(`Halaman dimuat dalam ${waktuLoading} detik`);
});

// ============================================
// FUNGSI UNTUK MENDETEKSI KONEKSI INTERNET
// ============================================
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

// ============================================
// OPTIMASI KHUSUS ANDROID - HAPUS HIGHLIGHT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Tambahkan style untuk menghilangkan highlight di Android
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    input, textarea {
      -webkit-user-select: text;
      -khtml-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
  `;
  document.head.appendChild(style);
  
  console.log('Optimasi Android diterapkan: tap highlight removed');
});
