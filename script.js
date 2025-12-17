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

console.log("Portfolio loaded with full features!");
