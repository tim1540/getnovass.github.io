// Smooth scrolling for navigation links
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

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 5px 20px rgba(139, 92, 246, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Add glitch effect on hover
const glitchText = document.querySelector('.glitch');
let glitchInterval;

glitchText.addEventListener('mouseenter', () => {
    let iterations = 0;
    glitchInterval = setInterval(() => {
        if (iterations < 3) {
            glitchText.style.textShadow = `
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #8b5cf6,
                ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #a78bfa
            `;
            iterations++;
        } else {
            glitchText.style.textShadow = 'none';
            clearInterval(glitchInterval);
        }
    }, 100);
});

// Advanced Cursor Trail Effect with Canvas
const canvas = document.getElementById('cursor-trail');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const maxParticles = 50;

class TrailParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.life = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.02;
        this.size *= 0.96;
    }
    
    draw() {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.life})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#8b5cf6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

document.addEventListener('mousemove', (e) => {
    const particle = new TrailParticle(e.clientX, e.clientY);
    particles.push(particle);
    
    if (particles.length > maxParticles) {
        particles.shift();
    }
});

function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateTrail);
}

animateTrail();

// Animate stats counter on scroll
const stats = document.querySelectorAll('.stat-number');
let animated = false;

const animateStats = () => {
    const statsSection = document.querySelector('.stats');
    const rect = statsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom >= 0 && !animated) {
        animated = true;
        stats.forEach(stat => {
            const text = stat.textContent;
            if (text.includes('K')) {
                animateNumber(stat, 0, 10, 'K+', 2000);
            } else if (text.includes('%')) {
                animateNumber(stat, 0, 99.9, '%', 2000);
            } else if (text === '24/7') {
                stat.textContent = '24/7';
            }
        });
    }
};

const animateNumber = (element, start, end, suffix, duration) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
};

window.addEventListener('scroll', animateStats);

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Create floating particles on click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary') || e.target.closest('.btn-primary')) {
        createFloatingParticles(e.clientX, e.clientY);
    }
});

function createFloatingParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 5px;
            height: 5px;
            background: #8b5cf6;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 2 + Math.random() * 2;
        
        animateParticle(particle, angle, velocity);
    }
}

function animateParticle(particle, angle, velocity) {
    let opacity = 1;
    let distance = 0;
    
    const animate = () => {
        distance += velocity;
        opacity -= 0.02;
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    
    animate();
}

// 3D Tilt Effect for Feature Cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// 3D Tilt Effect for Pricing Cards
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Animate pricing cards on scroll
document.querySelectorAll('.pricing-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.8s ease ${index * 0.2}s`;
    observer.observe(card);
});

// Parallax Effect on Scroll
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.particle');
            
            parallaxElements.forEach((el, index) => {
                const speed = (index + 1) * 0.05;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// Interactive Ripple Effect on Click
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent);
        pointer-events: none;
        z-index: 9999;
        animation: ripple-expand 1s ease-out;
    `;
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-expand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
            margin-left: 0;
            margin-top: 0;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
            margin-left: -150px;
            margin-top: -150px;
        }
    }
`;
document.head.appendChild(style);

// Shake animation on double click for title
let clickCount = 0;
let clickTimer = null;

glitchText.addEventListener('click', () => {
    clickCount++;
    
    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 300);
    } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        
        glitchText.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            glitchText.style.animation = 'glow 2s ease-in-out infinite';
        }, 500);
    }
});

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// Typing effect for subtitle
const subtitle = document.querySelector('.subtitle');
const originalText = subtitle.textContent;
subtitle.textContent = '';
let charIndex = 0;

function typeWriter() {
    if (charIndex < originalText.length) {
        subtitle.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    }
}

setTimeout(typeWriter, 500);

// Secret Mode - Press 'N' 'O' 'V' 'A' to activate
let secretCode = [];
const konamiCode = ['n', 'o', 'v', 'a'];

document.addEventListener('keydown', (e) => {
    secretCode.push(e.key.toLowerCase());
    secretCode.splice(-konamiCode.length - 1, secretCode.length - konamiCode.length);
    
    if (secretCode.join('').includes(konamiCode.join(''))) {
        activateSecretMode();
        secretCode = [];
    }
});

function activateSecretMode() {
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #8b5cf6, #6d28d9);
        padding: 2rem 3rem;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(139, 92, 246, 0.6);
        z-index: 10000;
        text-align: center;
        font-size: 1.5rem;
        font-weight: bold;
        animation: secret-appear 0.5s ease;
    `;
    notification.innerHTML = '✨ SECRET MODE ACTIVATED! ✨<br><span style="font-size: 1rem; font-weight: normal;">Rainbow mode enabled!</span>';
    document.body.appendChild(notification);
    
    // Activate rainbow mode
    let hue = 0;
    const rainbowInterval = setInterval(() => {
        hue = (hue + 1) % 360;
        document.documentElement.style.setProperty('--primary-purple', `hsl(${hue}, 80%, 65%)`);
        document.documentElement.style.setProperty('--light-purple', `hsl(${hue + 30}, 80%, 75%)`);
        document.documentElement.style.setProperty('--dark-purple', `hsl(${hue - 30}, 80%, 50%)`);
    }, 50);
    
    // Add stars explosion
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createStar();
        }, i * 50);
    }
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(rainbowInterval);
        document.documentElement.style.setProperty('--primary-purple', '#8b5cf6');
        document.documentElement.style.setProperty('--light-purple', '#a78bfa');
        document.documentElement.style.setProperty('--dark-purple', '#6d28d9');
    }, 10000);
}

function createStar() {
    const star = document.createElement('div');
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 20 + 10;
    
    star.textContent = '⭐';
    star.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        pointer-events: none;
        z-index: 9999;
        animation: star-explode 2s ease-out forwards;
    `;
    document.body.appendChild(star);
    
    setTimeout(() => star.remove(), 2000);
}

// Add star animation
const starStyle = document.createElement('style');
starStyle.textContent = `
    @keyframes star-explode {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(2) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes secret-appear {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(starStyle);

// Code Preview Click to Copy
const codePreview = document.querySelector('.code-preview');
if (codePreview) {
    codePreview.addEventListener('click', () => {
        const codeText = `local Nova = require("Nova")
local player = Nova.GetPlayer()

Nova.Execute(function()
  -- Your powerful code here
  player:SetPower(9999)
end)`;
        
        navigator.clipboard.writeText(codeText).then(() => {
            const toast = document.createElement('div');
            toast.textContent = '✅ Code copied to clipboard!';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5);
                z-index: 10000;
                animation: toast-appear 0.3s ease;
                font-weight: 600;
            `;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'toast-disappear 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        });
    });
}

// Add toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toast-appear {
        from {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes toast-disappear {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyle);

// Console Easter Egg
console.log('%cNOVA', 'color: #8b5cf6; font-size: 50px; font-weight: bold; text-shadow: 0 0 10px #8b5cf6;');
console.log('%cWelcome to Nova - The Ultimate Free Roblox Serverside', 'color: #a78bfa; font-size: 14px;');
console.log('%cJoin us: discord.gg/sided', 'color: #9ca3af; font-size: 12px;');
console.log('%cDouble-click the NOVA title for a shake!', 'color: #6d28d9; font-size: 12px; font-style: italic;');
console.log('%cPsst... try typing "NOVA" anywhere on the page 😉', 'color: #a78bfa; font-size: 11px; font-style: italic;');
console.log('%cClick the code preview to copy it!', 'color: #8b5cf6; font-size: 11px; font-style: italic;');
