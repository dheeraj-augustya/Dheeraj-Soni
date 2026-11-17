/**
 * Main Portfolio Controller — Dheeraj Soni
 * Renders data-driven sections, manages theme, navigation scroll-spy,
 * project filtering & modal, GSAP animations, contact form, and lazy Three.js hero.
 */

/* ==========================================================================
   EDITABLE PORTFOLIO DATA ARRAYS
   Add or update entries here to extend sections without touching layout logic.
   ========================================================================== */

const ROLES = [
  'Full Stack Developer',
  '.NET Web API Engineer',
  'Angular & Next.js Developer',
  'WordPress Expert',
];

const SKILLS = [
  {
    group: 'Backend',
    level: 'Experienced',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><line x1="6" y1="7" x2="6.01" y2="7"/><line x1="6" y1="17" x2="6.01" y2="17"/></svg>`,
    items: [
      { name: 'C#', level: 'Experienced' },
      { name: '.NET', level: 'Experienced' },
      { name: 'ASP.NET Core Web API', level: 'Experienced' },
      { name: 'Entity Framework Core', level: 'Experienced' },
      { name: 'SQL Server', level: 'Experienced' },
      { name: 'REST APIs', level: 'Experienced' },
      { name: 'JWT Authentication', level: 'Experienced' },
      { name: 'Clean Architecture', level: 'Experienced' },
      { name: 'Redis Caching', level: 'Comfortable' },
    ],
  },
  {
    group: 'Frontend',
    level: 'Experienced',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    items: [
      { name: 'Angular', level: 'Experienced' },
      { name: 'Next.js', level: 'Experienced' },
      { name: 'React', level: 'Experienced' },
      { name: 'TypeScript', level: 'Experienced' },
      { name: 'JavaScript', level: 'Experienced' },
      { name: 'HTML5', level: 'Experienced' },
      { name: 'CSS3', level: 'Experienced' },
      { name: 'Tailwind CSS', level: 'Experienced' },
      { name: 'Bootstrap', level: 'Experienced' },
    ],
  },
  {
    group: 'CMS',
    level: 'Experienced',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    items: [
      { name: 'WordPress', level: 'Experienced' },
      { name: 'Custom Themes', level: 'Experienced' },
      { name: 'Plugins', level: 'Experienced' },
      { name: 'WooCommerce', level: 'Experienced' },
      { name: 'Performance & SEO Setup', level: 'Experienced' },
    ],
  },
  {
    group: 'Also',
    level: 'Comfortable',
    icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    items: [
      { name: 'Java (Full Stack)', level: 'Comfortable' },
      { name: 'MERN Stack (MongoDB, Express, React, Node.js)', level: 'Comfortable' },
      { name: 'Django', level: 'Comfortable' },
      { name: 'Git / GitHub', level: 'Experienced' },
      { name: 'Postman', level: 'Experienced' },
      { name: 'Vercel', level: 'Experienced' },
    ],
  },
];

const TECH_MARQUEE = [
  'ASP.NET Core Web API',
  'C#',
  'Angular',
  'Next.js',
  'React',
  'TypeScript',
  'SQL Server',
  'Entity Framework Core',
  'Redis Caching',
  'Clean Architecture',
  'WordPress',
  'WooCommerce',
  'Tailwind CSS',
  'MERN Stack',
  'Django',
];

const PROJECTS = [
  {
    id: 'arivacasa',
    title: 'ArivaCasa',
    company: 'Glidedmatrix Technologies',
    categories: ['dotnet', 'next-angular'],
    coverTheme: 'cover-theme-1',
    coverTag: 'Marketplace · .NET + Next.js + Angular',
    summary: 'A home-services platform connecting service discovery, package selection and booking requests with an operations control center.',
    overview:
      'ArivaCasa connects a customer-facing home-services marketplace with an administrative control center. The supplied customer screens, branded Rapid Help, show service discovery, AC service listings, package selection, a cart and booking-request progress. The Ariva Casa admin screens show operational summaries and payroll management.',
    stack: ['.NET Web API', 'Next.js', 'Angular Admin Panel', 'SQL Server', 'Entity Framework Core'],
    role: 'Full Stack Developer at Glidedmatrix Technologies — engineered backend .NET Web APIs, customer-facing Next.js experiences, and Angular admin panel modules.',
    screenshots: [
      { file: 'home', title: 'Discover home services', caption: 'Customer home screen with location selection, service search and categories such as AC repairs, cleaning and home help.' },
      { file: 'services', title: 'Compare service options', caption: 'AC installation and uninstallation listings with service information, booking options and an adjacent cart.' },
      { file: 'packages', title: 'Choose a package', caption: 'Gas-refill package selection with Essential, Standard and Advanced options, followed by Add to cart or Continue.' },
      { file: 'cart', title: 'Review the cart', caption: 'VRF system service listings alongside item quantities, a subtotal and the Continue action.' },
      { file: 'bookings', title: 'Track booking requests', caption: 'A booking-request view showing the request, price proposal, confirmation and payment stages.' },
      { file: 'dashboard', title: 'Monitor operations', caption: 'Ariva Casa control center with summaries for bookings, workers, customers, revenue, complaints and stock. Values shown are from the supplied capture.' },
      { file: 'payroll', title: 'Manage payroll', caption: 'Payroll management screen with summary cards, search, filters, export actions and a payroll table. Red annotations are part of the supplied screenshot.' },
    ],
  },
  {
    id: 'solarcrm',
    title: 'SolarCRM',
    company: 'Glidedmatrix Technologies',
    categories: ['dotnet', 'next-angular'],
    coverTheme: 'cover-theme-2',
    coverTag: 'CRM Platform · .NET + Next.js + Angular',
    summary: 'A CRM system tailored for solar businesses.',
    overview:
      'SolarCRM is a CRM system built specifically for solar businesses to manage inquiries, workflows, and operational records across customer and administrative interfaces.',
    stack: ['.NET Web API', 'Next.js', 'Angular Admin Panel', 'REST APIs', 'JWT Authentication'],
    role: 'Full Stack Developer at Glidedmatrix Technologies — developed full-stack modules spanning .NET Web API endpoints, Next.js pages, and the Angular admin dashboard.',
  },
  {
    id: 'missalrecord',
    title: 'Record Room · MissalRecord',
    company: 'Glidedmatrix Technologies',
    categories: ['dotnet', 'next-angular'],
    coverTheme: 'cover-theme-3',
    coverTag: 'GovTech · Government of Chhattisgarh',
    summary: 'A bilingual citizen-services portal for District Administration Korba, guiding visitors from record selection to scanned-document viewing.',
    overview:
      'Record Room (MissalRecord) is a Government of Chhattisgarh project for District Administration Korba. The supplied screens show a citizen-services portal with English and Hindi controls and a guided Record Room journey: choose a service, choose a record type, select the administrative location, search, and view a document. Record types shown include Record of Rights, Mutation Register, Settlement Missal and Revenue Case File. The document preview includes zoom, print and download controls.',
    stack: ['.NET Web API', 'Next.js', 'Angular Admin Panel', 'Clean Architecture', 'SQL Server'],
    role: 'Full Stack Developer at Glidedmatrix Technologies — contributed across .NET Web API services, Next.js frontend workflows, and Angular admin interfaces.',
    galleryLabel: 'Citizen services · District Administration Korba',
    screenshots: [
      { file: 'portal', title: 'A gateway to district records', caption: 'The District Administration Korba homepage introduces revenue information and citizen services, with English and Hindi language controls.' },
      { file: 'service', title: 'Choose the Record Room service', caption: 'The quick guide begins with service selection, highlighting Korba Record Room among the public-service options.' },
      { file: 'record-type', title: 'Choose a record type', caption: 'The guide presents Record of Rights, Mutation Register, Settlement Missal and Revenue Case File as record types.' },
      { file: 'location', title: 'Find the right location', caption: 'The location step follows Tehsil, Revenue Inspector Circle, Patwari Halka and Village selections.' },
      { file: 'document', title: 'View a scanned document', caption: 'The final guide screen demonstrates a scanned-document viewer with zoom, print and download controls. The displayed record is marked as a demo.' },
    ],
  },
  {
    id: 'temple-inventory',
    title: 'Temple Inventory & Management System (Jagannath Temple)',
    company: 'BTJ Alpha Technology',
    categories: ['dotnet'],
    coverTheme: 'cover-theme-4',
    coverTag: 'Management System · .NET',
    summary: 'An inventory workspace for Jagannath Temple covering stock movements, low-stock alerts, correction approvals and master data.',
    overview:
      'A .NET inventory management application for Jagannath Temple. The dashboard presents item totals, stock alerts and store status. Operational screens cover inward entries, outward issuance to temple departments, and stock-correction requests with review and approval. Master-setup screens organize items, locations, categories, measurement units, vendors and users. The supplied captures also show search, date filtering and PDF export actions for stock workflows.',
    stack: ['.NET', 'C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL Server'],
    role: 'Full Stack Developer at BTJ Alpha Technology — built core .NET application modules for temple management and inventory tracking.',
    galleryLabel: 'Jagannath Temple · Inventory operations',
    screenshots: [
      { file: 'dashboard', title: 'Inventory at a glance', caption: 'Dashboard with product totals, stock alerts, active storefronts and location status. Figures reflect the supplied capture, rather than project performance metrics.' },
      { file: 'items', title: 'Organize the item catalog', caption: 'Item records show item numbers, names, categories and base units, with search, add and edit controls.' },
      { file: 'inflows', title: 'Track inward stock', caption: 'Inward entries list invoice references, vendors, received dates and recipients, alongside date filters, search and PDF export.' },
      { file: 'issuance', title: 'Manage stock issuance', caption: 'Outward stock records track destination locations, recipients, issue dates and item counts for temple departments.' },
      { file: 'adjustments', title: 'Review stock corrections', caption: 'The correction queue presents transaction references, requesters and pending or approved statuses with a Review & Approve action.' },
      { file: 'locations', title: 'Maintain store locations', caption: 'Location master data organizes stores and kitchens with descriptions, operational statuses and editing controls.' },
      { file: 'categories', title: 'Group inventory categories', caption: 'Category setup organizes inventory groups such as groceries, ingredients, pooja items and stationery.' },
      { file: 'units', title: 'Define measurement units', caption: 'Unit setup lists inventory units and abbreviations, including bags, bottles, grams, kilograms and dozens.' },
      { file: 'vendors', title: 'Manage vendor records', caption: 'The vendor directory includes contact information, stock delivery days and active statuses, with search and pagination.' },
      { file: 'users', title: 'Organize users and roles', caption: 'User management presents account records and roles such as Store Manager, Store User, Administrator and Super Administrator.' },
    ],
  },
  {
    id: 'hardware-inventory',
    title: 'Hardware Inventory Management',
    company: 'BTJ Alpha Technology',
    categories: ['dotnet'],
    coverTheme: 'cover-theme-5',
    coverTag: 'Inventory · .NET',
    summary: 'Stock and inventory management system for a hardware business.',
    overview:
      'A stock and inventory management application built on .NET to help a hardware business keep accurate track of stock and daily inventory operations.',
    stack: ['.NET', 'C#', 'SQL Server', 'Entity Framework Core'],
    role: 'Full Stack Developer at BTJ Alpha Technology — designed and implemented stock and inventory workflows on the .NET stack.',
  },
  {
    id: 'veer-associates',
    title: 'Veer Associates',
    company: 'BTJ Alpha Technology',
    categories: ['dotnet'],
    coverTheme: 'cover-theme-1',
    coverTag: 'Loan Processing · .NET',
    summary:
      'A loan-processing system that reviews documents received from a bank’s customers so loans can be passed.',
    overview:
      'Veer Associates is a loan-processing application built on .NET that reviews customer documents received from a bank so loan applications can be evaluated and passed.',
    stack: ['.NET', 'C#', 'ASP.NET Core Web API', 'SQL Server'],
    role: 'Full Stack Developer at BTJ Alpha Technology — developed document review and loan-processing workflows using .NET.',
  },
  {
    id: 'workzen-manpower-app',
    title: 'Workzen Manpower Management',
    company: 'BTJ Alpha Technology',
    categories: ['dotnet'],
    coverTheme: 'cover-theme-2',
    coverTag: 'Manpower Operations · .NET',
    summary:
      'Manpower management system for recruiting and sending workers abroad, including to Russia.',
    overview:
      'Workzen Manpower Management is a .NET application supporting international recruitment and manpower coordination for sending workers abroad, including to Russia.',
    stack: ['.NET', 'C#', 'SQL Server', 'REST APIs'],
    role: 'Full Stack Developer at BTJ Alpha Technology — built manpower recruitment and overseas deployment management modules on .NET.',
  },
  {
    id: 'wp-tripzenia',
    title: 'Tripzenia Holiday',
    company: 'BTJ Alpha Technology',
    categories: ['wordpress'],
    coverTheme: 'cover-theme-3',
    coverTag: 'Live Website · WordPress',
    summary: 'Live travel and holiday website delivered on WordPress.',
    overview:
      'Live WordPress website for Tripzenia Holiday, built with attention to responsive layout, performance, and SEO setup.',
    stack: ['WordPress', 'Custom Setup', 'Performance & SEO'],
    role: 'Full Stack Developer at BTJ Alpha Technology — built and delivered the live WordPress website.',
    url: 'https://tripzeniaholiday.in',
  },
  {
    id: 'wp-workzen',
    title: 'Workzen Manpower',
    company: 'BTJ Alpha Technology',
    categories: ['wordpress'],
    coverTheme: 'cover-theme-4',
    coverTag: 'Live Website · WordPress',
    summary: 'Live corporate recruitment website for Workzen Manpower on WordPress.',
    overview:
      'Live WordPress website for Workzen Manpower supporting their recruitment presence online.',
    stack: ['WordPress', 'Custom Themes & Plugins', 'SEO Setup'],
    role: 'Full Stack Developer at BTJ Alpha Technology — delivered the live WordPress website.',
    url: 'https://workzenmanpower.com',
  },
  {
    id: 'wp-vijaybhardwaj',
    title: 'Vijay Bhardwaj Production',
    company: 'Glidedmatrix Technologies',
    categories: ['wordpress'],
    coverTheme: 'cover-theme-5',
    coverTag: 'Live Website · WordPress',
    summary: 'Live production house website delivered on WordPress.',
    overview:
      'Live WordPress website for Vijay Bhardwaj Production built at Glidedmatrix Technologies.',
    stack: ['WordPress', 'Custom Theme', 'Performance & SEO'],
    role: 'Full Stack Developer at Glidedmatrix Technologies — delivered the live WordPress website.',
    url: 'https://vijaybhardwajproduction.com',
  },
  {
    id: 'wp-gtrindia',
    title: 'GTR India',
    company: 'Glidedmatrix Technologies',
    categories: ['wordpress'],
    coverTheme: 'cover-theme-1',
    coverTag: 'Live Website · WordPress',
    summary: 'Live business website for GTR India delivered on WordPress.',
    overview:
      'Live WordPress website for GTR India built at Glidedmatrix Technologies with responsive layout and SEO configuration.',
    stack: ['WordPress', 'Plugins', 'Performance & SEO'],
    role: 'Full Stack Developer at Glidedmatrix Technologies — built and launched the live WordPress site.',
    url: 'https://gtrindia.com',
  },
  {
    id: 'wp-more',
    title: 'And Many More WordPress Websites',
    company: 'Client & Agency Delivery',
    categories: ['wordpress'],
    coverTheme: 'cover-theme-2',
    coverTag: 'WordPress · Custom Themes & WooCommerce',
    summary:
      'Multiple additional WordPress websites delivered with custom themes, plugins, WooCommerce, and SEO setup.',
    overview:
      'Alongside the featured live websites, Dheeraj has delivered many WordPress websites covering custom theme customization, plugin integration, WooCommerce storefronts, speed optimization, and SEO setup.',
    stack: ['WordPress', 'Custom Themes', 'Plugins', 'WooCommerce', 'SEO'],
    role: 'Handled end-to-end WordPress setup, theme and plugin customization, WooCommerce configuration, performance tuning, and SEO.',
  },
];

const ACADEMIC_PROJECTS = [
  {
    title: 'Online Medicine Selling Web Application',
    period: 'Oct 2023 – Jan 2024',
    stack: 'Django · HTML · CSS · JavaScript',
    summary: 'Built the front-end module for an online medicine selling web application.',
  },
  {
    title: 'E-commerce Website',
    period: 'Academic Project',
    stack: 'HTML · CSS · JavaScript',
    summary: 'Responsive front-end e-commerce store built with semantic HTML, CSS, and JavaScript.',
  },
];

const EXPERIENCE = [
  {
    role: 'Full Stack Developer',
    company: 'Glidedmatrix Technologies',
    period: 'Jun 2026 – Present',
    summary:
      'Built ArivaCasa, SolarCRM, and MissalRecord using .NET Web API, Next.js, and an Angular admin panel; also delivered WordPress websites including Vijay Bhardwaj Production and GTR India.',
  },
  {
    role: 'Full Stack Developer',
    company: 'BTJ Alpha Technology',
    period: '3 Nov 2025 – 11 Jun 2026',
    summary:
      'Built the Temple Inventory & Management System, Hardware Inventory Management, Veer Associates, and Workzen Manpower Management on .NET; delivered WordPress websites including Tripzenia Holiday and Workzen Manpower.',
  },
  {
    role: 'Trainer (Full Stack Java, Web Development and MERN)',
    company: 'Questech',
    period: '25 Jun 2025 – 3 Nov 2025',
    summary: 'Trained learners in full-stack Java, web development, and the MERN stack.',
  },
];

const EDUCATION = [
  {
    degree: 'B.Tech (Lateral Entry) in Computer Science',
    institution: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow',
    period: 'Sep 2022 – Jul 2025',
  },
  {
    degree: 'Bachelor of Science',
    institution: 'Awadhesh Pratap Singh University, Rewa (MP)',
    period: 'Aug 2019 – Jul 2022',
  },
];

const CERTIFICATIONS = [
  'Web Development (Infovirtech Pvt Ltd)',
  'Java Programming Language (KTCS India)',
  'Web Application Development using Django',
  'Data Structures and Algorithms (DSA)',
];

const LANGUAGES = ['Hindi', 'English'];

/* ==========================================================================
   HELPERS & UTILITIES
   ========================================================================== */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isFinePointerDesktop = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function padTwo(num) {
  return String(num).padStart(2, '0');
}

/**
 * Formats numbers inside date strings with consistent .numeral styling.
 */
function formatDateNumerals(text) {
  return String(text).replace(/\d+/g, (match) => `<span class="numeral inline-numeral">${match}</span>`);
}

function createSvgPattern(index) {
  const shapes = [
    `<svg class="project-cover-svg" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45"/><stop offset="100%" stop-color="#22D3EE" stop-opacity="0.2"/></linearGradient></defs><circle cx="310" cy="48" r="90" stroke="url(#pg1)" stroke-width="1.2" fill="none"/><circle cx="310" cy="48" r="56" stroke="#22D3EE" stroke-opacity="0.22" stroke-width="1" fill="none"/><path d="M0 160 Q140 90 280 140 T400 95" stroke="url(#pg1)" stroke-width="1.4" fill="none"/></svg>`,
    `<svg class="project-cover-svg" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><g stroke="#ffffff" stroke-opacity="0.12" fill="none"><rect x="40" y="28" width="120" height="120" rx="24" transform="rotate(14 100 88)"/><rect x="230" y="42" width="110" height="110" rx="22" transform="rotate(-12 285 97)"/><line x1="0" y1="140" x2="400" y2="60"/></g></svg>`,
    `<svg class="project-cover-svg" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true"><g stroke="#22D3EE" stroke-opacity="0.24" fill="none"><polygon points="200,22 330,100 200,178 70,100"/><polygon points="200,48 286,100 200,152 114,100"/><line x1="70" y1="100" x2="330" y2="100"/></g></svg>`,
  ];
  return shapes[index % shapes.length];
}

