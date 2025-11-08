// Mobile Sidebar Toggle
const hamburger = document.getElementById('hamburger');
const mobileSidebar = document.getElementById('mobileSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const openSettingsBtn = document.getElementById('openSettingsBtn');

// Only allow vibration after a user gesture to avoid Chrome intervention logs
let __userInteracted = false;
window.addEventListener('pointerdown', () => { __userInteracted = true; }, { passive: true });
window.addEventListener('keydown', () => { __userInteracted = true; });
function vib(x){ try { if (!__userInteracted) return; if (navigator.vibrate) navigator.vibrate(x); } catch(_){} }
function isMobileScreen(){ return window.innerWidth <= 1024; }

function openSidebar() {
    // Ensure desktop-collapsed state doesn't block mobile opening
    document.body.classList.remove('sidebar-collapsed');
    mobileSidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
    vib(10);
}

function closeSidebarMenu() {
    mobileSidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
    vib(8);
}

hamburger.addEventListener('click', () => {
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop) {
        // Toggle collapse on desktop
        document.body.classList.toggle('sidebar-collapsed');
    } else {
        if (mobileSidebar.classList.contains('active')) {
            closeSidebarMenu();
        } else {
            openSidebar();
        }
    }
});

closeSidebar.addEventListener('click', () => {
    const isDesktop = window.innerWidth > 1024;
    if (isDesktop) {
        document.body.classList.add('sidebar-collapsed');
    } else {
        closeSidebarMenu();
    }
});
sidebarOverlay.addEventListener('click', closeSidebarMenu);

// Close sidebar when clicking on a link with visual feedback
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = link.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(139, 92, 246, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: sidebar-ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        link.style.position = 'relative';
        link.style.overflow = 'hidden';
        link.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Close sidebar after a short delay for smooth UX
        setTimeout(() => {
            closeSidebarMenu();
        }, 200);
    });
});

