document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const heroGlassCard = document.getElementById("heroGlassCard");
    const scrollPrompt = document.querySelector(".scroll-prompt-initial");
    const heroOverlay = document.getElementById("hero-overlay");
    const scrollTrack = document.querySelector(".hero-scroll-track");

    // Cached measurements — avoid costly layout reads on every scroll frame
    let vh = window.innerHeight;
    let heroTrackHeight = scrollTrack ? scrollTrack.offsetHeight : 0;
    let heroThreshold = scrollTrack ? (heroTrackHeight - 100) : vh;
    let maxTrackScroll = Math.max(1, heroTrackHeight - vh);
    let enterDistance = vh * 0.65;
    let exitStart = maxTrackScroll * 0.65;

    function measure() {
        vh = window.innerHeight;
        heroTrackHeight = scrollTrack ? scrollTrack.offsetHeight : 0;
        heroThreshold = scrollTrack ? (heroTrackHeight - 100) : vh;
        maxTrackScroll = Math.max(1, heroTrackHeight - vh);
        enterDistance = vh * 0.65;
        exitStart = maxTrackScroll * 0.65;
    }

    // Scroll handler for sticky navbar and scroll-triggered hero transition
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Sticky transparent navbar over content sections
        if (scrollTop >= heroThreshold) {
            if (!navbar.classList.contains("scrolled")) navbar.classList.add("scrolled");
        } else if (navbar.classList.contains("scrolled")) {
            navbar.classList.remove("scrolled");
        }

        // 2. Initial scroll indicator fades out at the very top only
        if (scrollPrompt && scrollTop <= 90) {
            const cueOpacity = Math.max(0, 1 - scrollTop / 75);
            scrollPrompt.style.opacity = cueOpacity.toFixed(2);
            scrollPrompt.style.pointerEvents = cueOpacity > 0.1 ? "auto" : "none";
        }

        // 3. Scroll-triggered hero card transition over the pinned image
        if (heroGlassCard && scrollTrack) {
            if (scrollTop <= 15) {
                heroGlassCard.style.opacity = "0";
                heroGlassCard.style.transform = "translateY(140px)";
                heroGlassCard.style.pointerEvents = "none";
                if (heroOverlay) heroOverlay.style.opacity = "0";
            } else if (scrollTop < exitStart) {
                const enterProgress = Math.min(1, (scrollTop - 15) / enterDistance);
                const ease = 1 - Math.pow(1 - enterProgress, 2.5);
                heroGlassCard.style.opacity = ease.toFixed(3);
                heroGlassCard.style.transform = `translateY(${((1 - ease) * 140).toFixed(1)}px)`;
                heroGlassCard.style.pointerEvents = enterProgress > 0.7 ? "auto" : "none";
                if (heroOverlay) heroOverlay.style.opacity = (ease * 0.45).toFixed(3);
            } else {
                const exitProgress = Math.min(1, (scrollTop - exitStart) / (maxTrackScroll - exitStart));
                const exitOpacity = Math.max(0, 1 - exitProgress);
                heroGlassCard.style.opacity = exitOpacity.toFixed(3);
                heroGlassCard.style.transform = `translateY(${(-exitProgress * 50).toFixed(1)}px)`;
                heroGlassCard.style.pointerEvents = exitOpacity > 0.5 ? "auto" : "none";
                if (heroOverlay) heroOverlay.style.opacity = (exitOpacity * 0.45).toFixed(3);
            }
        }
    }

    // rAF-throttled scroll listener keeps everything at 60fps
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => { handleScroll(); ticking = false; });
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); onScroll(); });
    measure();
    handleScroll();

    // ===== GSAP ScrollTrigger Stacked Panels =====
    // Each content panel pins in place while the next one scrolls up and overrides it.
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        const panels = gsap.utils.toArray(".stack-panel");
        panels.forEach((panel, i) => gsap.set(panel, { zIndex: i + 1 }));

        // Desktop/tablet: pin each panel so the next one scrolls up and overrides it.
        // Mobile: panels are taller than the viewport (cards stack), so pinning would
        // keep the lower cards permanently off-screen — let them flow normally there.
        const mm = gsap.matchMedia();

        mm.add("(min-width: 769px)", () => {
            panels.forEach((panel, i) => {
                // Last panel is not pinned: the footer simply follows it.
                if (i === panels.length - 1) return;

                ScrollTrigger.create({
                    trigger: panel,
                    start: "top top",
                    end: "bottom top",
                    pin: true,
                    pinSpacing: false,
                    anticipatePin: 1
                });

                // Fade the covered panel out as the next one rises over it, so only the
                // fixed background image shows through the next panel's glass — the
                // previous section's content never bleeds through.
                gsap.to(panel, {
                    opacity: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: panels[i + 1],
                        start: "top bottom",
                        end: "top top",
                        scrub: true
                    }
                });
            });
        });

        // Recalculate once everything (fonts/images) has settled.
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
        window.addEventListener("load", () => ScrollTrigger.refresh());
    }

    // ===== Lenis smooth momentum scrolling =====
    let lenis = null;
    if (window.Lenis && window.gsap && window.ScrollTrigger) {
        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5
        });

        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    // Scroll Reveal Animations for Content Sections
    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".service-card, .section-header, .about-text, .about-visual, .cta-banner").forEach(el => {
        el.classList.add("reveal-element");
        revealObserver.observe(el);
    });

    // Smooth scrolling for internal anchor links and buttons
    function scrollToTarget(target) {
        if (!target) return;
        if (lenis) {
            lenis.scrollTo(target, { offset: 0, duration: 1.2 });
        } else {
            target.scrollIntoView({ behavior: "smooth" });
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href === "#" || !href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                scrollToTarget(target);
            }
        });
    });

    document.querySelectorAll("[data-scroll]").forEach((el) => {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            scrollToTarget(document.querySelector(this.getAttribute("data-scroll")));
        });
    });
});
