document.addEventListener('DOMContentLoaded', () => {
  // Update year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // INTRO ANIMATION SEQUENCE
  const introLoader = document.getElementById('introLoader');
  const transitionOverlay = document.getElementById('transitionOverlay');
  const siteWrapper = document.getElementById('siteWrapper');

  if (introLoader && transitionOverlay && siteWrapper) {
    // After intro text animation completes
    setTimeout(() => {
      // Fade out intro loader
      introLoader.style.transition = 'opacity 0.5s ease';
      introLoader.style.opacity = '0';

      // Show green transition overlay
      setTimeout(() => {
        transitionOverlay.classList.add('active');
        introLoader.style.display = 'none';

        // Show site content behind
        siteWrapper.classList.add('visible');

        // Fade out transition overlay
        setTimeout(() => {
          transitionOverlay.style.transition = 'opacity 0.6s ease';
          transitionOverlay.style.opacity = '0';

          setTimeout(() => {
            transitionOverlay.style.display = 'none';
            document.body.style.overflow = '';
          }, 600);
        }, 800);
      }, 300);
    }, 2800);

    // Prevent scroll during intro
    document.body.style.overflow = 'hidden';
  }

  // HEADER SCROLL
  const header = document.getElementById('header');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // MOBILE MENU
  const trigger = document.querySelector('.nav-trigger');
  const nav = document.getElementById('primaryNav');
  
  if (trigger && nav) {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.classList.toggle('active');
      nav.classList.toggle('active');
      trigger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        trigger.classList.remove('active');
        nav.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('active') && 
          !nav.contains(e.target) && 
          !trigger.contains(e.target)) {
        trigger.classList.remove('active');
        nav.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // SCROLL REVEAL
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // COUNTER ANIMATION
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric-value[data-target]').forEach(el => counterObserver.observe(el));

  // SMOOTH SCROLL for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form validation enhancement
  const form = document.querySelector('.contact-form-block form');
  if (form) {
    form.addEventListener('submit', function(e) {
      const inputs = this.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--accent)';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 2000);
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        alert('Mohon lengkapi semua field yang diperlukan.');
      }
    });
  }

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Close mobile menu on resize to desktop
      if (window.innerWidth > 768 && nav && nav.classList.contains('active')) {
        trigger.classList.remove('active');
        nav.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, 250);
  });
});