// Add ripple animation CSS
const sidebarRippleStyle = document.createElement('style');
sidebarRippleStyle.textContent = `
    @keyframes sidebar-ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sidebarRippleStyle);

// Close sidebar on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
        closeSidebarMenu();
    }
});

// Settings button near logo opens Settings section
if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
        const target = document.querySelector('#settings');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mobileSidebar.classList.contains('active')) closeSidebarMenu();
    });
}

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

// (Removed navbar scroll effect since topbar is replaced by sidebar)

// Fancy-mode controlled animations
function isFancy() { return !bodyEl.classList.contains('performance-mode'); }
let scrollObserver = null;

function setupScrollAnimations() {
    // Add more elements for smooth text/blocks appearance
    const selector = [
        '.section-title',
        '.feature-card',
        '.feature-card p',
        '.pricing-card',
        '.pricing-card .plan-description',
        '.about .code-preview',
        '.about .about-text p',
        '.policy .policy-card',
        '.policy .policy-section li'
    ].join(', ');
    const elements = Array.from(document.querySelectorAll(selector));

    // Clean previous observer
    if (scrollObserver) { try { scrollObserver.disconnect(); } catch(e){} }

    if (!elements.length) return;

    if (!isFancy()) {
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
        return;
    }

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = `opacity .5s ease ${index * 0.04}s, transform .5s ease ${index * 0.04}s`;
        scrollObserver.observe(el);
    });

    // Immediately reveal items already in viewport (avoid missing content at load)
    const inView = (el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight - 20 && r.bottom > 0;
    };
    requestAnimationFrame(() => {
        elements.forEach(el => {
            if (inView(el)) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });
}

// Stats numbers animation (fancy mode only)
let statsAnimated = false;
function setupStatsAnimation() {
    const statsWrap = document.querySelector('.stats');
    const statsEls = Array.from(document.querySelectorAll('.stat-number'));
    if (!statsWrap || !statsEls.length) return;

    if (!isFancy()) { statsAnimated = true; return; }
    statsAnimated = false;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statsEls.forEach(el => animateStat(el));
                obs.disconnect();
            }
        });
    }, { threshold: 0.4 });
    obs.observe(statsWrap);
}

function animateStat(el) {
    const text = (el.textContent || '').trim();
    if (text.includes('24/7')) { el.textContent = '24/7'; return; }
    let target = 0, format = (v)=>String(v);
    if (/k$/i.test(text)) {
        const val = parseFloat(text.replace(/k/i,'')) || 0;
        target = val;
        format = (v)=> (v.toFixed(1)) + 'K';
        runCounter(0, target, 1200, v=> el.textContent = format(v));
    } else if (/\+$/.test(text)) {
        const val = parseInt(text.replace(/\+/,'').replace(/,/g,''), 10) || 0;
        target = val;
        format = (v)=> Math.floor(v).toLocaleString() + '+';
        runCounter(0, target, 1200, v=> el.textContent = format(v));
    } else if (/%$/.test(text)) {
        const val = parseFloat(text.replace(/%/,'')) || 0;
        target = val;
        format = (v)=> v.toFixed(1) + '%';
        runCounter(0, target, 1200, v=> el.textContent = format(v));
    } else if (/^[\d,]+$/.test(text)) {
        const val = parseInt(text.replace(/,/g,''), 10) || 0;
        target = val;
        format = (v)=> Math.floor(v).toLocaleString();
        runCounter(0, target, 1200, v=> el.textContent = format(v));
    }
}

function runCounter(from, to, duration, onUpdate) {
    const start = performance.now();
    function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = from + (to - from) * eased;
        onUpdate(value);
        if (t < 1 && isFancy()) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

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

// Advanced Cursor Trail Effect with Canvas (Desktop only)
const canvas = document.getElementById('cursor-trail');
const ctx = canvas.getContext('2d');
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
} else {
    canvas.style.display = 'none';
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // If moving to mobile width, remove desktop-collapsed class so mobile menu can slide in
    if (window.innerWidth <= 1024) {
        document.body.classList.remove('sidebar-collapsed');
    }
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
    if (!statsSection || animated) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
        animated = true; // keep current values as-is
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

/* ===== Site Settings, Theme, Cookies, Visits, Command Palette ===== */
const bodyEl = document.body;
const themeSwitch = document.getElementById('themeSwitch');
const perfSwitch = document.getElementById('perfSwitch');
const cookieSwitch = document.getElementById('cookieSwitch');
const visitCounterEl = document.getElementById('visitCounter');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookiesBtn = document.getElementById('acceptCookies');
const declineCookiesBtn = document.getElementById('declineCookies');

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeSwitch) themeSwitch.checked = theme === 'light';
}
function animationsReady(){
  const l = document.getElementById('appLoader');
  return !l || l.style.display === 'none' || l.classList.contains('loader-exit');
}
function setMode(mode) {
  if (mode === 'performance') {
    bodyEl.classList.add('performance-mode');
  } else {
    bodyEl.classList.remove('performance-mode');
  }
  localStorage.setItem('mode', mode);
  if (perfSwitch) perfSwitch.checked = mode === 'performance';
  // Re-init animations only if loader is gone; otherwise they'll init on hide
  if (animationsReady()) {
    setupScrollAnimations();
    setupStatsAnimation();
  }
}
function setCookieConsent(consented) {
  localStorage.setItem('cookieConsent', consented ? 'true' : 'false');
  if (cookieSwitch) cookieSwitch.checked = !!consented;
  if (consented) {
    cookieBanner && (cookieBanner.hidden = true);
    incrementVisits();
    sendWebhookTimeVisits();
  } else {
    // hide banner when explicitly declined
    cookieBanner && (cookieBanner.hidden = true);
  }
  renderVisits();
}
function getCookie(name) {
  try {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  } catch { return ''; }
}
function setCookie(name, value, days) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/; SameSite=Lax${secure}`;
  } catch {}
}
function getVisitCount() {
  const c = parseInt(getCookie('visits') || '', 10);
  if (!Number.isNaN(c) && c >= 0) return c;
  const ls = parseInt(localStorage.getItem('visitsLS') || '', 10);
  return Number.isNaN(ls) || ls < 0 ? 0 : ls;
}
function setVisitCount(v) {
  setCookie('visits', String(v), 365);
  localStorage.setItem('visitsLS', String(v));
}
function incrementVisits() {
  const consent = localStorage.getItem('cookieConsent') === 'true';
  if (!consent) return;
  const current = getVisitCount();
  setVisitCount(current + 1);
}
function renderVisits() {
  const consent = localStorage.getItem('cookieConsent') === 'true';
  if (!visitCounterEl) return;
  if (!consent) {
    visitCounterEl.textContent = '';
    return;
  }
  const v = getVisitCount();
  visitCounterEl.textContent = `Visits: ${v}`;
}
let cookieBannerPending = false;
function initSettings() {
  // Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  // Mode
  const savedMode = localStorage.getItem('mode') || 'fancy';
  setMode(savedMode);
  // Cookies
  const consent = localStorage.getItem('cookieConsent');
  if (consent === null) {
    // Defer showing the banner until loader is gone
    cookieBannerPending = true;
  } else {
    if (cookieSwitch) cookieSwitch.checked = (consent === 'true');
    if (consent === 'true') { incrementVisits(); sendWebhookTimeVisits(); }
  }
}
// Wire switches
if (themeSwitch) {
  themeSwitch.addEventListener('change', (e) => setTheme(e.target.checked ? 'light' : 'dark'));
}
if (perfSwitch) {
  perfSwitch.addEventListener('change', (e) => setMode(e.target.checked ? 'performance' : 'fancy'));
}
if (cookieSwitch) {
  cookieSwitch.addEventListener('change', (e) => setCookieConsent(!!e.target.checked));
}
if (acceptCookiesBtn) acceptCookiesBtn.addEventListener('click', () => { vib(12); setCookieConsent(true); pushNotify('Cookies enabled: visit counter will be saved.', { duration: 3500 }); });
if (declineCookiesBtn) declineCookiesBtn.addEventListener('click', () => { vib([6,50,6]); setCookieConsent(false); pushNotify('Cookies disabled: visit counter will be hidden.', { duration: 3500 }); });

