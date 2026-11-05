const heroVideo = document.querySelector("#hero-video");
const videoToggle = document.querySelector("#video-toggle");
const contactMessageForm = document.querySelector("#contact-message-form");
const preloader = document.querySelector("#preloader");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroContent = document.querySelector(".hero__content");
const heroLead = document.querySelector("[data-hero-lead]");
const heroHeadline = document.querySelector("[data-hero-headline]");
const heroDescription = document.querySelector("[data-hero-description]");
const heroIndicators = document.querySelectorAll(".hero__indicators span");
const revealTargets = document.querySelectorAll(
  "main .section-nav, .hero__video, .brand, .hero__content, " +
    ".services__header, .service-card, .about__copy, .about__emblem, " +
    ".projects__header, .project-card, .contact__content, .contact__image-wrap, " +
  ".site-footer__inner",
);

if (heroVideo) {
  const mobileVideoQuery = window.matchMedia("(max-width: 700px)");
  const updateHeroVideoSource = () => {
    const source = mobileVideoQuery.matches
      ? heroVideo.dataset.mobileSrc
      : heroVideo.dataset.desktopSrc;

    if (source && !heroVideo.src.endsWith(source)) {
      heroVideo.src = source;
      heroVideo.load();
    }
  };

  updateHeroVideoSource();
  mobileVideoQuery.addEventListener("change", updateHeroVideoSource);
}

if (
  heroContent &&
  heroLead &&
  heroHeadline &&
  heroDescription &&
  heroIndicators.length > 0 &&
  !reducedMotion
) {
  const heroSlides = [
    {
      lead: "Ideas into",
      headline: "digital reality.",
      description:
        "We bring thoughtful design and powerful technology together to build digital experiences that move your business forward.",
    },
    {
      lead: "Designing",
      headline: "your next move.",
      description:
        "We turn bold ideas into intuitive digital products that help ambitious businesses grow and stand out.",
    },
    {
      lead: "Technology",
      headline: "built to scale.",
      description:
        "From intelligent automation to resilient cloud systems, we build technology ready for what comes next.",
    },
  ];
  let activeHeroSlide = 0;
  let rotationTimer;
  let transitionTimer;

  const showNextHeroSlide = () => {
    heroContent.classList.add("is-changing");
    window.clearTimeout(transitionTimer);
    transitionTimer = window.setTimeout(() => {
      activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
      const slide = heroSlides[activeHeroSlide];

      heroLead.textContent = slide.lead;
      heroHeadline.textContent = slide.headline;
      heroDescription.textContent = slide.description;
      heroIndicators.forEach((indicator, index) => {
        indicator.classList.toggle("is-active", index === activeHeroSlide);
      });
      heroContent.classList.remove("is-changing");
    }, 350);
  };

  const startHeroRotation = () => {
    if (!rotationTimer && !document.hidden) {
      rotationTimer = window.setInterval(showNextHeroSlide, 5000);
    }
  };

  const stopHeroRotation = () => {
    window.clearInterval(rotationTimer);
    rotationTimer = undefined;
    window.clearTimeout(transitionTimer);
    heroContent.classList.remove("is-changing");
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroRotation();
    } else {
      startHeroRotation();
    }
  });
  startHeroRotation();
}

revealTargets.forEach((target) => target.classList.add("scroll-reveal"));

const revealPage = () => {
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    revealObserver.observe(target);
  });
};

if (preloader) {
  preloader.hidden = false;

  const hidePreloader = () => {
    if (preloader.classList.contains("is-hidden")) return;

    preloader.classList.add("is-hidden");
    window.setTimeout(() => {
      preloader.hidden = true;
      document.body.classList.remove("is-loading");
      revealPage();
    }, 500);
  };

  if (document.readyState === "complete") {
    window.setTimeout(hidePreloader, 350);
  } else {
    window.addEventListener("load", () => window.setTimeout(hidePreloader, 350), {
      once: true,
    });
    window.setTimeout(hidePreloader, 3500);
  }
}

if (contactMessageForm) {
  const messageInput = contactMessageForm.querySelector("#contact-message");

  contactMessageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (!message) {
      messageInput.setCustomValidity("Please enter a message.");
      messageInput.reportValidity();
      return;
    }

    messageInput.setCustomValidity("");
    const subject = encodeURIComponent("Message from TrioInfo website");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:trioinfi@gmail.com?subject=${subject}&body=${body}`;
  });

  contactMessageForm.addEventListener("input", () => {
    contactMessageForm.querySelector("#contact-message").setCustomValidity("");
  });
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo.pause();
}

if (videoToggle) {
  const videoToggleLabel = videoToggle.querySelector(".hero__link-label");

  const updateVideoToggle = () => {
    const isPaused = heroVideo.paused;
    const label = isPaused ? "Play the showreel" : "Pause the showreel";

    videoToggle.setAttribute("aria-pressed", String(isPaused));
    videoToggle.setAttribute("aria-label", `${label} background video`);
    videoToggleLabel.textContent = label;
  };

  heroVideo.addEventListener("play", updateVideoToggle);
  heroVideo.addEventListener("pause", updateVideoToggle);
  updateVideoToggle();

  videoToggle.addEventListener("click", () => {
    if (heroVideo.paused) {
      heroVideo.play().catch((error) => {
        videoToggle.disabled = true;
        videoToggleLabel.textContent = "Video unavailable";
        console.error("Background video playback failed:", error);
      });
      return;
    }

    heroVideo.pause();
  });
}
