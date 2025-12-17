document.addEventListener('DOMContentLoaded', () => {

    const akariBirthDate = new Date('2021-06-23');
    const rakuBirthDate = new Date('2023-08-31');

    // --- Functions ---

    /**
     * Calculate age in Years and Months
     * @param {Date} birthDate 
     * @returns {string} e.g., "4歳 5ヶ月"
     */
    function calculateAge(birthDate) {
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();

        if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
            years--;
            months += 12;
        }

        // Adjust months if day hasn't passed yet in the current month
        if (today.getDate() < birthDate.getDate()) {
            months--;
            if (months < 0) {
                months = 11;
                // years is already adjusted above if months was < 0 originally
                // but if we just wrapped around from 0 to -1 -> 11, we don't decrement years again
                // Wait, the logic above:
                // if months < 0: years--
                // The standard way:
                // Age = (Today - Birth)
            }
        }

        // Simpler logic for months:
        // Total months difference
        let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        if (today.getDate() < birthDate.getDate()) {
            totalMonths--;
        }

        const finalYears = Math.floor(totalMonths / 12);
        const finalMonths = totalMonths % 12;

        return `${finalYears}歳 ${finalMonths}ヶ月`;
    }

    // --- Execution ---

    // Update Age on Top Page if elements exist
    const akariAgeEl = document.getElementById('age-akari-preview');
    const rakuAgeEl = document.getElementById('age-raku-preview');

    if (akariAgeEl) akariAgeEl.textContent = calculateAge(akariBirthDate);
    if (rakuAgeEl) rakuAgeEl.textContent = calculateAge(rakuBirthDate);

    // Update Age on Profile Pages (we will use specific IDs there)
    const profileAgeEl = document.getElementById('profile-age-display');
    // Determine which profile we are on based on URL or body class? 
    // Or just check specific IDs.
    // Let's assume profile pages will have id="profile-age-akari" or "profile-age-raku"
    const akariProfileAge = document.getElementById('profile-age-akari');
    if (akariProfileAge) akariProfileAge.textContent = calculateAge(akariBirthDate);

    const rakuProfileAge = document.getElementById('profile-age-raku');
    if (rakuProfileAge) rakuProfileAge.textContent = calculateAge(rakuBirthDate);


    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Password Gate (Simple) ---
    // Check if we are on the top page or if we want to protect the whole site.
    // For now, let's just use a simple sessionStorage flag.
    const isAuthenticated = sessionStorage.getItem('family_auth');

    // Uncomment the below block to enable password protection
    /*
    if (!isAuthenticated) {
        const password = prompt("パスワードを入力してください (ヒント: 家族ならわかるはず！)");
        if (password === "family" || password === "1234") { // Change this to something real
            sessionStorage.setItem('family_auth', 'true');
        } else {
            alert("パスワードが違います。");
            document.body.innerHTML = "<div style='text-align:center; padding:50px;'><h1>アクセスできません</h1><p>正しいパスワードを入力して再読み込みしてください。</p></div>";
        }
    }
    */

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    if (lightbox) {
        // Add click event to all images inside .card-grid
        const galleryImages = document.querySelectorAll('.card-grid .card img');

        galleryImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightbox.classList.add('active');
                lightboxImg.src = img.src;
                // Try to get caption from the sibling <p> tag or alt text
                const caption = img.nextElementSibling ? img.nextElementSibling.textContent : img.alt;
                lightboxCaption.textContent = caption;
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        closeBtn.addEventListener('click', closeLightbox);

        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // --- Slideshow Logic ---
    // (Removed as per previous step, ensuring clean up)

    // --- Scroll Reveal Animation ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                entry.target.classList.remove('reveal-hidden');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target all images except those in the marquee
    const imagesToReveal = document.querySelectorAll('img:not(.marquee-track img)');
    imagesToReveal.forEach(img => {
        img.classList.add('reveal-hidden');
        observer.observe(img);
    });
});