initSettings();
renderVisits();

// Update visit counter on focus (new sessions/tabs)
window.addEventListener('focus', renderVisits);

// ===== Lightweight telemetry (privacy-conscious) =====
// NOTE: Ideally, send to your own endpoint. Direct webhooks can expose the URL.
const TELEMETRY_ENDPOINT = '';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1436630498985119796/baOYh5V3ySBDXxI4UxPVKSfjff0reWTccB9sBXIyZF_ISkasQhTtVFMCRB0Fo4Y7Vz1B';
function sendTelemetry(extra = {}) {
  try {
    if (localStorage.getItem('cookieConsent') !== 'true') return; // only with consent
    if (!TELEMETRY_ENDPOINT) return; // no-op until configured
    const payload = {
      event: 'visit',
      ts: Date.now(),
      ua: navigator.userAgent,
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      theme: document.body.getAttribute('data-theme'),
      mode: bodyEl.classList.contains('performance-mode') ? 'performance' : 'fancy',
      referrer: document.referrer || null,
      visits: (parseInt(localStorage.getItem('visitsLS') || '0', 10) || 0),
      ...extra,
    };
    fetch(TELEMETRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(()=>{});
  } catch(_) {}
}

// Simple device info helper for webhook
function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  const width = window.innerWidth;
  const height = window.innerHeight;
  let os = 'Unknown';
  if (/Android/i.test(ua)) os = 'Android';
  else if (/(iPhone|iPad|iPod)/i.test(ua)) os = 'iOS';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';
  let type = 'Desktop';
  if (/(Tablet|iPad|Android(?!.*Mobile))/i.test(ua)) type = 'Tablet';
  else if (/(Mobi|iPhone|Android)/i.test(ua) || width <= 768) type = 'Mobile';
  return { type, os, ua, viewport: `${width}x${height}` };
}

