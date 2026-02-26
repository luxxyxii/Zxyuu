// Background Animation with Canvas
const canvas = document.getElementById('neonCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

// Particle class for animation
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
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
        ctx.shadowBlur = 10;
        ctx.fill();
    }
}

// Create particles
const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.5, '#1a1a2f');
    gradient.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections between nearby particles
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 - distance / 500})`;
                ctx.lineWidth = 0.5;
                ctx.shadowBlur = 5;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}
animate();

// Handle window resize
window.addEventListener('resize', setCanvasSize);

// DOM Elements
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

// Social links - langsung mengarah ke app
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href');
        if (href) {
            // Coba buka di app, fallback ke web
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

// Optional: Add mouse move effect for profile glow
const profileWrapper = document.querySelector('.profile-wrapper');
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    if (profileWrapper) {
        const glow = document.querySelector('.profile-glow');
        if (glow) {
            glow.style.transform = `translate(${mouseX * 10}px, ${mouseY * 10}px)`;
        }
    }
});
