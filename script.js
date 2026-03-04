// Background Animation with Canvas
const canvas = document.getElementById('neonCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
setCanvasSize();

// Wave effect class untuk animasi klik
class Wave {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = Math.min(canvas.width, canvas.height) * 0.3;
        this.speed = 2;
        this.alpha = 0.5;
        this.lineWidth = 2;
        this.active = true;
    }

    update() {
        if (this.radius < this.maxRadius) {
            this.radius += this.speed;
            this.alpha = Math.max(0, 0.5 * (1 - this.radius / this.maxRadius));
            this.lineWidth = Math.max(0.5, 5 * (1 - this.radius / this.maxRadius));
        } else {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${this.alpha})`;
        ctx.lineWidth = this.lineWidth;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        // Gambar lingkaran dalam untuk efek lebih
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
        ctx.lineWidth = this.lineWidth * 0.5;
        ctx.stroke();
    }
}

// Particle class for animation
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
    }

    update(waves) {
        // Efek gelombang pada partikel
        waves.forEach(wave => {
            if (wave.active) {
                const dx = this.x - wave.x;
                const dy = this.y - wave.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < wave.radius) {
                    // Partikel terdorong keluar dari pusat gelombang
                    const force = (1 - distance / wave.radius) * 2;
                    const angle = Math.atan2(dy, dx);
                    
                    this.vx += Math.cos(angle) * force * 0.2;
                    this.vy += Math.sin(angle) * force * 0.2;
                }
            }
        });

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Kembalikan ke kecepatan original secara perlahan
        this.vx += (this.originalVx - this.vx) * 0.01;
        this.vy += (this.originalVy - this.vy) * 0.01;
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

// Array untuk menyimpan efek gelombang
let waves = [];

// Event listener untuk klik pada canvas
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Buat gelombang baru
    waves.push(new Wave(x, y));
    
    // Batasi jumlah gelombang maksimal 5
    if (waves.length > 5) {
        waves = waves.slice(-5);
    }
});

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

    // Update dan gambar efek gelombang
    waves = waves.filter(wave => {
        wave.update();
        if (wave.active) {
            wave.draw();
        }
        return wave.active;
    });

    // Update dan draw particles
    particles.forEach(particle => {
        particle.update(waves);
        particle.draw();
    });

    // Draw connections between nearby particles
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                // Efek gelombang pada koneksi partikel
                let opacity = 0.2 - distance / 500;
                
                // Tambah opacity jika dekat dengan gelombang aktif
                waves.forEach(wave => {
                    if (wave.active) {
                        const midX = (p1.x + p2.x) / 2;
                        const midY = (p1.y + p2.y) / 2;
                        const waveDx = midX - wave.x;
                        const waveDy = midY - wave.y;
                        const waveDistance = Math.sqrt(waveDx * waveDx + waveDy * waveDy);
                        
                        if (waveDistance < wave.radius) {
                            opacity = Math.min(0.8, opacity + 0.3);
                        }
                    }
                });

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
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
// ===== PROFILE EMOJI RANDOM =====
const profileImg = document.getElementById('profileImg');
const profileEmoji = document.getElementById('profileEmoji');

// daftar emoji (bebas nambah)
const emojiList = [
    '✨','🔥','💫','⚡','💎','🌙','🖤','👑','🌀','🌌','😎','🎮'
];

let emojiTimeout = null;

profileImg.addEventListener('click', () => {
    // ambil emoji random
    const randomEmoji =
        emojiList[Math.floor(Math.random() * emojiList.length)];

    profileEmoji.textContent = randomEmoji;

    // reset kalau masih aktif
    profileEmoji.classList.remove('show');
    clearTimeout(emojiTimeout);

    // kasih delay kecil biar animasi ke-trigger ulang
    setTimeout(() => {
        profileEmoji.classList.add('show');
    }, 50);

    // hilang setelah 2 detik
    emojiTimeout = setTimeout(() => {
        profileEmoji.classList.remove('show');
    }, 2000);
});
// ===== BACKGROUND TOGGLE =====
const bgToggle = document.getElementById('bgToggle');

const backgrounds = [
    ['#0a0a0f', '#1a1a2f', '#0a0a0f'], // default
    ['#120018', '#3a0ca3', '#120018'], // ungu neon
    ['#001219', '#005f73', '#001219'], // biru cyber
    ['#000000', '#111111', '#000000']  // dark minimal
];

let bgIndex = 0;

// override gradient di animate()
let currentBg = backgrounds[0];

bgToggle.addEventListener('click', () => {
    bgIndex = (bgIndex + 1) % backgrounds.length;
    currentBg = backgrounds[bgIndex];
});