// Robust saved-username getter (cookie or localStorage)
function getSavedUsername() {
  // Try regex-based getCookie
  let vC = '';
  try { vC = getCookie('discord_username') || ''; } catch(_) {}
  // Fallback: manual parse in case regex fails in some environments
  if (!vC) {
    try {
      const parts = (document.cookie || '').split(';');
      for (const p of parts) {
        const s = p.trim();
        if (s.toLowerCase().startsWith('discord_username=')) {
          vC = s.substring('discord_username='.length);
          break;
        }
      }
    } catch(_) {}
  }
  try { if (vC) vC = decodeURIComponent(vC); } catch(_) {}
  const vLS = (localStorage.getItem('discord_username') || '').trim();
  return (vC || vLS || '').trim();
}

// Send time and visits to Discord webhook (on every visit)
function sendWebhookTimeVisits() {
  try {
    if (localStorage.getItem('cookieConsent') !== 'true') return;
    const visits = (parseInt(localStorage.getItem('visitsLS') || '0', 10) || 0);
    const now = new Date();
    const timeStr = now.toLocaleString();
    const name = (localStorage.getItem('discord_username') || '').trim();
    const origin = (location.origin && location.origin.startsWith('http')) ? location.origin : '';
    const dev = getDeviceInfo();
    const embed = {
      title: 'Site Visit',
      color: 0x8b5cf6,
      thumbnail: origin ? { url: origin + '/nova.jpg' } : undefined,
      fields: [
        { name: 'Visits', value: String(visits), inline: true },
        { name: 'Time', value: timeStr, inline: true },
        { name: 'Device', value: `${dev.type} • ${dev.os} • ${dev.viewport}`, inline: true }
      ]
    };
    if (name) embed.fields.push({ name: 'User', value: name, inline: true });
    const body = {
      username: 'NOVA',
      avatar_url: origin ? origin + '/nova.jpg' : undefined,
      embeds: [embed]
    };
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).catch(()=>{});
  } catch(_) {}
}

// ===== First-run notices & username prompt =====
const appLoader = document.getElementById('appLoader');
const easterModal = document.getElementById('easterModal');
const easterClose = document.getElementById('easterClose');
const usernameModal = document.getElementById('usernameModal');
const discordNameInput = document.getElementById('discordNameInput');
const discordNameSave = document.getElementById('discordNameSave');
const discordNameSkip = document.getElementById('discordNameSkip');
const notifyContainer = document.getElementById('notifyContainer');
// Loader username step elements
const loaderUsername = document.getElementById('loaderUsername');
const loaderNameInput = document.getElementById('loaderNameInput');
const loaderNameSave = document.getElementById('loaderNameSave');
const loaderNameSkip = document.getElementById('loaderNameSkip');

function showModal(m){ m && (m.hidden = false); }
function hideModal(m){ m && (m.hidden = true); }
function pushNotify(message, {duration=8000}={}){
  if (!notifyContainer) return;
  const n = document.createElement('div');
  n.className = 'notify';
  n.innerHTML = `<img src="nova.jpg" alt="Nova" class="icon"/><div class="body">${message}</div><button class="close" aria-label="Close">✕</button>`;
  const closeBtn = n.querySelector('.close');
  closeBtn.addEventListener('click', ()=> hide());
  notifyContainer.appendChild(n);
  const hide = ()=>{ n.classList.add('hide'); setTimeout(()=> n.remove(), 250); };
  if (duration>0) setTimeout(hide, duration);
}

function showPostLoaderNotices(){
  // Tips & Easter eggs as a session toast (no modal)
  if (!sessionStorage.getItem('tips_shown')) {
    pushNotify('Tips: Double-click NOVA to shake · Type “NOVA” for Secret Mode · Right Alt opens the Command Palette · Click code preview to copy.', { duration: 12000 });
    sessionStorage.setItem('tips_shown','1');
  }
  // Stats notice per session
  if (!sessionStorage.getItem('stats_notice_shown')) {
    pushNotify('Heads up: we collect basic usage data for statistics to improve the site. You can control this in Site Settings.', { duration: 10000 });
    sessionStorage.setItem('stats_notice_shown','1');
  }
}

