const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

const pages = [
  {
    slug: 'privacy', titleEn: 'Privacy Policy', titleEs: 'Política de Privacidad',
    contentEn: `<p>Aierasu Hub respects your privacy. We use standard analytics and third-party ad networks (like AdSense) which may use cookies to serve ads based on your prior visits.</p><p>You can opt out of personalized advertising by visiting Ads Settings. We do not sell your personal data to third parties.</p>`,
    contentEs: `<p>Aierasu Hub respeta tu privacidad. Utilizamos analíticas estándar y redes de anuncios de terceros (como AdSense) que pueden usar cookies para mostrar anuncios basados en tus visitas anteriores.</p><p>Puedes inhabilitar la publicidad personalizada visitando la Configuración de Anuncios. No vendemos tus datos personales a terceros.</p>`
  },
  {
    slug: 'terms', titleEn: 'Terms of Service', titleEs: 'Términos de Servicio',
    contentEn: `<p>By accessing Aierasu Hub, you agree to these Terms. All prompts and tools are provided "as is" without warranty. You may use our generated content for commercial purposes, but you may not scrape or resell our database directly.</p>`,
    contentEs: `<p>Al acceder a Aierasu Hub, aceptas estos Términos. Todos los prompts y herramientas se proporcionan "tal cual" sin garantía. Puedes utilizar el contenido generado con fines comerciales, pero no puedes raspar ni revender nuestra base de datos directamente.</p>`
  },
  {
    slug: 'about', titleEn: 'About Us', titleEs: 'Sobre Nosotros',
    contentEn: `<h2>Empowering Creators with AI</h2><p>Aierasu Hub is dedicated to providing high-quality, actionable AI prompts and micro-tools to help entrepreneurs, marketers, and creators scale their online businesses efficiently.</p><p>Our mission is to democratize access to advanced AI workflows.</p>`,
    contentEs: `<h2>Empoderando a Creadores con IA</h2><p>Aierasu Hub se dedica a proporcionar prompts de IA y micro-herramientas de alta calidad y procesables para ayudar a emprendedores, especialistas en marketing y creadores a escalar sus negocios en línea de manera eficiente.</p><p>Nuestra misión es democratizar el acceso a flujos de trabajo avanzados de IA.</p>`
  },
  {
    slug: 'contact', titleEn: 'Contact Us', titleEs: 'Contáctanos',
    contentEn: `<p>Have a question or want to suggest a new prompt? Reach out using the form below!</p>
    <form name="contact" method="POST" data-netlify="true" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; max-width: 500px;">
      <input type="text" name="name" placeholder="Your Name" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: white;">
      <input type="email" name="email" placeholder="Your Email" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: white;">
      <textarea name="message" placeholder="Your Message" rows="5" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: white; resize: vertical;"></textarea>
      <button type="submit" style="background: var(--accent); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">Send Message</button>
    </form>`,
    contentEs: `<p>¿Tienes alguna pregunta o deseas sugerir un nuevo prompt? ¡Contáctanos usando el formulario a continuación!</p>
    <form name="contact" method="POST" data-netlify="true" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; max-width: 500px;">
      <input type="text" name="name" placeholder="Tu Nombre" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: white;">
      <input type="email" name="email" placeholder="Tu Correo Electrónico" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: white;">
      <textarea name="message" placeholder="Tu Mensaje" rows="5" required style="padding: 10px; border-radius: 6px; border: 1px solid var(--border); background: rgba(0,0,0,0.2); color: white; resize: vertical;"></textarea>
      <button type="submit" style="background: var(--accent); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; cursor: pointer;">Enviar Mensaje</button>
    </form>`
  }
];

function generateHtml(lang, slug, title, content, prefix) {
  const isEs = lang === 'es';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Aierasu Hub</title>
  <meta name="description" content="${title} for Aierasu Hub.">
  <link rel="stylesheet" href="${prefix}style.css">
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>
</head>
<body style="background: var(--bg); color: var(--text); font-family: var(--font-sans);">
  
  <nav class="nav scrolled" id="nav" style="border-bottom: 1px solid var(--border); background: var(--nav-bg);">
    <div class="container nav__inner">
      <div class="nav__logo">
        <a href="${prefix}${isEs ? 'es/' : ''}index.html" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; font-weight: 700;">
          <span style="font-size: 1.5rem; color: var(--accent);">&larr;</span> aierasu<span style="opacity:0.5">.com</span>
        </a>
      </div>
    </div>
  </nav>

  <!-- Content -->
  <main class="container" style="max-width: 800px; padding: 8rem 1rem 4rem;">
    <h1 style="font-size: 2.5rem; margin-bottom: 2rem;">${title}</h1>
    <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 2.5rem; line-height: 1.7; color: var(--text-muted);">
      ${content}
    </div>
  </main>

  <footer class="container text-center" style="padding: 60px 0 40px; border-top: 1px solid var(--border); margin-top: 40px;">
    <p style="color: var(--text-muted); font-size: 0.9rem;">© 2026 Aierasu. ${isEs ? 'Empoderando creadores digitales en todo el mundo.' : 'Empowering digital creators worldwide.'}</p>
  </footer>
</body>
</html>`;
}

pages.forEach(p => {
  fs.writeFileSync(path.join(ROOT_DIR, `${p.slug}.html`), generateHtml('en', p.slug, p.titleEn, p.contentEn, ''));
  fs.writeFileSync(path.join(ROOT_DIR, 'es', `${p.slug}.html`), generateHtml('es', p.slug, p.titleEs, p.contentEs, '../'));
});

console.log('Legal pages generated.');
