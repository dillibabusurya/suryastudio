/**
 * SURYA STUDIO - Premium Photography Studio Website
 * Digital Video & HD 4K Video • Est. 2010
 * Interactive Features, Gallery Lightbox, Hero Slider & Booking System
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. PRELOADER DISMISSAL
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const dismissPreloader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    }
  };

  // Dismiss on window load or safe fallback timeout
  window.addEventListener('load', dismissPreloader);
  setTimeout(dismissPreloader, 1800);


  /* --------------------------------------------------------------------------
     2. STICKY HEADER & SCROLL BEHAVIOR
     -------------------------------------------------------------------------- */
  const mainHeader = document.getElementById('mainHeader');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header styling on scroll
    if (scrollPos > 60) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollPos > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
  }, { passive: true });

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* --------------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    mobileDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    mobileDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', openDrawer);
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeDrawer);
  }

  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });


  /* --------------------------------------------------------------------------
     4. HERO BACKGROUND SLIDER
     -------------------------------------------------------------------------- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('#heroDots .dot');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  let currentSlide = 0;
  let slideInterval = null;

  const showSlide = (index) => {
    if (!heroSlides.length) return;
    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === index);
    });
    heroDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
    currentSlide = index;
  };

  const nextSlide = () => {
    const nextIdx = (currentSlide + 1) % heroSlides.length;
    showSlide(nextIdx);
  };

  const prevSlide = () => {
    const prevIdx = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(prevIdx);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5500);
  };

  const stopAutoSlide = () => {
    if (slideInterval) clearInterval(slideInterval);
  };

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIdx = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      showSlide(targetIdx);
      startAutoSlide();
    });
  });

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();


  /* --------------------------------------------------------------------------
     5. ACTIVE NAV LINK ON SCROLL
     -------------------------------------------------------------------------- */
  const navSections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollY = window.pageYOffset + 120;

    navSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  }


  /* --------------------------------------------------------------------------
     6. STAT NUMBER COUNTERS
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.hl-number[data-count]');
  let counted = false;

  const countUp = () => {
    if (counted) return;
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const duration = 1600;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        counter.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    });
    counted = true;
  };

  const statStrip = document.querySelector('.hero-highlights-strip');
  if (statStrip) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        countUp();
      }
    }, { threshold: 0.3 });
    observer.observe(statStrip);
  }


  /* --------------------------------------------------------------------------
     7. PHOTO GALLERY FILTERING
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const filterValue = e.currentTarget.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category') || '';
        if (filterValue === 'all' || itemCategories.split(' ').includes(filterValue)) {
          item.classList.remove('hide');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });


  /* --------------------------------------------------------------------------
     8. IMAGE LIGHTBOX FUNCTIONALITY
     -------------------------------------------------------------------------- */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  // Collect all lightbox triggers across gallery and sample showcase
  let lightboxTriggers = [];
  let currentLightboxIdx = 0;

  const refreshLightboxTriggers = () => {
    // Only query visible triggers
    lightboxTriggers = Array.from(document.querySelectorAll('.lightbox-trigger-btn')).filter(btn => {
      const parentItem = btn.closest('.gallery-item');
      return !parentItem || !parentItem.classList.contains('hide');
    });
  };

  const openLightbox = (index) => {
    refreshLightboxTriggers();
    if (index < 0 || index >= lightboxTriggers.length) return;

    currentLightboxIdx = index;
    const btn = lightboxTriggers[index];
    const imgSrc = btn.getAttribute('data-img');
    const title = btn.getAttribute('data-title') || 'Surya Studio Photograph';
    const category = btn.getAttribute('data-category') || 'Photography';

    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;
      lightboxCat.textContent = category;
      lightboxCounter.textContent = `${currentLightboxIdx + 1} of ${lightboxTriggers.length}`;
      lightboxImg.style.opacity = '1';
    }, 150);

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const nextLightboxImg = () => {
    refreshLightboxTriggers();
    const nextIdx = (currentLightboxIdx + 1) % lightboxTriggers.length;
    openLightbox(nextIdx);
  };

  const prevLightboxImg = () => {
    refreshLightboxTriggers();
    const prevIdx = (currentLightboxIdx - 1 + lightboxTriggers.length) % lightboxTriggers.length;
    openLightbox(prevIdx);
  };

  // Event Listeners for Lightbox
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger-btn');
    if (trigger) {
      e.preventDefault();
      refreshLightboxTriggers();
      const idx = lightboxTriggers.indexOf(trigger);
      openLightbox(idx >= 0 ? idx : 0);
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImg);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImg);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImg();
    if (e.key === 'ArrowLeft') prevLightboxImg();
  });


  /* --------------------------------------------------------------------------
     9. SERVICE CARD BOOKING BUTTONS (AUTO-FILL FORM)
     -------------------------------------------------------------------------- */
  const serviceBookButtons = document.querySelectorAll('.btn-service-book, [data-service]');
  const serviceSelect = document.getElementById('userService');

  serviceBookButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && serviceSelect) {
        // Find matching option in select
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) ||
              serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
        // Visual indicator that service was chosen
        serviceSelect.style.borderColor = 'var(--gold-primary)';
        setTimeout(() => {
          serviceSelect.style.borderColor = '';
        }, 2000);
      }
    });
  });


  /* --------------------------------------------------------------------------
     10. CONTACT FORM VALIDATION & ENQUIRY DISPATCH
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const phoneInput = document.getElementById('userPhone');
  const dateInput = document.getElementById('eventDate');
  const messageInput = document.getElementById('userMessage');
  const formStatusMsg = document.getElementById('formStatusMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset error messages
      document.querySelectorAll('.field-error').forEach(el => el.textContent = '');

      // Name validation
      if (!nameInput.value.trim()) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        isValid = false;
      }

      // Phone validation (10 digits)
      const phoneVal = phoneInput.value.replace(/[^0-9]/g, '');
      if (phoneVal.length < 10) {
        document.getElementById('phoneError').textContent = 'Please enter a valid 10-digit mobile number.';
        isValid = false;
      }

      // Service validation
      if (!serviceSelect.value) {
        document.getElementById('serviceError').textContent = 'Please select a required service.';
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim()) {
        document.getElementById('messageError').textContent = 'Please include details of your event or requirements.';
        isValid = false;
      }

      if (!isValid) {
        showToast('Please correct the highlighted fields.', 'error');
        return;
      }

      // Format WhatsApp Message
      const chosenService = serviceSelect.value;
      const clientName = nameInput.value.trim();
      const clientPhone = phoneVal;
      const eventDate = dateInput.value ? dateInput.value : 'Not specified / Flexible';
      const userNotes = messageInput.value.trim();

      const waText = encodeURIComponent(
        `*New Enquiry - SURYA STUDIO*\n` +
        `• *Client Name:* ${clientName}\n` +
        `• *Mobile:* ${clientPhone}\n` +
        `• *Service Required:* ${chosenService}\n` +
        `• *Event Date:* ${eventDate}\n` +
        `• *Details:* ${userNotes}\n\n` +
        `_Sent via Surya Studio Website_`
      );

      const waUrl = `https://wa.me/919629009325?text=${waText}`;

      // Show success feedback
      formStatusMsg.className = 'form-status-msg success';
      formStatusMsg.innerHTML = `
        <strong><i class="fa-solid fa-circle-check"></i> Thank You, ${clientName}!</strong><br>
        Your enquiry for <em>${chosenService}</em> has been registered.
        <div style="margin-top: 10px;">
          <a href="${waUrl}" target="_blank" class="btn btn-whatsapp btn-sm" style="display: inline-flex;">
            <i class="fa-brands fa-whatsapp"></i> Click to Send Instant WhatsApp to Studio (9629009325)
          </a>
        </div>
      `;
      formStatusMsg.style.display = 'block';

      showToast('Enquiry received! Opening WhatsApp message option...', 'success');

      // Also automatically offer to open WhatsApp after brief delay
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1200);

      contactForm.reset();
    });
  }


  /* --------------------------------------------------------------------------
     11. TOAST NOTIFICATION UTILITY
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-bell');
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }


  /* --------------------------------------------------------------------------
     12. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

});