function setLoader(pct, msg){
  const bar = document.getElementById('loaderBar');
  const stage = document.getElementById('loaderStage');
  if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
  if (stage && msg) stage.textContent = msg;
}
function hideLoaderSmooth(){
  if (!appLoader) return;
  if (appLoader.classList.contains('loader-exit')) return;
  appLoader.classList.add('loader-exit');
  vib(12);
  let done = false;
  const onDone = () => {
    if (done) return; done = true;
    appLoader.style.display = 'none';
    appLoader.setAttribute('aria-hidden','true');
    // Restore scroll
    if (document.body.dataset.prevOverflow !== undefined) {
      document.body.style.overflow = document.body.dataset.prevOverflow;
      delete document.body.dataset.prevOverflow;
    }
    // Show cookie banner now if needed
    if (cookieBannerPending && cookieBanner) { cookieBanner.hidden = false; cookieBannerPending = false; }
    appLoader.removeEventListener('animationend', onDone);
    // Start animations only after loader fully hidden
    setupScrollAnimations();
    setupStatsAnimation();
    // Now that loader is gone, show notifications
    showPostLoaderNotices();
  };
  appLoader.addEventListener('animationend', onDone);
  // If animations are disabled (performance mode or prefers-reduced-motion) or no animation duration, finish immediately
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const perfMode = document.body.classList.contains('performance-mode');
  const cs = getComputedStyle(appLoader);
  const dur = parseFloat(cs.animationDuration) || 0;
  if (prefersReduce || perfMode || dur === 0) {
    onDone();
  } else {
    // Safety: ensure completion in case animationend doesn't fire
    setTimeout(onDone, 900);
  }
}
function finishLoaderWithName(nameOrNull){
  try {
    if (typeof nameOrNull === 'string' && nameOrNull.trim()) {
      const val = nameOrNull.trim();
      localStorage.setItem('discord_username', val);
      setCookie('discord_username', encodeURIComponent(val), 365);
      sendTelemetry({ discord_username: val });
    } else {
      sendTelemetry({ discord_username: null });
    }
  } catch(_) {}
  if (loaderUsername) loaderUsername.hidden = true;
  hideLoaderSmooth();
}
async function runLoaderSequence(){
  if (!appLoader) return;
  appLoader.setAttribute('aria-hidden','false');
  // Lock scroll while loader is visible
  document.body.dataset.prevOverflow = document.body.style.overflow || '';
  document.body.style.overflow = 'hidden';
  // Early: if username already saved, make sure username UI stays hidden
  const savedEarly = getSavedUsername();
  const skipUserStep = !!savedEarly;
  if (skipUserStep && loaderUsername) { try { loaderUsername.hidden = true; loaderUsername.style.display = 'none'; } catch(_){} }
  setLoader(8, 'Initializing…');
  await new Promise(r=>setTimeout(r, 200));
  setLoader(18, 'Preparing assets…');
  await new Promise(r=>setTimeout(r, 150));
  // Connectivity check (skip on file:// to avoid CORS/ERR_FAILED)
  const isHttp = location.protocol === 'http:' || location.protocol === 'https:';
  if (isHttp) {
    setLoader(35, 'Checking connectivity…');
    try {
      const ctrl = new AbortController();
      const t = setTimeout(()=>ctrl.abort(), 1500);
      await fetch('robots.txt', { cache: 'no-store', signal: ctrl.signal });
      clearTimeout(t);
      setLoader(55, 'Connection OK');
    } catch { setLoader(55, 'Proceeding…'); }
  } else {
    // Skip on local file protocol
    setLoader(55, 'Proceeding…');
  }
  // Preload small assets
  setLoader(72, 'Warming up assets…');
  await Promise.race([
    Promise.allSettled([
      new Promise(res=>{ const i=new Image(); i.onload=i.onerror=()=>res(); i.src='nova.jpg'; }),
      new Promise(res=>{ const i=new Image(); i.onload=i.onerror=()=>res(); i.src='robux.png'; })
    ]),
    new Promise(r=>setTimeout(r, 1200))
  ]);
  setLoader(90, 'Finalizing…');
  await new Promise(r=>setTimeout(r, 250));
  if (loaderUsername) {
    // If username already saved (cookie or localStorage), skip prompt and exit immediately
    const saved = savedEarly || getSavedUsername();
    if (saved) { hideLoaderSmooth(); return; }
    // Otherwise show username step
    const prog = document.querySelector('.progress');
    if (prog) prog.style.display = 'none';
    loaderUsername.hidden = false;
    loaderUsername.style.display = 'grid';
    setTimeout(()=> loaderNameInput && loaderNameInput.focus(), 0);
    return; // wait for user to continue via save/skip handlers
  }
  hideLoaderSmooth();
}