/* ==========================================================================
   RENDER DATA-DRIVEN SECTIONS
   ========================================================================== */

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (grid) {
    grid.innerHTML = SKILLS.map(
      (group, idx) => `
      <article class="skill-card glass-card fade-up">
        <div class="skill-card-head">
          <div class="skill-card-title-wrap">
            <div class="skill-icon" aria-hidden="true">${group.icon}</div>
            <div>
              <span class="numeral card-index">${padTwo(idx + 1)}</span>
              <h3 class="skill-group-title">${group.group}</h3>
            </div>
          </div>
          <span class="skill-level-badge">${group.level}</span>
        </div>
        <ul class="skill-items-list" role="list">
          ${group.items
            .map(
              (item) => `
            <li class="skill-chip">
              <span>${item.name}</span>
              <span class="skill-chip-level">· ${item.level}</span>
            </li>
          `
            )
            .join('')}
        </ul>
      </article>
    `
    ).join('');
  }

  const marquee = document.getElementById('tech-marquee-track');
  if (marquee) {
    const buildItems = (isDup) =>
      TECH_MARQUEE.map(
        (tech) => `
      <span class="marquee-item ${isDup ? 'marquee-duplicate' : ''}" ${isDup ? 'aria-hidden="true"' : ''}>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
          <polygon points="8,1 15,8 8,15 1,8" />
        </svg>
        <span>${tech}</span>
      </span>
    `
      ).join('');
    marquee.innerHTML = buildItems(false) + buildItems(true);
  }
}

