const heroVideo = document.querySelector("#hero-video");
const videoToggle = document.querySelector("#video-toggle");
const contactMessageForm = document.querySelector("#contact-message-form");
const preloader = document.querySelector("#preloader");

if (preloader) {
  preloader.hidden = false;

  const hidePreloader = () => {
    if (preloader.classList.contains("is-hidden")) return;

    preloader.classList.add("is-hidden");
    window.setTimeout(() => {
      preloader.hidden = true;
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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealTargets = document.querySelectorAll(
  ".hero .brand, .hero__content, .services__header, .service-card, " +
    ".about__copy, .about__emblem, .projects__header, .project-card, " +
    ".contact__content, .contact__image-wrap",
);

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  revealTargets.forEach((target) => {
    target.classList.add("scroll-reveal");
    revealObserver.observe(target);
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
