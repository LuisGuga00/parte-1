const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const mediaImages = document.querySelectorAll(".image-slot img, .logo-item img");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

mediaImages.forEach((image) => {
  const container = image.closest(".image-slot, .logo-item");

  const markMissing = () => {
    container?.classList.add("is-missing");
  };

  if (image.complete && image.naturalWidth === 0) {
    markMissing();
  } else {
    image.addEventListener("error", markMissing);
  }
});

const processItems = document.querySelectorAll(".process-item");

function closeProcessItem(item) {
  const content = item.querySelector(".process-content");
  const trigger = item.querySelector(".process-trigger");
  const toggle = item.querySelector(".process-toggle");

  if (!content) return;

  content.style.height = `${content.scrollHeight}px`;
  requestAnimationFrame(() => {
    item.classList.remove("is-open");
    trigger?.setAttribute("aria-expanded", "false");
    if (toggle) toggle.textContent = "+";
    content.style.height = "0px";
  });
}

function openProcessItem(item) {
  const content = item.querySelector(".process-content");
  const trigger = item.querySelector(".process-trigger");
  const toggle = item.querySelector(".process-toggle");

  if (!content) return;

  item.classList.add("is-open");
  trigger?.setAttribute("aria-expanded", "true");
  if (toggle) toggle.innerHTML = "&#8722;";
  content.style.height = "0px";

  requestAnimationFrame(() => {
    content.style.height = `${content.scrollHeight}px`;
  });
}

processItems.forEach((item) => {
  const trigger = item.querySelector(".process-trigger");
  const content = item.querySelector(".process-content");

  if (item.classList.contains("is-open") && content) {
    content.style.height = "auto";
  }

  trigger?.addEventListener("click", () => {
    const willOpen = !item.classList.contains("is-open");

    processItems.forEach((entry) => {
      if (entry !== item && entry.classList.contains("is-open")) {
        closeProcessItem(entry);
      }
    });

    if (willOpen) {
      openProcessItem(item);
    } else {
      closeProcessItem(item);
    }
  });
});

processItems.forEach((item) => {
  const content = item.querySelector(".process-content");

  content?.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "height") return;

    if (item.classList.contains("is-open")) {
      content.style.height = "auto";
    }
  });
});

const testimonialTrack = document.querySelector(".testimonials-track");
const testimonialsShell = document.querySelector(".testimonials-shell");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const realTestimonialCards = document.querySelectorAll('.testimonial-card[data-real="true"]');
const dots = document.querySelectorAll(".dot");
const prevButton = document.querySelector(".testimonial-arrow.prev");
const nextButton = document.querySelector(".testimonial-arrow.next");
let currentSlide = realTestimonialCards.length ? 1 : 0;

function getTestimonialMetrics() {
  if (!testimonialTrack || !testimonialCards.length || !testimonialsShell) return null;

  const firstCard = testimonialCards[0];
  const cardWidth = firstCard.getBoundingClientRect().width;
  const trackStyles = window.getComputedStyle(testimonialTrack);
  const trackGap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "24");
  const trackPaddingLeft = Number.parseFloat(trackStyles.paddingLeft || "0");
  const shellWidth = testimonialsShell.getBoundingClientRect().width;
  const centeredOffset = (shellWidth - cardWidth) / 2;

  return { cardWidth, trackGap, trackPaddingLeft, centeredOffset };
}

function renderTestimonials(useTransition = true) {
  const metrics = getTestimonialMetrics();
  if (!metrics || !testimonialTrack) return;

  testimonialTrack.style.transition = useTransition ? "transform 0.45s ease" : "none";
  const { cardWidth, trackGap, trackPaddingLeft, centeredOffset } = metrics;
  const translateX = (currentSlide * (cardWidth + trackGap)) - centeredOffset + trackPaddingLeft;
  testimonialTrack.style.transform = `translateX(-${translateX}px)`;

  realTestimonialCards.forEach((card, idx) => {
    card.classList.toggle("is-active", idx === currentSlide - 1);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("is-active", idx === currentSlide - 1);
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index + 1;
    renderTestimonials();
  });
});

prevButton?.addEventListener("click", () => {
  currentSlide -= 1;
  renderTestimonials();
});

nextButton?.addEventListener("click", () => {
  currentSlide += 1;
  renderTestimonials();
});

testimonialTrack?.addEventListener("transitionend", () => {
  if (!realTestimonialCards.length) return;

  if (currentSlide === 0) {
    currentSlide = realTestimonialCards.length;
    renderTestimonials(false);
  }

  if (currentSlide === testimonialCards.length - 1) {
    currentSlide = 1;
    renderTestimonials(false);
  }
});

window.addEventListener("resize", () => renderTestimonials(false));

renderTestimonials(false);