function renderProjects(filter = 'all') {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered =
    filter === 'all'
      ? PROJECTS
      : PROJECTS.filter((p) => p.categories.includes(filter));

  grid.innerHTML = filtered
    .map((project, index) => {
      const globalIndex = PROJECTS.indexOf(project) + 1;
      const visitButton = project.url
        ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary">
            <span>Visit site</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </a>`
        : '';

      return `
      <article class="project-card glass-card fade-up" data-project-id="${project.id}">
        <div class="project-media">
          <div class="project-cover ${project.coverTheme} ${project.screenshots ? 'project-cover-with-image' : ''}">
            ${project.screenshots ? `<div class="project-slide-track">${project.screenshots.map((shot, i) => `<img class="project-cover-image" src="/assets/projects/${project.id}/${shot.file}.png" alt="${project.title}: ${shot.title}" loading="lazy" width="1178" height="526" aria-hidden="${i !== 0}">`).join('')}</div>` : createSvgPattern(index)}
            ${!project.screenshots ? `<span class="project-cover-label">${project.coverTag}</span>` : ''}
          </div>
          <div class="project-preview-bar">
            <span class="project-preview-type">${project.screenshots ? 'Product walkthrough' : 'Project overview'}</span>
            ${project.screenshots ? `<div class="project-slide-controls"><button type="button" data-slide-prev aria-label="Previous ${project.title} preview">←</button><span class="project-slide-count">1 / ${project.screenshots.length}</span><button type="button" data-slide-next aria-label="Next ${project.title} preview">→</button><button type="button" data-slide-pause aria-pressed="false" aria-label="Pause ${project.title} slideshow">Ⅱ</button></div>` : `<span class="project-preview-type">${padTwo(globalIndex)}</span>`}
          </div>
        </div>
        <div class="project-body">
          <p class="project-meta">${project.company}</p>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-summary">${project.summary}</p>
          <div class="project-stack-line">${project.stack.map(tech => `<span class="project-tech">${tech}</span>`).join('')}</div>
          <div class="project-actions">
            <button type="button" class="project-btn" data-open-modal="${project.id}">
              <span>${project.screenshots ? 'View case study' : 'View project'}</span><span aria-hidden="true">↗</span>
            </button>
            ${visitButton}
            ${project.screenshots ? `<span class="project-screen-count">${project.screenshots.length} screens</span>` : ''}
          </div>
        </div>
      </article>
    `;
    })
    .join('');

  attachModalTriggers();
  attachProjectSlides();
}

function initFeaturedJourneys() {
  const section = document.getElementById('featured-journeys');
  const track = document.getElementById('journeys-track');
  if (!section || !track) return;
  const featured = ['temple-inventory', 'arivacasa', 'missalrecord', 'solarcrm', 'hardware-inventory', 'workzen-manpower-app'].map(id => PROJECTS.find(project => project.id === id));
  const labels = [
    { code: 'INV', name: 'Temple Inventory', category: 'Inventory & operations', detail: 'Stock in. Clarity out.', route: 'STORE → SERVICE', accent: 'temple' },
    { code: 'AC', name: 'ArivaCasa', category: 'Home-services marketplace', detail: 'From discovery to doorstep.', route: 'DISCOVER → BOOK', accent: 'ariva' },
    { code: 'RR', name: 'Record Room', category: 'Digital citizen services', detail: 'Public records. Clear journeys.', route: 'SEARCH → RECORD', accent: 'records' },
    { code: 'SOL', name: 'SolarCRM', detail: 'Clarity for solar operations.', route: 'INQUIRY → WORKFLOW', accent: 'solar' },
    { code: 'HW', name: 'Hardware Inventory', detail: 'Keep everyday stock in order.', route: 'ITEM → INVENTORY', accent: 'hardware' },
    { code: 'WZ', name: 'Workzen Manpower', detail: 'Coordinating people across borders.', route: 'RECRUIT → DEPLOY', accent: 'workzen' },
  ];
  track.innerHTML = featured.map((project, index) => {
    const label = labels[index];
    return `<article class="project-ticket ticket-${label.accent}" aria-roledescription="slide" aria-label="${label.name}">
      <button type="button" class="ticket-main" aria-label="Explore ${label.name} case study">
        <span class="ticket-image ${!project.screenshots ? 'ticket-image-illustrated' : ''}">${project.screenshots ? `<img src="/assets/projects/${project.id}/${project.screenshots[0].file}.png" alt="" loading="lazy" width="200" height="250">` : `<span class="ticket-monogram" aria-hidden="true">${label.code}</span>`}<span class="ticket-image-code">${label.code}</span></span>
        <span class="ticket-content"><span class="ticket-eyebrow">PROJECT PASS <span>${label.code}</span></span><span class="ticket-title">${label.name}</span><span class="ticket-description">${label.detail}</span><span class="ticket-route">${label.route}</span></span>
      </button>
      <button type="button" class="ticket-stub" aria-label="Open ${label.name} project details"><span class="ticket-barcode" aria-hidden="true"></span><span>EXPLORE</span><span class="ticket-arrow" aria-hidden="true">↗</span></button>
    </article>`;
  }).join('');
  [...track.children].forEach((ticket, index) => ticket.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => { lastModalTrigger = button; openProjectModal(featured[index].id); });
  }));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches;
  let visible = false;
  const pause = document.getElementById('journeys-pause');
  const updatePause = () => {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Play featured project slideshow' : 'Pause featured project slideshow');
  };
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  motion.addEventListener('change', () => { if (motion.matches) { paused = true; updatePause(); } });
  updatePause();
  function move(direction) {
    const cards = [...track.children];
    const max = track.scrollWidth - track.clientWidth;
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    const next = direction > 0 ? (track.scrollLeft >= max - 2 ? 0 : Math.min(max, track.scrollLeft + step))
      : (track.scrollLeft <= 2 ? max : Math.max(0, track.scrollLeft - step));
    track.scrollTo({ left: next, behavior: motion.matches ? 'auto' : 'smooth' });
  }
  document.getElementById('journeys-prev').addEventListener('click', () => move(-1));
  document.getElementById('journeys-next').addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
  });
  const timer = window.setInterval(() => {
    if (visible && !paused && !document.hidden && document.getElementById('project-modal').hidden && !section.matches(':hover, :focus-within')) move(1);
  }, 5500);
  let accentStarted = false;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    const constrained = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4);
    if (visible && !accentStarted && !motion.matches && !constrained && innerWidth >= 768) {
      accentStarted = true;
      import('./ticket-scene.js').then(({ initTicketAccent }) => initTicketAccent(document.getElementById('journeys-accent'), section)).catch(() => {});
    }
  }, { threshold: .1 });
  observer.observe(section);
  window.addEventListener('pagehide', () => { clearInterval(timer); observer.disconnect(); }, { once: true });
}

let disposeProjectSlides = () => {};
function attachProjectSlides() {
  disposeProjectSlides();
  const slideshows = [];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const state = slideshows.find(item => item.card === entry.target);
    if (state) state.visible = entry.isIntersecting;
  }));
  document.querySelectorAll('.project-media:has(.project-cover-with-image)').forEach(cover => {
    const card = cover.closest('.project-card');
    const track = cover.querySelector('.project-slide-track');
    const images = [...track.children];
    const state = { card, selected: 0, paused: prefersReducedMotion(), visible: false };
    const show = index => {
      state.selected = (index + images.length) % images.length;
      track.style.transform = `translateX(-${state.selected * 100}%)`;
      images.forEach((image, i) => image.setAttribute('aria-hidden', String(i !== state.selected)));
      cover.querySelector('.project-slide-count').textContent = `${state.selected + 1} / ${images.length}`;
    };
    state.next = () => show(state.selected + 1);
    cover.querySelector('[data-slide-prev]').addEventListener('click', () => show(state.selected - 1));
    cover.querySelector('[data-slide-next]').addEventListener('click', state.next);
    const pause = cover.querySelector('[data-slide-pause]');
    const updatePause = () => {
      pause.setAttribute('aria-pressed', String(state.paused));
      pause.setAttribute('aria-label', `${state.paused ? 'Play' : 'Pause'} project slideshow`);
      pause.textContent = state.paused ? '▶' : 'Ⅱ';
    };
    pause.addEventListener('click', () => { state.paused = !state.paused; updatePause(); });
    updatePause();
    slideshows.push(state);
    observer.observe(card);
  });
  const timer = window.setInterval(() => {
    if (document.hidden || !document.getElementById('project-modal').hidden) return;
    slideshows.forEach(state => {
      if (state.visible && !state.paused && !state.card.matches(':hover, :focus-within')) state.next();
    });
  }, 5500);
  disposeProjectSlides = () => { clearInterval(timer); observer.disconnect(); };
}

function renderAcademicProjects() {
  const grid = document.getElementById('academic-grid');
  if (!grid) return;
  grid.innerHTML = ACADEMIC_PROJECTS.map(
    (item, idx) => `
    <article class="academic-card glass-card">
      <div class="academic-top-row">
        <span class="numeral card-index">${padTwo(idx + 1)}</span>
        <p class="academic-meta">${formatDateNumerals(item.period)} · ${item.stack}</p>
      </div>
      <h4 class="academic-title">${item.title}</h4>
      <p class="academic-desc">${item.summary}</p>
    </article>
  `
  ).join('');
}

function renderCareer() {
  const expEl = document.getElementById('experience-timeline');
  if (expEl) {
    expEl.innerHTML = EXPERIENCE.map(
      (item, idx) => `
      <article class="timeline-item glass-card fade-up">
        <span class="timeline-node" aria-hidden="true"></span>
        <div class="timeline-top-row">
          <p class="timeline-period">${formatDateNumerals(item.period)}</p>
          <span class="numeral card-index">${padTwo(idx + 1)}</span>
        </div>
        <h4 class="timeline-role">${item.role}</h4>
        <p class="timeline-company">${item.company}</p>
        <p class="timeline-summary">${item.summary}</p>
      </article>
    `
    ).join('');
  }

  const eduEl = document.getElementById('education-list');
  if (eduEl) {
    eduEl.innerHTML = EDUCATION.map(
      (edu, idx) => `
      <article class="edu-card glass-card fade-up">
        <div class="timeline-top-row">
          <p class="edu-period">${formatDateNumerals(edu.period)}</p>
          <span class="numeral card-index">${padTwo(idx + 1)}</span>
        </div>
        <h4 class="edu-degree">${edu.degree}</h4>
        <p class="edu-school">${edu.institution}</p>
      </article>
    `
    ).join('');
  }

  const certEl = document.getElementById('certifications-list');
  if (certEl) {
    certEl.innerHTML = CERTIFICATIONS.map(
      (cert) => `<li class="credential-chip">${cert}</li>`
    ).join('');
  }

  const langEl = document.getElementById('languages-list');
  if (langEl) {
    langEl.innerHTML = LANGUAGES.map(
      (lang) => `<li class="credential-chip">${lang}</li>`
    ).join('');
  }
}

/* ==========================================================================
   PROJECT FILTER TABS, MODAL & TILT INTERACTIONS
   ========================================================================== */

function initProjectFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderProjects(tab.dataset.filter || 'all');
    });
  });
}

function attachProjectTilt() {
  if (!isFinePointerDesktop() || prefersReducedMotion()) return;
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

let lastModalTrigger = null;

function openProjectModal(projectId) {
  const project = PROJECTS.find((p) => p.id === projectId);
  const modal = document.getElementById('project-modal');
  if (!project || !modal) return;

  const indexNum = padTwo(PROJECTS.indexOf(project) + 1);
  document.getElementById('modal-category').innerHTML = `<span class="numeral inline-numeral">${indexNum}</span> · ${project.company} · ${project.coverTag}`;
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-overview').textContent = project.overview;
  document.getElementById('modal-role').textContent = project.role;

  const coverEl = document.getElementById('modal-cover');
  coverEl.className = `modal-cover ${project.coverTheme}`;
  coverEl.innerHTML = createSvgPattern(PROJECTS.indexOf(project));
  const existingGallery = document.getElementById('project-gallery');
  existingGallery?.remove();
  modal.classList.toggle('has-project-gallery', Boolean(project.screenshots));
  coverEl.hidden = Boolean(project.screenshots);
  if (project.screenshots) renderProjectGallery(project, coverEl);

  const stackEl = document.getElementById('modal-stack');
  stackEl.innerHTML = project.stack
    .map((tech) => `<span class="credential-chip">${tech}</span>`)
    .join('');

  const footerEl = document.getElementById('modal-footer');
  footerEl.innerHTML = project.url
    ? `<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <span>Visit live website</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7 17 17 7M7 7h10v10"/>
        </svg>
      </a>`
    : `<a href="#contact" class="btn btn-glass" data-modal-contact>Discuss a similar project</a>`;

  const modalContactBtn = footerEl.querySelector('[data-modal-contact]');
  if (modalContactBtn) {
    modalContactBtn.addEventListener('click', closeProjectModal);
  }

  modal.hidden = false;
  modal.querySelector('.modal-dialog').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close').focus();
}

function renderProjectGallery(project, coverEl) {
  const gallery = document.createElement('section');
  gallery.id = 'project-gallery';
  gallery.className = 'project-gallery';
  gallery.style.setProperty('--gallery-columns', String(project.screenshots.length > 7 ? 5 : project.screenshots.length));
  gallery.setAttribute('aria-label', `${project.title} screenshots`);
  gallery.innerHTML = `
    <div class="gallery-heading"><span>Product walkthrough</span><span>${project.galleryLabel || 'Customer experience + admin operations'}</span></div>
    <figure class="gallery-figure">
      <a class="gallery-fullsize" target="_blank" rel="noopener noreferrer" aria-label="Open selected screenshot at full size"><img class="gallery-image" width="1178" height="526" alt=""></a>
      <figcaption><div class="gallery-caption-title"></div><p class="gallery-caption-text"></p></figcaption>
    </figure>
    <div class="gallery-controls"><button type="button" class="project-btn gallery-prev" aria-label="Previous screenshot">← Previous</button><span class="gallery-counter" role="status"></span><button type="button" class="project-btn gallery-next" aria-label="Next screenshot">Next →</button></div>
    <div class="gallery-thumbnails" role="group" aria-label="Choose a project screenshot"></div>`;
  const thumbnails = gallery.querySelector('.gallery-thumbnails');
  let selected = 0;
  function select(index) {
    selected = (index + project.screenshots.length) % project.screenshots.length;
    const shot = project.screenshots[selected];
    const path = `/assets/projects/${project.id}/${shot.file}.png`;
    const image = gallery.querySelector('.gallery-image');
    image.src = path;
    image.classList.remove('is-changing');
    void image.offsetWidth;
    image.classList.add('is-changing');
    image.alt = `${shot.title}. ${shot.caption}`;
    gallery.querySelector('.gallery-fullsize').href = path;
    gallery.querySelector('.gallery-caption-title').textContent = shot.title;
    gallery.querySelector('.gallery-caption-text').textContent = shot.caption;
    gallery.querySelector('.gallery-counter').textContent = `${selected + 1} / ${project.screenshots.length}`;
    [...thumbnails.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === selected)));
  }
  project.screenshots.forEach((shot, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gallery-thumb';
    button.setAttribute('aria-label', `Show screenshot ${index + 1}: ${shot.title}`);
    button.innerHTML = `<img src="/assets/projects/${project.id}/${shot.file}.png" alt="" loading="lazy" width="160" height="90"><span>${shot.title}</span>`;
    button.addEventListener('click', () => select(index));
    thumbnails.appendChild(button);
  });
  gallery.querySelector('.gallery-prev').addEventListener('click', () => select(selected - 1));
  gallery.querySelector('.gallery-next').addEventListener('click', () => select(selected + 1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      select(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  coverEl.after(gallery);
  select(0);
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') {
    lastModalTrigger.focus();
  }
}

function attachModalTriggers() {
  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      lastModalTrigger = btn;
      openProjectModal(btn.dataset.openModal);
    });
  });
}

function initModalEvents() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeProjectModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !modal.hidden) {
      const focusable = [...modal.querySelectorAll('button, a[href], [tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    if (e.key === 'Escape' && !modal.hidden) {
      closeProjectModal();
    }
  });
}

/* ==========================================================================
   PRELOADER, THEME TOGGLE, ROTATING ROLES, CURSOR, MAGNETIC BUTTONS
   ========================================================================== */

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  if (prefersReducedMotion()) {
    preloader.classList.add('is-done');
    return;
  }

  window.setTimeout(() => {
    preloader.classList.add('is-leaving');
    window.setTimeout(() => {
      preloader.classList.add('is-done');
    }, 420);
  }, 780);
}

function initThemeToggle() {
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  const root = document.documentElement;
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const syncState = (theme) => {
    const isLight = theme === 'light';
    buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(isLight)));
    if (metaTheme) {
      metaTheme.setAttribute('content', isLight ? '#F5F5F9' : '#07070B');
    }
  };

  syncState(root.getAttribute('data-theme') || 'dark');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('ds-theme', next);
      } catch {
        // Ignore storage restrictions
      }
      syncState(next);
    });
  });
}

function initRotatingRole() {
  const el = document.getElementById('rotating-role');
  if (!el || prefersReducedMotion()) return;

  let index = 0;
  window.setInterval(() => {
    el.classList.add('is-switching');
    window.setTimeout(() => {
      index = (index + 1) % ROLES.length;
      el.textContent = ROLES[index];
      el.classList.remove('is-switching');
    }, 240);
  }, 2900);
}

function initCustomCursor() {
  if (!isFinePointerDesktop() || prefersReducedMotion()) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let rafId = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (!document.body.classList.contains('has-cursor')) {
        document.body.classList.add('has-cursor');
      }
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('has-cursor');
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
    rafId = requestAnimationFrame(renderRing);
  }
  rafId = requestAnimationFrame(renderRing);

  const interactiveSelector = 'a, button, input, textarea, [role="tab"]';
  document.addEventListener('pointerover', (e) => {
    if (e.target && e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target && e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
}

/* ==========================================================================
   SCROLL-SPY (DESKTOP PILL + MOBILE BOTTOM TAB BAR)
   ========================================================================== */

function initSectionNavigation() {
  function scrollToSection(hash, smooth = true) {
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    history.replaceState(history.state, '', location.pathname + location.search);
    target.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto', block: 'start' });
    return target;
  }
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href').length < 2) return;
    const hash = link.getAttribute('href');
    let target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
    if (!target) return;
    event.preventDefault();
    scrollToSection(hash);
    if (event.detail === 0) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
  if (location.hash) {
    const hash = location.hash;
    history.replaceState(history.state, '', location.pathname + location.search);
    if (document.readyState === 'complete') scrollToSection(hash, false);
    else window.addEventListener('load', () => scrollToSection(hash, false), { once: true });
  }
  window.addEventListener('hashchange', () => { if (location.hash) scrollToSection(location.hash); });
}

function initScrollSpy() {
  const desktopLinks = document.querySelectorAll('.nav-link[data-spy]');
  const mobileTabs = document.querySelectorAll('.mobile-tab[data-spy-mobile]');
  const indicator = document.getElementById('mobile-tab-indicator');

  const sectionMap = [
    { id: 'hero', desktop: null, mobile: 'hero', index: 0 },
    { id: 'about', desktop: 'about', mobile: 'hero', index: 0 },
    { id: 'skills', desktop: 'skills', mobile: 'skills', index: 1 },
    { id: 'projects', desktop: 'projects', mobile: 'projects', index: 2 },
    { id: 'experience', desktop: 'experience', mobile: 'experience', index: 3 },
    { id: 'contact', desktop: 'contact', mobile: 'contact', index: 4 },
  ];

  function setActive(sectionId) {
    const match = sectionMap.find((s) => s.id === sectionId) || sectionMap[0];

    desktopLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.spy === match.desktop);
    });

    mobileTabs.forEach((tab) => {
      const active = tab.dataset.spyMobile === match.mobile;
      tab.classList.toggle('is-active', active);
      if (active) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });

    if (indicator) {
      indicator.style.transform = `translateX(${match.index * 100}%)`;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-38% 0px -48% 0px', threshold: 0 }
  );

  sectionMap.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  mobileTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = Number(tab.dataset.tabIndex || 0);
      if (indicator) {
        indicator.style.transform = `translateX(${idx * 100}%)`;
      }
    });
  });
}

/* ==========================================================================
   GSAP + SCROLLTRIGGER + COUNTERS + LAZY THREE.JS HERO
   ========================================================================== */

let threeController = null;

function initLazyThreeHero() {
  if (prefersReducedMotion()) return;

  const loadScene = async () => {
    try {
      const { initHeroThreeScene } = await import('./three-scene.js');
      const container = document.getElementById('hero-canvas-wrap');
      const stageEl = document.querySelector('.hero-bg-stage');
      threeController = initHeroThreeScene({ container, stageEl });

      if (threeController && window.gsap && window.ScrollTrigger) {
        window.ScrollTrigger.create({
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          onUpdate: (self) => {
            if (threeController) threeController.setScrollProgress(self.progress);
          },
        });
      }
    } catch {
      // Fallback CSS orb remains active automatically
    }
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadScene, { timeout: 900 });
  } else {
    window.setTimeout(loadScene, 180);
  }
}

function formatCounterValue(value, padWidth) {
  return padWidth > 0 ? String(value).padStart(padWidth, '0') : String(value);
}

function initStatCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  // Show final value immediately for reduced-motion preference
  if (prefersReducedMotion()) {
    counters.forEach((el) => {
      const target = Number(el.dataset.counter || 0);
      const pad = Number(el.dataset.pad || 0);
      el.textContent = formatCounterValue(target, pad);
    });
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.counter || 0);
        const pad = Number(el.dataset.pad || 0);
        if (!target) return;

        const duration = 680;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = formatCounterValue(current, pad);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = formatCounterValue(target, pad);
          }
        }

        el.textContent = formatCounterValue(0, pad);
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((el) => counterObserver.observe(el));
}

function initAnimations() {
  initStatCounters();

  if (prefersReducedMotion()) return;
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.reveal-hero', {
    y: 22,
    opacity: 0,
    duration: 0.75,
    stagger: 0.08,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
  });

  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });
  });

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
      if (threeController) threeController.setScrollProgress(self.progress);
    },
  });
}

/* ==========================================================================
   CONTACT FORM & FOOTER
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const statusEl = document.getElementById('contact-status');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorMessage.textContent = '';
    statusEl.textContent = '';
    statusEl.dataset.state = '';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let valid = true;
    if (name.length < 2) {
      errorName.textContent = 'Please enter your name.';
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEmail.textContent = 'Please enter a valid email address.';
      valid = false;
    }
    if (message.length < 10) {
      errorMessage.textContent = 'Please write a brief message (at least 10 characters).';
      valid = false;
    }

    if (!valid) return;

    const button = document.getElementById('contact-submit');
    if (button.disabled) return;
    const label = button.querySelector('span');
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = 'Sending…';
    statusEl.textContent = 'Sending your message…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website: document.getElementById('contact-website').value }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.delivery === 'browser') {
        const action = new URL(data.action);
        if (action.origin !== 'https://formsubmit.co') throw new Error('Invalid contact service address.');
        const deliveryForm = document.createElement('form');
        deliveryForm.method = 'POST';
        deliveryForm.action = action.href;
        const fields = { name, email, message, _replyto: email, _subject: 'Portfolio inquiry: ' + name, _template: 'table', _captcha: 'false', _honey: '' };
        Object.entries(fields).forEach(([key, value]) => {
          const field = document.createElement('input');
          field.type = 'hidden'; field.name = key; field.value = value;
          deliveryForm.appendChild(field);
        });
        document.body.appendChild(deliveryForm);
        statusEl.textContent = 'Opening the secure submission confirmation…';
        deliveryForm.submit();
        return;
      }
      if (!response.ok || !data?.message) throw new Error(data?.error || (response.status === 404
        ? 'The contact endpoint is unavailable. Please refresh the page and try again, or email dheerajsoni.dev@gmail.com.'
        : 'Unable to submit your message. Please try again or email dheerajsoni.dev@gmail.com.'));
      statusEl.textContent = data.message;
      statusEl.dataset.state = 'success';
      form.reset();
    } catch (error) {
      statusEl.textContent = error.name === 'AbortError'
        ? 'The request timed out. Your message may have been submitted; please wait before trying again, or email dheerajsoni.dev@gmail.com.'
        : error.message || 'Unable to submit your message. Please try again.';
      statusEl.dataset.state = 'error';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      label.textContent = 'Send Message';
      form.removeAttribute('aria-busy');
    }
  });
}

function initFooter() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
  }
}

/* ==========================================================================
   BOOT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  renderSkills();
  renderProjects('all');
  initFeaturedJourneys();
  renderAcademicProjects();
  renderCareer();
  initProjectFilters();
  initModalEvents();
  initRotatingRole();
  initCustomCursor();
  initScrollSpy();
  initSectionNavigation();
  initContactForm();
  initFooter();
  initAnimations();
  initLazyThreeHero();
});
