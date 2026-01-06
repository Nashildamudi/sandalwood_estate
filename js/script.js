let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');
const homeSection = document.querySelector('.home');
const homeHeading = document.querySelector('.home .row .content h3');
const mainHomeImage = document.querySelector('.main-home-image');
const sliderOptions = document.querySelectorAll('.image-slider .slider-option');
const themeClasses = Array.from(new Set(Array.from(sliderOptions).map(option => option.dataset.theme ? `theme-${option.dataset.theme}` : null).filter(Boolean)));

menu.onclick = () => {
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
};

window.onscroll = () => {
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
};

// Helper: activate one slider option by index (used for autoplay)
const activateSliderOption = (index) => {
  if (!sliderOptions.length) return;
  const option = sliderOptions[index];
  if (!option) return;

  const { src, theme } = option.dataset;
  const themeClass = theme ? `theme-${theme}` : null;

  if (mainHomeImage && src) {
    mainHomeImage.src = src;
  }

  if (homeSection && themeClass) {
    homeSection.classList.remove(...themeClasses);
    homeSection.classList.add(themeClass);
  }

  // Update active visual state and accessibility
  sliderOptions.forEach(btn => {
    const isActive = btn === option;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

//Auto-rotate the home themes every 4 seconds
if (false) {
  let currentIndex = 0;

  // Start with solid color only (no background image)
  homeSection.classList.add('home-initial-color');

  // Activate first option immediately (for text and theme color)
  activateSliderOption(currentIndex);

  // After 2s, reveal background image for the first slide
  setTimeout(() => {
    homeSection.classList.remove('home-initial-color');
  }, 2000);

  // Then rotate every 2 seconds to the next theme
  setInterval(() => {
    currentIndex = (currentIndex + 1) % sliderOptions.length;
    activateSliderOption(currentIndex);
  }, 2000);
}

var swiper = new Swiper(".review-slider", {
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  loop: true,
  grabCursor: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    768: {
      slidesPerView: 2
    }
  },
});

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Certificates carousel viewer (About page) - supports multiple certificates with variable pages
(() => {
  const modal = document.getElementById('cert-modal');
  if (!modal) return; // only on about page

  const certTitle = document.getElementById('cert-title');
  const certImage = document.getElementById('cert-current-page');
  const prevBtn = modal.querySelector('.prev-btn');
  const nextBtn = modal.querySelector('.next-btn');
  const closeBtn = modal.querySelector('.modal-close');
  const pageIndicatorsContainer = document.getElementById('page-indicators');
  const currentPageNum = document.getElementById('current-page-num');
  const totalPagesNum = document.getElementById('total-pages-num');
  const certButtons = document.querySelectorAll('.cert-doc');

  // Certificate data structure - Using landscape.jpg as placeholder
  // UPDATE THESE PATHS WITH YOUR ACTUAL CERTIFICATE IMAGE FILES LATER
  const certificates = {
    1: {
      name: "At Source Certification - Olam Coffee",
      pages: [
        "image/cir1.png", // Page 1 - Replace with cert1-page1.jpg
        "image/cir2.png", // Page 2 - Replace with cert1-page2.jpg
        "image/cir3.png", // Page 3 - Replace with cert1-page3.jpg
        "image/cir4.png", // Page 4 - Replace with cert1-page4.jpg
      ]
    },
    2: {
      name: "EUDR Compliance Certificate",
      pages: [
        "image/cirt1.png", // Page 1 - Replace with cert2-page1.jpg
        "image/cirt2.png", // Page 2 - Replace with cert2-page2.jpg
        "image/cirt3.png", // Page 3 - Replace with cert2-page3.jpg
        "image/cirt4.png", // Page 4 - Replace with cert2-page4.jpg
      ]
    }
  };

  let currentCertId = null;
  let currentPageIndex = 0;

  // Create page indicator dots
  const createPageIndicators = (totalPages) => {
    pageIndicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.className = 'page-dot';
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      dot.addEventListener('click', () => showPage(i));
      pageIndicatorsContainer.appendChild(dot);
    }
  };

  // Update page indicators
  const updateIndicators = () => {
    const dots = pageIndicatorsContainer.querySelectorAll('.page-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentPageIndex);
    });
  };

  // Show specific page
  const showPage = (pageIndex) => {
    if (!currentCertId || !certificates[currentCertId]) return;

    const cert = certificates[currentCertId];
    const totalPages = cert.pages.length;

    // Wrap around if needed
    if (pageIndex < 0) pageIndex = totalPages - 1;
    if (pageIndex >= totalPages) pageIndex = 0;

    currentPageIndex = pageIndex;

    // Preload image before displaying to prevent flickering
    const img = new Image();
    img.onload = () => {
      certImage.src = cert.pages[currentPageIndex];
    };
    img.onerror = () => {
      certImage.src = cert.pages[currentPageIndex];
    };
    img.src = cert.pages[currentPageIndex];

    // Update UI
    currentPageNum.textContent = currentPageIndex + 1;
    totalPagesNum.textContent = totalPages;
    updateIndicators();
  };

  // Navigate to next page
  const nextPage = () => {
    if (!currentCertId) return;
    showPage(currentPageIndex + 1);
  };

  // Navigate to previous page
  const prevPage = () => {
    if (!currentCertId) return;
    showPage(currentPageIndex - 1);
  };

  // Open certificate modal
  const openCertificate = (certId) => {
    if (!certificates[certId]) return;

    currentCertId = certId;
    currentPageIndex = 0;

    const cert = certificates[certId];
    certTitle.textContent = cert.name;

    createPageIndicators(cert.pages.length);
    showPage(0);

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const downloadCertificateAsPdf = (certId) => {
    const cert = certificates[certId];
    if (!cert) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;

    const resolvedPages = cert.pages.map((src) => {
      try {
        return new URL(src, window.location.href).href;
      } catch (_) {
        return src;
      }
    });

    const pagesHtml = resolvedPages
      .map((src) => `<div class="page"><img src="${src}" alt="${cert.name}"></div>`)
      .join('');

    printWindow.document.open();
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="${window.location.href}">
  <title>${cert.name}</title>
  <style>
    @page { margin: 12mm; }
    body { margin: 0; font-family: Arial, sans-serif; background: #fff; }
    .toolbar { position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid #e5e5e5; padding: 10px 12px; }
    .toolbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; max-width: 980px; margin: 0 auto; }
    .title { font-size: 14px; font-weight: 600; }
    .btn { appearance: none; border: 1px solid #111; background: #111; color: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; }
    .btn[disabled] { opacity: 0.5; cursor: not-allowed; }
    .hint { font-size: 12px; color: #444; }
    .pages { max-width: 980px; margin: 0 auto; }
    .page { page-break-after: always; break-after: page; padding: 0; }
    .page:last-child { page-break-after: auto; break-after: auto; }
    img { width: 100%; height: auto; display: block; }
  </style>
</head>
<body>
  <div class="toolbar">
    <div class="toolbar-inner">
      <div>
        <div class="title">${cert.name}</div>
        <div class="hint">When ready, click “Save as PDF”, then choose “Save as PDF” in the print dialog.</div>
      </div>
      <button class="btn" id="printBtn" disabled>Save as PDF</button>
    </div>
  </div>
  <div class="pages">
    ${pagesHtml}
  </div>
  <script>
    (function(){
      const printBtn = document.getElementById('printBtn');
      if (!printBtn) return;

      const imgs = Array.from(document.images);
      if (!imgs.length) {
        printBtn.disabled = false;
        printBtn.addEventListener('click', () => window.print());
        return;
      }

      let loaded = 0;
      const done = () => {
        loaded++;
        if (loaded >= imgs.length) {
          printBtn.disabled = false;
        }
      };
      imgs.forEach(img => {
        if (img.complete) return done();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });

      printBtn.addEventListener('click', () => window.print());
    })();
  </script>
</body>
</html>`);
    printWindow.document.close();
  };

  // Close modal
  const closeModal = () => {
    modal.setAttribute('aria-hidden', 'true');
    certImage.src = '';
    currentCertId = null;
    currentPageIndex = 0;
    document.body.style.overflow = '';
  };

  // Event listeners
  certButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const certId = btn.dataset.certId;
      if (certId) openCertificate(certId);
    });
  });

  document.querySelectorAll('[data-open-cert-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const certId = el.getAttribute('data-open-cert-id');
      if (certId) openCertificate(certId);
    });
  });

  document.querySelectorAll('[data-download-cert-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const certId = el.getAttribute('data-download-cert-id');
      if (certId) downloadCertificateAsPdf(certId);
    });
  });

  prevBtn && prevBtn.addEventListener('click', prevPage);
  nextBtn && nextBtn.addEventListener('click', nextPage);
  closeBtn && closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
    }
  });
})();

// Count-up numbers for About hero stats
(() => {
  const nums = document.querySelectorAll('[data-countup]');
  if (!nums.length) return;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-countup'), 10);
    const duration = 1200; // ms
    const start = performance.now();
    const startVal = 0;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = val.toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // If already revealed, animate; otherwise, wait for reveal-in
  nums.forEach(el => {
    if (el.classList.contains('reveal-in') || el.closest('.reveal')?.classList.contains('reveal-in')) {
      animateCount(el);
    }
  });

  const onReveal = (e) => {
    if (e.target.matches('.reveal.reveal-in') || e.target.classList?.contains('reveal-in')) {
      e.target.querySelectorAll?.('[data-countup]').forEach(animateCount);
    }
  };

  // Observe class changes to know when 'reveal-in' is applied
  const mo = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && m.attributeName === 'class' && m.target.classList.contains('reveal-in')) {
        m.target.querySelectorAll?.('[data-countup]').forEach(animateCount);
      }
    });
  });
  document.querySelectorAll('.reveal').forEach(node => mo.observe(node, { attributes: true }));
})();

// Gallery lightbox (Gallery page)
(() => {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return; // only on gallery page
  const modalImg = document.getElementById('gallery-modal-img');
  const closeBtn = modal.querySelector('.modal-close');
  const items = document.querySelectorAll('.bento-item, .golden-item');

  const open = (src) => {
    if (!src) return;
    modalImg.src = src;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  };

  items.forEach(btn => btn.addEventListener('click', () => open(btn.dataset.lightbox)));
  closeBtn && closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close(); });
})();

const video = document.getElementById('myVideo');
const wrapper = document.querySelector('.video-wrapper');

if (wrapper && video) {
  wrapper.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}

// Back to Top Button
(() => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  // Show/hide button based on scroll position
  const toggleButton = () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Event listeners
  window.addEventListener('scroll', toggleButton);
  backToTop.addEventListener('click', scrollToTop);

  // Initial check
  toggleButton();
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#home') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const excludedSelectors = ['script','style','noscript','code','pre','svg','input','textarea'];
  const shouldSkipElement = (el) => {
    if (!el) return true;
    if (excludedSelectors.some(sel => el.closest(sel))) return true;
    return false;
  };
  const looksLikeEmailOrUrl = (text) => {
    if (!text) return false;
    const t = text.trim();
    if (t.includes('@')) return true;
    if (/https?:\/\//i.test(t)) return true;
    if (/\bwww\./i.test(t)) return true;
    if (/\b[a-z0-9-]+\.[a-z]{2,}\b/i.test(t)) return true;
    return false;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.match(/[\.,]/)) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
      if (looksLikeEmailOrUrl(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      if (getComputedStyle(parent).visibility === 'hidden' || getComputedStyle(parent).display === 'none') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => { n.nodeValue = n.nodeValue.replace(/[\.,]/g, ''); });
});