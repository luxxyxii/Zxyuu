// =============================================
// KODE ASLI (YANG SUDAH ADA) - LETAKKAN PALING ATAS
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

// =============================================
// KODE EFEK NAGA - TAMBAHKAN DI BAGIAN PALING BAWAH
// =============================================

// Deteksi apakah kursor sedang di atas tombol
let isHoveringButton = false;
let mouseX = 0, mouseY = 0;
let lastNagaSpawn = 0;
const nagaParticles = [];

// Track semua elemen yang dianggap sebagai tombol
const buttonElements = document.querySelectorAll('button, .social-btn, .menu-btn, .popup-btn, .roblox-btn, .close-btn');

// Tambahkan event listeners untuk hover
buttonElements.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        isHoveringButton = true;
    });
    
    btn.addEventListener('mouseleave', () => {
        isHoveringButton = false;
    });
});

// Track posisi mouse
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Class untuk partikel naga
class NagaParticle {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 15 + 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 40 + 180}, 100%, 60%)`; // Warna neon biru/hijau
        this.alpha = Math.random() * 0.5 + 0.3;
        this.life = 1.0;
        this.decay = 0.005 + Math.random() * 0.01;
        this.wave = Math.random() * Math.PI * 2;
        this.type = Math.floor(Math.random() * 3); // 0: kepala, 1: badan, 2: ekor
    }

    update() {
        // Gerakan meliuk seperti naga
        this.wave += 0.05;
        this.x += this.speedX + Math.sin(this.wave) * 0.5;
        this.y += this.speedY + Math.cos(this.wave) * 0.5;
        
        // Kurangi umur
        this.life -= this.decay;
        
        // Perlambat gerakan
        this.speedX *= 0.99;
        this.speedY *= 0.99;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life * this.alpha;
        
        // Efek glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        
        // Gambar partikel berbentuk naga (abstrak)
        ctx.beginPath();
        
        if (this.type === 0) {
            // Bentuk kepala naga
            ctx.ellipse(this.x, this.y, this.size * 0.8, this.size * 0.6, 0, 0, Math.PI * 2);
            // Mata
            ctx.fillStyle = 'white';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
            ctx.arc(this.x + this.size * 0.3, this.y - this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 1) {
            // Bentuk badan/sisik
            for (let i = 0; i < 3; i++) {
                const offsetX = (i - 1) * this.size * 0.4;
                ctx.beginPath();
                ctx.arc(this.x + offsetX, this.y, this.size * 0.3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        } else {
            // Bentuk ekor/api
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.size, this.y - this.size * 0.5);
            ctx.lineTo(this.x - this.size, this.y + this.size * 0.5);
            ctx.closePath();
        }
        
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Tambahkan efek api di sekitar
        ctx.shadowBlur = 30;
        ctx.globalAlpha = this.life * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.restore();
    }
}

// Simpan referensi ke fungsi animate asli
const originalAnimate = animate;

// Overwrite fungsi animate
animate = function() {
    // Panggil fungsi animate asli untuk menggambar partikel original
    originalAnimate();
    
    // ===== EFEK NAGA =====
    // Jika tidak hover button, spawn naga
    if (!isHoveringButton) {
        const currentTime = Date.now();
        // Spawn naga setiap 500ms
        if (currentTime - lastNagaSpawn > 500) {
            lastNagaSpawn = currentTime;
            
            // Spawn beberapa partikel naga di sekitar mouse
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const radius = 50 + Math.random() * 50;
                const x = mouseX + Math.cos(angle) * radius;
                const y = mouseY + Math.sin(angle) * radius;
                nagaParticles.push(new NagaParticle(x, y));
            }
            
            // Spawn juga di area random untuk efek tersebar
            for (let i = 0; i < 3; i++) {
                nagaParticles.push(new NagaParticle());
            }
        }
        
        // Spawn partikel tambahan saat mouse bergerak
        if (Math.random() < 0.1) {
            nagaParticles.push(new NagaParticle(mouseX, mouseY));
        }
    }
    
    // Update dan draw naga particles
    for (let i = nagaParticles.length - 1; i >= 0; i--) {
        nagaParticles[i].update();
        nagaParticles[i].draw(ctx);
        
        // Hapus partikel yang sudah mati
        if (nagaParticles[i].life <= 0) {
            nagaParticles.splice(i, 1);
        }
    }
    
    // Batasi jumlah partikel naga
    if (nagaParticles.length > 100) {
        nagaParticles.splice(0, 50);
    }

    requestAnimationFrame(animate);
}

// Jalankan animasi (panggil sekali untuk memulai)
animate();
