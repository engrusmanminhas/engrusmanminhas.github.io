/* ===========================================
   MUHAMMAD USMAN | PORTFOLIO SCRIPT
   =========================================== */

// 1. Auto-update footer year
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when a link is clicked (mobile UX)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// 3. Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(10, 37, 64, 0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// 4. Contact form handler (works with Formspree)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const action = contactForm.getAttribute('action');

  // If you haven't set up Formspree yet, show a fallback message
  if (action.includes('YOUR_FORM_ID')) {
    formNote.textContent = 'Form not configured yet. Please email directly.';
    formNote.className = 'form-note error';
    return;
  }

  formNote.textContent = 'Sending...';
  formNote.className = 'form-note';

  try {
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formNote.textContent = '✓ Message sent successfully. I will respond within 24 hours.';
      formNote.className = 'form-note success';
      contactForm.reset();
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    formNote.textContent = '✗ Could not send. Please email directly.';
    formNote.className = 'form-note error';
  }
});

// 5. Reveal sections on scroll (fade-in animation)
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(30px)';
  section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(section);
});
