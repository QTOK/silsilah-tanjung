/**
 * Silsilah Kaum Suku Tanjung - Padang Limau
 * Interactive Family Tree Script
 */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // TOGGLE CHILDREN FUNCTION
    // ==========================================
    window.toggleChildren = function(id) {
        const container = document.getElementById('children-' + id);
        const parentCard = container?.previousElementSibling || container?.parentElement?.previousElementSibling;

        if (!container) return;

        const isOpen = container.classList.contains('open');

        if (isOpen) {
            container.classList.remove('open');

            // Also close all nested children
            const nested = container.querySelectorAll('.sub-children.open');
            nested.forEach(n => n.classList.remove('open'));

            // Remove expanded class from parent
            const expandable = container.previousElementSibling;
            if (expandable && expandable.classList.contains('expandable')) {
                expandable.classList.remove('expanded');
            }

            // Also check parent-card
            const parentEl = container.closest('.family-branch')?.querySelector('.parent-card');
            if (parentEl && id === 'tiawaik') {
                parentEl.classList.remove('open');
            }

        } else {
            container.classList.add('open');

            // Add expanded class
            const expandable = container.previousElementSibling;
            if (expandable && expandable.classList.contains('expandable')) {
                expandable.classList.add('expanded');
            }

            // Also check parent-card
            const parentEl = container.closest('.family-branch')?.querySelector('.parent-card');
            if (parentEl && id === 'tiawaik') {
                parentEl.classList.add('open');
            }

            // Animate staggered children appearance
            const cards = container.querySelectorAll(':scope .sub-grid .sub-child-card, :scope .children-grid .child-card');
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.08}s`;
            });
        }
    };

    // ==========================================
    // SMOOTH SCROLL TO TOP BUTTON
    // ==========================================
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #c9a84c, #a08030);
        color: #1a0f0a;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(201, 168, 76, 0.4);
        display: none;
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.style.display = 'block';
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(20px)';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // SEARCH FUNCTIONALITY (BONUS)
    // ==========================================
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        max-width: 500px;
        margin: 0 auto 30px;
        position: relative;
    `;

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '🔍 Cari nama dalam silsilah...';
    searchInput.style.cssText = `
        width: 100%;
        padding: 15px 20px;
        border: 2px solid #4a3a2a;
        border-radius: 50px;
        background: rgba(30, 22, 32, 0.8);
        color: #e8e0d4;
        font-size: 1rem;
        font-family: 'Poppins', sans-serif;
        outline: none;
        transition: all 0.3s ease;
    `;

    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#c9a84c';
        this.style.boxShadow = '0 0 20px rgba(201, 168, 76, 0.2)';
    });

    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#4a3a2a';
        this.style.boxShadow = 'none';
    });

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.child-card, .sub-child-card');

        allCards.forEach(card => {
            const name = card.querySelector('h4, h5')?.textContent.toLowerCase() || '';

            if (query === '') {
                card.style.border = '';
                card.style.boxShadow = '';
                card.style.background = '';
                return;
            }

            if (name.includes(query)) {
                card.style.border = '2px solid #c9a84c';
                card.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.4)';
                card.style.background = 'linear-gradient(145deg, #2d2030, #352838)';
            } else {
                card.style.border = '';
                card.style.boxShadow = '';
                card.style.background = '';
            }
        });

        // Auto-expand parents if child matches
        if (query !== '') {
            allCards.forEach(card => {
                const name = card.querySelector('h4, h5')?.textContent.toLowerCase() || '';
                if (name.includes(query)) {
                    // Find and open all parent containers
                    let parent = card.closest('.sub-children');
                    while (parent) {
                        parent.classList.add('open');
                        parent = parent.parentElement?.closest('.sub-children');
                    }
                }
            });
        }
    });

    searchContainer.appendChild(searchInput);

    // Insert search after header
    const mainContainer = document.querySelector('.main-container');
    mainContainer.insertBefore(searchContainer, mainContainer.firstChild);

    // ==========================================
    // TOOLTIP ON HOVER
    // ==========================================
    const allNames = document.querySelectorAll('.child-card, .sub-child-card, .parent-card');

    allNames.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ==========================================
    // COLLAPSE ALL / EXPAND ALL BUTTONS
    // ==========================================
    const controlBar = document.createElement('div');
    controlBar.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    `;

    const btnExpandAll = createButton('📂 Buka Semua', () => {
        document.querySelectorAll('.children-container, .sub-children').forEach(el => {
            el.classList.add('open');
        });
        document.querySelectorAll('.expandable').forEach(el => {
            el.classList.add('expanded');
        });
        document.querySelectorAll('.parent-card').forEach(el => {
            el.classList.add('open');
        });
    });

    const btnCollapseAll = createButton('📁 Tutup Semua', () => {
        document.querySelectorAll('.children-container, .sub-children').forEach(el => {
            el.classList.remove('open');
        });
        document.querySelectorAll('.expandable').forEach(el => {
            el.classList.remove('expanded');
        });
        document.querySelectorAll('.parent-card').forEach(el => {
            el.classList.remove('open');
        });
    });

    controlBar.appendChild(btnExpandAll);
    controlBar.appendChild(btnCollapseAll);

    const searchContainer2 = document.querySelector('.search-container');
    searchContainer2.after(controlBar);

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 10px 25px;
            border: 1px solid #4a3a2a;
            border-radius: 25px;
            background: rgba(30, 22, 32, 0.6);
            color: #c9a84c;
            font-family: 'Poppins', sans-serif;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        btn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(201, 168, 76, 0.2)';
            this.style.borderColor = '#c9a84c';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(30, 22, 32, 0.6)';
            this.style.borderColor = '#4a3a2a';
        });

        btn.addEventListener('click', onClick);
        return btn;
    }

    // ==========================================
    // STATISTICS COUNTER
    // ==========================================
    const statsBar = document.createElement('div');
    statsBar.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 30px;
        margin-bottom: 30px;
        flex-wrap: wrap;
        padding: 20px;
        background: rgba(30, 22, 32, 0.5);
        border-radius: 15px;
        border: 1px solid #2d1810;
    `;

    const totalNames = document.querySelectorAll('.child-card, .sub-child-card, .parent-card').length;
    const totalBranches = document.querySelectorAll('.expandable').length;

    statsBar.innerHTML = `
        <div style="text-align:center;">
            <div style="font-size:1.8rem;color:#c9a84c;font-family:'Playfair Display',serif;">${totalNames}</div>
            <div style="font-size:0.8rem;color:#8a7a6a;">Total Nama</div>
        </div>
        <div style="text-align:center;">
            <div style="font-size:1.8rem;color:#c9a84c;font-family:'Playfair Display',serif;">${totalBranches}</div>
            <div style="font-size:0.8rem;color:#8a7a6a;">Cabang Keturunan</div>
        </div>
        <div style="text-align:center;">
            <div style="font-size:1.8rem;color:#c9a84c;font-family:'Playfair Display',serif;">10+</div>
            <div style="font-size:0.8rem;color:#8a7a6a;">Generasi</div>
        </div>
    `;

    searchContainer2.after(statsBar);

    // ==========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.generation').forEach(gen => {
        gen.style.opacity = '0';
        gen.style.transform = 'translateY(30px)';
        gen.style.transition = 'all 0.6s ease';
        observer.observe(gen);
    });

    console.log('🌳 Silsilah Kaum Suku Tanjung - Loaded Successfully');
});
// ==========================================
// MUSIC AUTOPLAY & CONTROL
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');

// Set volume awal (30% agar tidak terlalu keras)
bgMusic.volume = 0.3;

// Coba autoplay saat halaman dimuat
window.addEventListener('load', () => {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay berhasil
            musicIcon.textContent = '⏸';
            musicToggle.classList.add('playing');
            musicToggle.title = 'Klik untuk pause musik';
        }).catch(() => {
            // Autoplay diblokir browser (kebijakan standar)
            console.log('Autoplay dicegah browser. Menunggu interaksi pengguna.');
            musicIcon.textContent = '▶';
            musicToggle.classList.remove('playing');
            musicToggle.title = 'Klik untuk memutar musik';
        });
    }
});

// Toggle Play/Pause saat tombol diklik
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicIcon.textContent = '⏸';
        musicToggle.classList.add('playing');
        musicToggle.title = 'Klik untuk pause musik';
    } else {
        bgMusic.pause();
        musicIcon.textContent = '▶';
        musicToggle.classList.remove('playing');
        musicToggle.title = 'Klik untuk play musik';
    }
});

// Hentikan musik saat tab tidak aktif (hemat resource)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        bgMusic.pause();
    } else if (!bgMusic.paused) {
        bgMusic.play();
    }
});