window.addEventListener('load', () => {
  runLoaderSequence();
  // Failsafe: hide loader even if something stalls (but not if waiting for username)
  setTimeout(()=>{ 
    const waitingForName = loaderUsername && loaderUsername.hidden === false;
    if (appLoader && appLoader.style.display !== 'none' && !waitingForName) hideLoaderSmooth(); 
  }, 7000);
});

easterClose && easterClose.addEventListener('click', ()=>{
  localStorage.setItem('easter_seen','1');
  hideModal(easterModal);
});

discordNameSave && discordNameSave.addEventListener('click', ()=>{
  const name = (discordNameInput?.value || '').trim();
  if (name) localStorage.setItem('discord_username', name);
  hideModal(usernameModal);
  vib(10);
  sendTelemetry({ discord_username: name || null });
});

discordNameSkip && discordNameSkip.addEventListener('click', ()=>{
  hideModal(usernameModal);
  vib(5);
  sendTelemetry({ discord_username: null });
});

// Loader username handlers
loaderNameSave && loaderNameSave.addEventListener('click', (e)=>{
  e.preventDefault();
  vib(10);
  const name = (loaderNameInput?.value || '').trim();
  finishLoaderWithName(name || null);
});
loaderNameSkip && loaderNameSkip.addEventListener('click', (e)=>{
  e.preventDefault();
  vib(5);
  finishLoaderWithName(null);
});
// Enter key submits the username step
loaderNameInput && loaderNameInput.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter') {
    e.preventDefault();
    vib(10);
    const name = (loaderNameInput?.value || '').trim();
    finishLoaderWithName(name || null);
  }
});
// Fallback: delegate clicks from loader container (in case direct listeners miss)
appLoader && appLoader.addEventListener('click', (e)=>{
  const t = e.target;
  if (!(t instanceof Element)) return;
  if (t.id === 'loaderNameSave') {
    e.preventDefault(); e.stopPropagation();
    vib(10);
    const name = (loaderNameInput?.value || '').trim();
    finishLoaderWithName(name || null);
  } else if (t.id === 'loaderNameSkip') {
    e.preventDefault(); e.stopPropagation();
    vib(5);
    finishLoaderWithName(null);
  }
}, true);
// Global fallbacks for inline onclick
window.__loaderContinue = () => {
  try { vib(10); } catch(_){}
  const inp = document.getElementById('loaderNameInput');
  const name = (inp && inp.value ? inp.value : '').trim();
  finishLoaderWithName(name || null);
};
window.__loaderSkip = () => {
  try { vib(5); } catch(_){}
  finishLoaderWithName(null);
};

