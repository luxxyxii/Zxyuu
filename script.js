// =============================================
// KODE ASLI (BACKGROUND ANIMATION - LEBIH RINGAN)
// =============================================

// Background Animation with Canvas
const canvas = document.getElementById('neonCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

// Particle class for animation (LEBIH RINGAN - sedikit partikel)
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3; // Lebih lambat
        this.vy = (Math.random() - 0.5) * 0.3; // Lebih lambat
        this.radius = Math.random() * 1.5; // Lebih kecil
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 60%)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.fill();
    }
}

// Create particles - LEBIH SEDIKIT (50 instead of 100)
const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// =============================================
// EFEK GELOMBANG SAAT KLIK
// =============================================

const waves = [];

class Wave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.maxRadius = Math.min(canvas.width, canvas.height) * 0.3;
        this.speed = 2;
        this.alpha = 0.8;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`; // Warna neon random
    }

    update() {
        this.radius += this.speed;
        this.alpha -= 0.005;
        return this.alpha > 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        
        // Lingkaran dalam
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
    }
}

// Event listener untuk klik
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    waves.push(new Wave(x, y));
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient background (LEBIH RINGAN)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(1, '#1a1a2f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Update dan draw waves
    for (let i = waves.length - 1; i >= 0; i--) {
        if (!waves[i].update()) {
            waves.splice(i, 1);
        } else {
            waves[i].draw();
        }
    }

    requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', setCanvasSize);

// =============================================
// DOM ELEMENTS
// =============================================

const menuToggle = document.getElementById('menuToggle');
const popupMenu = document.getElementById('popupMenu');
const closeMenu = document.getElementById('closeMenu');
const aboutBtn = document.getElementById('aboutBtn');
const aboutPopup = document.getElementById('aboutPopup');
const closeAbout = document.getElementById('closeAbout');

// Open menu
menuToggle.addEventListener('click', () => {
    popupMenu.classList.add('show');
});

// Close menu
closeMenu.addEventListener('click', () => {
    popupMenu.classList.remove('show');
});

// Close menu when clicking outside
popupMenu.addEventListener('click', (e) => {
    if (e.target === popupMenu) {
        popupMenu.classList.remove('show');
    }
});

// Open about popup
aboutBtn.addEventListener('click', () => {
    popupMenu.classList.remove('show');
    aboutPopup.classList.add('show');
});

// Close about popup
closeAbout.addEventListener('click', () => {
    aboutPopup.classList.remove('show');
});

// Close about popup when clicking outside
aboutPopup.addEventListener('click', (e) => {
    if (e.target === aboutPopup) {
        aboutPopup.classList.remove('show');
    }
});

// Social links
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (href) {
            window.location.href = href;
        }
    });
});

// Keyboard escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        popupMenu.classList.remove('show');
        aboutPopup.classList.remove('show');
    }
});

// Mouse move effect for profile glow (LEBIH RINGAN)
const profileWrapper = document.querySelector('.profile-wrapper');
document.addEventListener('mousemove', (e) => {
    if (profileWrapper) {
        const glow = document.querySelector('.profile-glow');
        if (glow) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            glow.style.transform = `translate(${mouseX * 5}px, ${mouseY * 5}px)`;
        }
    }
});
