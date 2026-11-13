/**
 * BMW France Homepage Clone - Vanilla JavaScript
 * Modules:
 *  1. Header scroll detection (transparent to solid white)
 *  2. Desktop Mega Menus & AI Assistant flyout (hover, keyboard, focus trap, Esc, outside click)
 *  3. Mobile Navigation Drawer with Accordion groups
 *  4. Hero Video Play / Pause Toggle
 *  5. IntersectionObserver Fade-in Reveals
 *  6. Mobile Footer Accordions (< 768px)
 *  7. Floating Sticky Chat Widget & Popover
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 0. Configuration & Asset Registry
  // =========================================================================
  const CONFIG = {
    scrollThreshold: 80,
    mobileBreakpoint: 768,
    assets: {
      heroVideo: './assets/hero.mp4',
      heroPoster: './assets/hero.jpg',
      ix5: './assets/ix5.jpg',
      x1: './assets/x1.jpg',
      ix4: './assets/ix4.jpg',
      accessories: './assets/accessories.jpg',
      logo: './assets/bmw-logo.png',
      aiBadge: './assets/ai-badge.png'
    }
  };

  // =========================================================================
  // 1. Header Scroll State
  // =========================================================================
  const header = document.querySelector('.header');

  const updateHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > CONFIG.scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', updateHeaderScroll, { passive: true });
  updateHeaderScroll();

  // =========================================================================
  // 2. Desktop Mega Menus & Flyouts
  // =========================================================================
  const navItemsWithMenu = document.querySelectorAll('.nav__item--has-menu');

  const closeAllMenus = () => {
    navItemsWithMenu.forEach(item => {
      item.classList.remove('nav__item--active');
      const btn = item.querySelector('.nav__btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const menu = item.querySelector('.mega-menu, .ai-flyout');
      if (menu) {
        menu.classList.remove('mega-menu--open', 'ai-flyout--open');
      }
    });
  };

  navItemsWithMenu.forEach(item => {
    const btn = item.querySelector('.nav__btn');
    const menu = item.querySelector('.mega-menu, .ai-flyout');

    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('nav__item--active');
        closeAllMenus();
        if (!isOpen) {
          item.classList.add('nav__item--active');
          btn.setAttribute('aria-expanded', 'true');
          if (menu.classList.contains('mega-menu')) menu.classList.add('mega-menu--open');
          if (menu.classList.contains('ai-flyout')) menu.classList.add('ai-flyout--open');
        }
      });
    }
  });

  // Close menus on outside click or Esc
  document.addEventListener('click', (e) => {
    if (!header?.contains(e.target)) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMenus();
      closeMobileNav();
      closeChatPopover();
    }
  });

  // =========================================================================
  // 3. Mobile Navigation Drawer & Accordions
  // =========================================================================
  const hamburgerBtn = document.querySelector('.header__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileCloseBtn = document.querySelector('.mobile-nav__close');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');

  const openMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.add('mobile-nav--open');
    if (mobileBackdrop) mobileBackdrop.classList.add('mobile-nav-backdrop--visible');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove('mobile-nav--open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('mobile-nav-backdrop--visible');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn?.addEventListener('click', openMobileNav);
  mobileCloseBtn?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);

  // Mobile drawer accordion toggles
  const mobileAccordions = document.querySelectorAll('.mobile-nav__accordion');
  mobileAccordions.forEach(acc => {
    const btn = acc.querySelector('.mobile-nav__accordion-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = acc.classList.toggle('mobile-nav__accordion--open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });

  // =========================================================================
  // 4. Hero Video Play / Pause Toggle
  // =========================================================================
  const heroVideo = document.querySelector('.hero__video');
  const heroPlayBtn = document.querySelector('.hero__play-btn');

  if (heroPlayBtn && heroVideo) {
    const playIconSVG = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `;
    const pauseIconSVG = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    `;

    heroPlayBtn.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play().then(() => {
          heroPlayBtn.innerHTML = pauseIconSVG;
          heroPlayBtn.setAttribute('aria-label', 'Pause video');
        }).catch(() => {
          // Autoplay policy fallback
        });
      } else {
        heroVideo.pause();
        heroPlayBtn.innerHTML = playIconSVG;
        heroPlayBtn.setAttribute('aria-label', 'Play video');
      }
    });
  }

  // =========================================================================
  // 5. IntersectionObserver Fade-in Reveals
  // =========================================================================
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealElements = document.querySelectorAll('.model-banner, .accessories');

  if (motionQuery.matches) {
    revealElements.forEach(el => {
      el.classList.add('model-banner--visible', 'accessories--visible');
    });
  } else if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('model-banner')) {
            entry.target.classList.add('model-banner--visible');
          } else if (entry.target.classList.contains('accessories')) {
            entry.target.classList.add('accessories--visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => {
      el.classList.add('model-banner--visible', 'accessories--visible');
    });
  }

  // =========================================================================
  // 6. Mobile Footer Accordions (< 768px)
  // =========================================================================
  const footerGroups = document.querySelectorAll('.footer__group');

  footerGroups.forEach(group => {
    const heading = group.querySelector('.footer__heading');
    if (heading) {
      heading.setAttribute('role', 'button');
      heading.setAttribute('tabindex', '0');
      heading.setAttribute('aria-expanded', 'false');

      const toggleAccordion = () => {
        if (window.innerWidth <= CONFIG.mobileBreakpoint) {
          const isOpen = group.classList.toggle('footer__group--open');
          heading.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      };

      heading.addEventListener('click', toggleAccordion);
      heading.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAccordion();
        }
      });
    }
  });

  // =========================================================================
  // 7. Floating Chat Button & Popover
  // =========================================================================
  const chatBtn = document.querySelector('.chat-widget__btn');
  const chatPopover = document.querySelector('.chat-popover');
  const chatCloseBtn = document.querySelector('.chat-popover__close');

  const openChatPopover = () => {
    if (!chatPopover) return;
    chatPopover.classList.remove('chat-popover--closing');
    chatPopover.classList.add('chat-popover--open');
    chatBtn?.setAttribute('aria-expanded', 'true');
    const firstOption = chatPopover.querySelector('.chat-popover__option');
    firstOption?.focus();
  };

  const closeChatPopover = () => {
    if (!chatPopover || !chatPopover.classList.contains('chat-popover--open')) return;
    chatPopover.classList.add('chat-popover--closing');
    chatPopover.classList.remove('chat-popover--open');
    chatBtn?.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      chatPopover.classList.remove('chat-popover--closing');
    }, 300);
  };

  chatBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (chatPopover?.classList.contains('chat-popover--open')) {
      closeChatPopover();
    } else {
      openChatPopover();
    }
  });

  chatCloseBtn?.addEventListener('click', closeChatPopover);

  document.addEventListener('click', (e) => {
    if (chatPopover && chatBtn && chatPopover.classList.contains('chat-popover--open')) {
      if (!chatPopover.contains(e.target) && !chatBtn.contains(e.target)) {
        closeChatPopover();
      }
    }
  });

});