/* ===== Command Palette (Right Alt) ===== */
const cmdPalette = document.getElementById('cmdPalette');
const cmdInput = document.getElementById('cmdInput');
const cmdList = document.getElementById('cmdList');
const commands = [
  { label: 'Go to Home', action: () => document.querySelector('#home').scrollIntoView({behavior:'smooth'}) },
  { label: 'Go to Features', action: () => document.querySelector('#features').scrollIntoView({behavior:'smooth'}) },
  { label: 'Go to Pricing', action: () => document.querySelector('#pricing').scrollIntoView({behavior:'smooth'}) },
  { label: 'Go to About', action: () => document.querySelector('#about').scrollIntoView({behavior:'smooth'}) },
  { label: 'Go to Policy', action: () => document.querySelector('#policy').scrollIntoView({behavior:'smooth'}) },
  { label: 'Go to Settings', action: () => document.querySelector('#settings').scrollIntoView({behavior:'smooth'}) },
  { label: 'Toggle Theme', action: () => setTheme(document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark') },
  { label: 'Toggle Mode', action: () => setMode(bodyEl.classList.contains('performance-mode') ? 'fancy' : 'performance') },
  { label: 'Open Discord', action: () => window.open('https://discord.gg/sided', '_blank') }
];
function openPalette() {
  cmdPalette.hidden = false;
  cmdInput.value = '';
  renderCmdList(commands);
  setTimeout(() => cmdInput.focus(), 0);
}
function closePalette() { cmdPalette.hidden = true; }
function renderCmdList(items) {
  cmdList.innerHTML = '';
  items.forEach((c, i) => {
    const li = document.createElement('li');
    li.textContent = c.label;
    li.setAttribute('role','option');
    li.addEventListener('click', () => { c.action(); closePalette(); });
    if (i === 0) li.setAttribute('aria-selected','true');
    cmdList.appendChild(li);
  });
}
cmdInput && cmdInput.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = commands.filter(c => c.label.toLowerCase().includes(q));
  renderCmdList(filtered.length ? filtered : [{label:'No results', action: ()=>{}}]);
});
window.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  // Open with Right Alt only (AltRight), not while typing
  if (!isTyping && e.altKey && e.code === 'AltRight') {
    e.preventDefault();
    openPalette();
  } else if (e.key === 'Escape' && !cmdPalette.hidden) {
    closePalette();
  }
});
cmdPalette && cmdPalette.addEventListener('click', (e) => { if (e.target === cmdPalette) closePalette(); });

/* ===== Mobile: FAB, Long‑press to open palette, Edge‑swipe for sidebar ===== */
const cmdFab = document.getElementById('cmdFab');
if (cmdFab) {
  cmdFab.addEventListener('click', () => { vib(8); openPalette(); });
}

// Long‑press anywhere (except inputs) to open palette on mobile
let lpTimer = null, lpStartX = 0, lpStartY = 0, lpMoved = false;
document.addEventListener('touchstart', (e) => {
  if (!isMobileScreen()) return;
  const t = e.touches[0];
  const target = e.target;
  const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
  if (isInput) return;
  lpStartX = t.clientX; lpStartY = t.clientY; lpMoved = false;
  lpTimer = setTimeout(() => { openPalette(); vib(8); }, 550);
}, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (lpTimer) {
    const t = e.touches[0];
    if (Math.abs(t.clientX - lpStartX) > 12 || Math.abs(t.clientY - lpStartY) > 12) { lpMoved = true; clearTimeout(lpTimer); lpTimer = null; }
  }
}, { passive: true });
document.addEventListener('touchend', () => { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } }, { passive: true });

// Edge‑swipe from right to open, swipe rightwards to close when open
let swStartX = null, swStartY = null, swTracking = false, openingCandidate = false;
document.addEventListener('touchstart', (e) => {
  if (!isMobileScreen()) return;
  const t = e.touches[0];
  swStartX = t.clientX; swStartY = t.clientY; swTracking = true;
  openingCandidate = (swStartX > window.innerWidth - 20) && !mobileSidebar.classList.contains('active');
}, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (!swTracking) return;
  const t = e.touches[0];
  const dx = t.clientX - swStartX; const dy = t.clientY - swStartY;
  if (Math.abs(dy) > 30) { return; }
  if (openingCandidate && dx < -25) { openSidebar(); openingCandidate = false; swTracking = false; }
  if (mobileSidebar.classList.contains('active') && dx > 25) { closeSidebarMenu(); swTracking = false; }
}, { passive: true });
document.addEventListener('touchend', () => { swTracking = false; openingCandidate = false; }, { passive: true });
