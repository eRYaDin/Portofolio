// DARK MODE TOGGLE
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  body.setAttribute('data-theme', savedTheme);
  updateButtonText(savedTheme);
}

themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateButtonText(newTheme);
});

function updateButtonText(theme) {
  themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// SMOOTH SCROLL UNTUK NAV
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

// DROPDOWN INTERAKSI (UNTUK MOBILE ATAU TOUCH DEVICES – BONUS)
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

// OPTIONAL: TOGGLE DROPDOWN PADA CLICK (UNTUK MOBILE)
document.querySelectorAll('.dropbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = btn.nextElementSibling;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});

// DETEKSI DEVICE UNTUK OPTIMASI RESPONSIVE
function detectDevice() {
  const userAgent = navigator.userAgent;
  const width = window.innerWidth;
  
  if (width <= 768) {
    return 'mobile';
  } else if (width <= 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// OPTIMASI BERDASARKAN DEVICE (BONUS)
function optimizeForDevice() {
  const device = detectDevice();
  const navMenu = document.querySelector('.nav-menu');
  const themeBtn = document.querySelector('.theme-btn');
  
  if (device === 'mobile') {
    // Sembunyikan nav menu di mobile (sudah di CSS, tapi bisa tambah JS)
    if (navMenu) {
      navMenu.style.display = 'none';
    }
    // Tambah event listener untuk hamburger jika ada (opsional)
    console.log('Optimized for mobile');
  } else if (device === 'tablet') {
    // Sesuaikan gap atau padding
    if (navMenu) {
      navMenu.style.gap = '18px';
    }
    console.log('Optimized for tablet');
  } else {
    // Desktop: full features
    console.log('Optimized for desktop');
  }
}

// RUN OPTIMASI PADA LOAD DAN RESIZE
window.addEventListener('load', optimizeForDevice);
window.addEventListener('resize', optimizeForDevice);

// ANIMASI PROGRESS BAR SKILLS (BONUS RESPONSIVE)
function animateProgressBars() {
  const progressFills = document.querySelectorAll('.progress-fill');
  progressFills.forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = width;
    }, 500);
  });
}

// ANIMASI PADA SCROLL (BONUS)
function handleScrollAnimations() {
  const sections = document.querySelectorAll('.section');
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

// RUN ANIMASI PADA LOAD
window.addEventListener('load', () => {
  animateProgressBars();
  handleScrollAnimations();
});

console.log("Portfolio loaded with full responsive features!");
