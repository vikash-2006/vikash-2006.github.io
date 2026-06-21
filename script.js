// ============================================================
// VIKASH KUMAWAT — PORTFOLIO INTERACTIONS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------------------------------------
       0. THEME — light default, dark toggle, persisted
    --------------------------------------------------------- */
    const root = document.body;
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("vk-theme");
    if (savedTheme) root.setAttribute("data-theme", savedTheme);

    themeToggle.addEventListener("click", () => {
        const current = root.getAttribute("data-theme") || "light";
        const next = current === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        localStorage.setItem("vk-theme", next);
    });

    /* ---------------------------------------------------------
       1. LOADER — guaranteed to hide, never blocks on external
          resources (fonts/CDN) which can hang on file:// or
          slow connections.
    --------------------------------------------------------- */
    const loader = document.getElementById("loader");
    let heroPlayed = false;

    function revealSite() {
        if (loader.classList.contains("hidden")) return;
        loader.classList.add("hidden");
        if (!heroPlayed) {
            heroPlayed = true;
            playHeroEntrance();
        }
    }

    // Primary: hide shortly after DOM is ready (loader is just a
    // branding moment, not a real asset-wait).
    setTimeout(revealSite, 900);

    // Absolute safety net — fires no matter what, even if something
    // above throws or a resource hangs.
    setTimeout(revealSite, 2500);

    /* ---------------------------------------------------------
       2. HERO ENTRANCE ANIMATION
    --------------------------------------------------------- */
    function playHeroEntrance() {
        const items = document.querySelectorAll("[data-hero-item]");
        items.forEach((el, i) => {
            el.style.opacity = "0";
            el.style.transform = "translateY(24px)";
            el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                });
            });
        });
        animateCounters();
    }
    /* ---------------------------------------------------------
       3. TYPED ROLE ROTATOR
    --------------------------------------------------------- */
    const roles = ["Data Science Intern", "Python Developer", "Backend Engineer", "Data Analyst"];
    const typedEl = document.getElementById("typedRole");
    let roleIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
        const word = roles[roleIdx];
        if (!deleting) {
            charIdx++;
            typedEl.textContent = word.substring(0, charIdx);
            if (charIdx >= word.length) {
                deleting = true;
                setTimeout(typeLoop, 1800);
                return;
            }
        } else {
            charIdx--;
            typedEl.textContent = word.substring(0, charIdx);
            if (charIdx <= 0) {
                deleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                setTimeout(typeLoop, 400);
                return;
            }
        }
        setTimeout(typeLoop, deleting ? 35 : 65);
    }
    setTimeout(typeLoop, 2600);

    /* ---------------------------------------------------------
       4. NAV — scroll state, active link, mobile menu
    --------------------------------------------------------- */
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
        backToTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
        const icon = hamburger.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("mobile-open");
            const icon = hamburger.querySelector("i");
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-times");
        });
    });

    const sections = document.querySelectorAll(".section-scroll");
    const navItems = document.querySelectorAll(".nav-link");
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(item => {
                    item.classList.remove("active");
                    if (item.getAttribute("href").substring(1) === entry.target.id) {
                        item.classList.add("active");
                    }
                });
            }
        });
    }, { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 });
    sections.forEach(s => navObserver.observe(s));

    /* ---------------------------------------------------------
       5. BACK TO TOP
    --------------------------------------------------------- */
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    /* ---------------------------------------------------------
       6. SCROLL REVEAL
    --------------------------------------------------------- */
    const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ---------------------------------------------------------
       7. ANIMATED COUNTERS (hero stats)
    --------------------------------------------------------- */
    let countersPlayed = false;
    function animateCounters() {
        if (countersPlayed) return;
        countersPlayed = true;
        document.querySelectorAll("[data-count]").forEach(el => {
            const target = parseInt(el.getAttribute("data-count"), 10);
            const duration = 1400;
            const start = performance.now();
            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target.toLocaleString();
            }
            requestAnimationFrame(step);
        });
    }

    /* ---------------------------------------------------------
       8. SKILL TABS + ANIMATED BARS
    --------------------------------------------------------- */
    const skillTabs = document.querySelectorAll(".skills-tab");
    const skillPanels = document.querySelectorAll(".skills-panel");

    function fillBars(panel) {
        panel.querySelectorAll(".skill-bar-fill").forEach(bar => {
            const w = bar.getAttribute("data-width");
            requestAnimationFrame(() => { bar.style.width = w + "%"; });
        });
    }

    skillTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            skillTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const target = tab.getAttribute("data-tab");
            skillPanels.forEach(p => {
                p.classList.toggle("active", p.getAttribute("data-panel") === target);
                if (p.getAttribute("data-panel") === target) fillBars(p);
            });
        });
    });

    // Trigger bars when skills section scrolls into view
    const skillsSection = document.getElementById("skills");
    const skillsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fillBars(document.querySelector(".skills-panel.active"));
                obs.disconnect();
            }
        });
    }, { threshold: 0.3 });
    if (skillsSection) skillsObserver.observe(skillsSection);

    /* ---------------------------------------------------------
       9. PROJECT FILTERS
    --------------------------------------------------------- */
    const filterBtns = document.querySelectorAll(".pf-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");
            projectCards.forEach(card => {
                const cats = card.getAttribute("data-cat");
                const match = filter === "all" || cats.includes(filter);
                if (match) {
                    card.style.display = "flex";
                    requestAnimationFrame(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0) scale(1)";
                    });
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(10px) scale(0.97)";
                    setTimeout(() => { card.style.display = "none"; }, 300);
                }
            });
        });
    });
    projectCards.forEach(card => {
        card.style.transition = "opacity 0.35s ease, transform 0.35s ease, box-shadow 0.45s cubic-bezier(0.4,0,0.2,1), border-color 0.45s";
    });

    /* ---------------------------------------------------------
       10. CONTACT FORM VALIDATION
    --------------------------------------------------------- */
    const form = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    const fields = {
        name: document.getElementById("cf-name"),
        email: document.getElementById("cf-email"),
        subject: document.getElementById("cf-subject"),
        message: document.getElementById("cf-message")
    };

    function validateField(field, type) {
        const group = field.closest(".form-group");
        let valid = true;
        const value = field.value.trim();

        if (type === "email") {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else if (type === "message") {
            valid = value.length >= 10;
        } else {
            valid = value.length > 0;
        }

        group.classList.toggle("invalid", !valid);
        group.querySelector(".form-error").classList.toggle("show", !valid);
        return valid;
    }

    Object.entries(fields).forEach(([key, field]) => {
        field.addEventListener("blur", () => validateField(field, key));
        field.addEventListener("input", () => {
            if (field.closest(".form-group").classList.contains("invalid")) {
                validateField(field, key);
            }
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let allValid = true;
        Object.entries(fields).forEach(([key, field]) => {
            if (!validateField(field, key)) allValid = false;
        });

        if (!allValid) {
            formStatus.classList.remove("show");
            return;
        }

        const subject = encodeURIComponent(fields.subject.value.trim());
        const body = encodeURIComponent(
            `Name: ${fields.name.value.trim()}\nEmail: ${fields.email.value.trim()}\n\n${fields.message.value.trim()}`
        );
        formStatus.classList.add("show");
        window.location.href = `mailto:kumawatvicky2006@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            form.reset();
            formStatus.classList.remove("show");
        }, 4000);
    });

    /* ---------------------------------------------------------
       11. MAGNETIC HOVER for project cards (subtle tilt)
    --------------------------------------------------------- */
    projectCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -4;
            const rotateY = ((x - cx) / cx) * 4;
            card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

});