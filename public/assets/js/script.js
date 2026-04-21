// BLSF Website - Enhanced Interactions & Animations

document.addEventListener("DOMContentLoaded", () => {
  console.log("BLSF Website Loaded");

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 800);
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ===== CAROUSEL ENHANCEMENTS =====
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel) {
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'carousel-progress';
    heroCarousel.appendChild(progressBar);

    const carouselInstance = new bootstrap.Carousel(heroCarousel, {
      interval: 5000,
      ride: 'carousel',
      touch: true,
      wrap: true,
      keyboard: true
    });

    // Update progress bar
    let progress = 0;
    const interval = 50; // Update every 50ms
    const increment = 100 / (5000 / interval);

    const updateProgress = () => {
      progress += increment;
      if (progress > 100) progress = 0;
      progressBar.style.width = progress + '%';
    };

    const progressInterval = setInterval(updateProgress, interval);

    // Reset progress on slide change
    heroCarousel.addEventListener('slide.bs.carousel', () => {
      progress = 0;
      progressBar.style.width = '0%';
    });

    // Clear interval when carousel pauses (optional)
    heroCarousel.addEventListener('mouseenter', () => clearInterval(progressInterval));
    heroCarousel.addEventListener('mouseleave', () => {
      clearInterval(progressInterval);
      setInterval(updateProgress, interval);
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#0') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ===== CARD TILT EFFECT (3D) =====
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });

  // ===== ANIMATED NUMBER COUNTER =====
  const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  };

  // Intersection Observer for counter animation
  const counterElements = document.querySelectorAll('.counter');
  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => counterObserver.observe(el));

  // ===== PARALLAX EFFECT FOR CTA SECTION =====
  const ctaSection = document.querySelector('section[style*="background-image"]');
  if (ctaSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      ctaSection.style.backgroundPosition = `center ${rate}px`;
    });
  }

  // ===== MAGNETIC BUTTON EFFECT =====
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-outline-light');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0) scale(1)';
    });
  });

  // ===== LAZY LOAD IMAGES WITH FADE-IN =====
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        // If already loaded
        if (img.complete) {
          img.style.opacity = '1';
        }
        
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));

  // ===== FORM INPUT FOCUS EFFECTS =====
  const formInputs = document.querySelectorAll('input, textarea, select');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });

  // ===== REVEAL ELEMENTS ON SCROLL (FALLBACK IF AOS FAILS) =====
  const revealElements = document.querySelectorAll('.card, section');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  console.log('BLSF: All animations initialized');
});
