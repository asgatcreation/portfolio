// All facts come from each project's README or live demo (checked 11–12 Nov 2026).
// In the real site this becomes one content file per project; change `status` and `demo`
// when a project goes live and the site rebuilds itself.
window.PORTFOLIO = (function () {
  var I = '../shared/img/';
  var projects = [
    {
      id: 'carhub', title: 'CarHub', color: '#e6b450', featured: true,
      status: 'live', statusLabel: 'Live', year: '2026',
      tagline: 'Nigeria’s marketplace for verified cars: three products in one.',
      summary: 'Reserve a car online with a refundable deposit, inspect it in person, then pay the balance. CarHub also sells parts and accessories that fit your car, and books rides and chauffeurs tracked live on a map.',
      categories: ['Marketplace', 'Fintech', 'Real-time'], languages: ['Python', 'JavaScript'],
      stack: ['Django 5.2', 'Django Channels', 'PostgreSQL', 'Paystack', 'Leaflet', 'OSRM', 'PWA', 'Google sign-in'],
      facts: [['146', 'automated tests'], ['3', 'products in one'], ['5', 'demo roles'], ['2', 'Python versions in CI']],
      demo: 'https://carhub-es73.onrender.com/', code: 'https://github.com/asgatcreation/carhub',
      problem: 'Buying a car online in Nigeria usually means scrolling through unverified listings, then wiring money to a stranger. Nobody pays ₦50M by card for a car they haven’t seen, so CarHub models how the purchase really works.',
      note: 'Portfolio project: listings, dealers and reviews are demo data and no real vehicles are sold. Free hosting, so the first visit can take 30–50 seconds to wake.',
      cover: I + 'carhub/01-home.jpg', phone: I + 'carhub/13-mobile.jpg',
      parts: [
        { name: 'Cars marketplace', short: 'Cars', icon: 'car',
          about: 'Every listing is reviewed before it goes live and every price is compared with the market. Buyers reserve with a refundable ₦250,000 deposit, the seller confirms an inspection slot, and the buyer pays the balance or cancels for a refund.',
          features: ['Filters for make, body, fuel, price, year, mileage and state', 'Natural-language search like “2021 lexus lagos”', 'A price badge that compares each car with the market', 'Checkout locks the car, so two buyers can never reserve one car', 'Each car in an order has its own status, notification and email', 'Public seller storefronts with ratings and reviews'],
          shots: [['carhub/01-home.jpg', 'Home page with the featured-car spotlight'], ['carhub/02-browse.jpg', 'Browse with filters and price badges'], ['carhub/03-car-detail.jpg', 'Car page with the price insight'], ['carhub/06-review-and-pay.jpg', 'Review and pay: deposit today, balance at inspection'], ['carhub/07-confirmation.jpg', 'Confirmation and order tracking'], ['carhub/08-seller-reservations.jpg', 'Sellers confirm or reschedule inspections'], ['carhub/10-seller-storefront.jpg', 'A seller’s public storefront']] },
        { name: 'CAS · Car accessories & parts', short: 'Accessories', icon: 'parts',
          about: 'Buyers save their car once, and every product shows “Fits your Camry” or “Doesn’t fit”. Approved vendors manage stock and fulfil orders.',
          features: ['Fit check on every product for your saved car', 'One switch shows only parts that fit', 'Live stock; stock rows are locked so items can’t be oversold', 'Paystack, demo payment, or pay on delivery in Lagos and Abuja', 'Delivery priced by state, free over ₦100,000', 'Reviews marked “verified purchase”, moderated first'],
          shots: [['carhub/17-parts-store.jpg', 'The parts store, shopping for your car'], ['carhub/18-parts-shop.jpg', 'Filtered to parts that fit'], ['carhub/19-part-fits.jpg', 'Product page with the fit check']] },
        { name: 'DriverZone · Rides & chauffeurs', short: 'DriverZone', icon: 'ride',
          about: 'Book a ride, or a vetted chauffeur to drive your own car by the hour or day. Drivers share live GPS from their phone, and every trip is tracked live.',
          features: ['Search any address (Photon), or drop pins; routes on real roads (OSRM)', 'Ride (Economy or Comfort) and Chauffeur, up to 30 days ahead', 'Dispatch to the nearest idle, verified driver', 'Fares recomputed on the server, never trusted from the browser', 'Live updates over WebSockets, with a polling fallback', 'A live operations map for staff'],
          shots: [['carhub/21-rides-booking.jpg', 'Booking a ride on the map'], ['carhub/22-live-trip.jpg', 'Live trip tracking'], ['carhub/23-rides-mobile.jpg', 'Booking, live trip and driver app on a phone'], ['carhub/24-live-ops.jpg', 'Live rides map in the staff console']] }
      ],
      extra: [['carhub/15-admin-console.jpg', 'Staff console: everything public is checked first'], ['carhub/11-verify-code.jpg', 'Accounts verified with 6-digit codes'], ['carhub/14-dark-mode.jpg', 'Dark mode'], ['carhub/13-mobile.jpg', 'Designed for a 390px phone first']]
    },
    {
      id: 'floatbook', title: 'FloatBook', color: '#f5a524', featured: true,
      status: 'live', statusLabel: 'Live demo', year: '2026',
      tagline: 'Every naira at the counter, accounted for.',
      summary: 'Back-office software for Nigerian POS and agent-banking businesses. It replaces the notebook and WhatsApp group: every transaction, the cash and wallet float at each outlet, the end-of-day count, reversals, and the owner’s numbers, live.',
      categories: ['Fintech'], languages: ['PHP', 'TypeScript'],
      stack: ['PHP 8.5', 'Laravel 13', 'Inertia 3', 'Vue 3', 'TypeScript', 'Tailwind CSS 4', 'PostgreSQL 17', 'Pest 5', 'Playwright', 'Docker'],
      facts: [['4', 'demo roles'], ['72h', 'target per reversal case'], ['L7', 'Larastan level'], ['1', 'Docker container']],
      demo: 'https://floatbook.onrender.com', code: null,
      problem: 'POS owners run their business from a notebook and WhatsApp messages. Cash goes missing, failed transactions are forgotten, and the owner can’t see today’s profit without being there.',
      note: 'Honest note from the README: FloatBook does not connect to Moniepoint, OPay or Palmpay. Data comes from entry at the counter and imported provider statements, through an adapter layer ready for real integrations.',
      cover: I + 'floatbook/01-landing.jpg',
      features: ['A one-thumb keypad: charges, fees and profit worked out as you type', 'Works offline and sends entries when the network returns, never twice', 'Cash and wallet float for every drawer, with low-balance alerts', 'A blind end-of-day count that closes the day for good', 'Each failed transaction opens a case with a 72-hour target', 'Import provider statements and see what doesn’t match', 'Flags duplicates, large amounts and after-hours entries', 'A double-entry ledger checked by the database; nothing is edited in place'],
      shots: [['floatbook/01-landing.jpg', 'Landing page with the counter keypad'], ['floatbook/02-dashboard.jpg', 'The owner’s dashboard and what needs attention'], ['floatbook/03-float.jpg', 'Cash and wallet float at every outlet']]
    },
    {
      id: 'financeflow', title: 'FinanceFlow', color: '#3ddc97', featured: true,
      status: 'live', statusLabel: 'Live', year: '2026',
      tagline: 'Your money. All of it. In one place.',
      summary: 'A multi-currency expense tracker and finance dashboard. Track naira, dollars, euros and more, each transaction in its own currency, with budgets, charts, reports and exports.',
      categories: ['Fintech', 'Productivity'], languages: ['Python', 'JavaScript'],
      stack: ['Django 5', 'Python 3.12', 'PostgreSQL (Supabase)', 'Google OAuth', 'Chart.js', 'Render'],
      facts: [['20', 'currencies seeded'], ['5', 'currencies per user'], ['4', 'interactive charts'], ['15', 'starter categories']],
      demo: 'https://financeflow-app-uuu8.onrender.com', code: 'https://github.com/asgatcreation/financeflow',
      problem: 'Managing money across several currencies usually means converting everything by hand and losing track of what was really spent.',
      note: 'Free hosting: the first load can take about 30 seconds.',
      cover: I + 'financeflow/04-dashboard.jpg', phone: I + 'financeflow/14-mobile-dashboard.jpg',
      features: ['Each transaction stays in its own currency, never blended', 'Per-currency KPI cards: balance, income, expense, savings rate', '4 Chart.js charts with a currency switcher', 'Monthly budgets per category and currency, with radial progress', '12-month reports and 6-month predictions (weighted moving average)', 'PDF report, CSV and 3-sheet Excel export', 'Email sign-up or Google sign-in; your data is only yours'],
      shots: [['financeflow/01-landing.jpg', 'Landing page'], ['financeflow/04-dashboard.jpg', 'Multi-currency dashboard'], ['financeflow/05-transactions.jpg', 'Transactions with per-currency totals'], ['financeflow/06-budgets.jpg', 'Budgets per category and currency'], ['financeflow/07-reports.jpg', 'Reports, insights and predictions'], ['financeflow/08-currencies.jpg', 'The multi-currency wallet'], ['financeflow/10-transaction-form.jpg', 'Currency-aware transaction form'], ['financeflow/14-mobile-dashboard.jpg', 'Dashboard on a phone']]
    },
    {
      id: 'naijadata', title: 'naija-data', color: '#e6b450', featured: true,
      status: 'live', statusLabel: 'v1.0.0 released', year: '2026',
      tagline: 'Sourced Nigerian reference data, in three languages.',
      summary: 'States, LGAs, 8,809 wards, banks and phone-number rules for Python, JavaScript and Go, plus a free REST API. Every record has a source, and every language gives the same answer.',
      categories: ['Open source', 'Data'], languages: ['Python', 'TypeScript', 'Go'],
      stack: ['Python', 'TypeScript', 'Go', 'Cloudflare Workers', 'django-naija'],
      facts: [['13,392', 'shared test cases'], ['8,809', 'wards'], ['4', 'published packages'], ['532', 'npm downloads, 12 Oct–10 Nov']],
      demo: 'https://naija-data.asgatcreation.workers.dev', code: 'https://github.com/asgatcreation/naija-data', demoLabel: 'Website',
      problem: 'Nigerian developers copy state and LGA lists from random blog posts, with no source and plenty of mistakes.',
      note: 'MIT for the code, CC BY 4.0 for the data.',
      art: ['naija-data', 'PYPI · NPM · GO'],
      features: ['Published on PyPI, npm and Go, plus django-naija for Django', '13,392 shared test cases run in every language', 'A source for every record', 'A free REST API on Cloudflare Workers'],
      shots: []
    },
    {
      id: 'taskflow', title: 'TaskFlow', color: '#8ab4ff',
      status: 'live', statusLabel: 'Live', year: '2026',
      tagline: 'Manage your day, one task at a time.',
      summary: 'A task manager with per-user accounts, priorities, deadlines with times, overdue detection and a clean dark interface, deployed with PostgreSQL.',
      categories: ['Productivity'], languages: ['Python'],
      stack: ['Django 5.0', 'Python 3.12', 'PostgreSQL', 'Gunicorn', 'Whitenoise', 'Render'],
      facts: [['3', 'priority levels'], ['4', 'search filters'], ['1', 'click deploy (render.yaml)']],
      demo: 'https://django-todo-app-8dio.onrender.com', code: 'https://github.com/asgatcreation/taskflow-app',
      problem: 'A simple product done properly: user isolation, deadlines, priorities and a real production deployment.',
      note: 'Free hosting: the first load can take about 30 seconds.',
      cover: I + 'taskflow/dashboard.jpg',
      features: ['Register, log in and only ever see your own tasks', 'Low, medium and high priorities with badges', 'Deadlines with an exact time, and overdue highlighting', 'Search and filter by keyword, status, priority and overdue', 'A live dashboard with clickable stat cards', 'A time trail: created, updated and completed'],
      shots: [['taskflow/landing.jpg', 'Landing page'], ['taskflow/dashboard.jpg', 'Dashboard'], ['taskflow/tasks.jpg', 'Task list with filters'], ['taskflow/task-form.jpg', 'Task form'], ['taskflow/admin.jpg', 'Admin dashboard']]
    },
    {
      id: 'curavia', title: 'Curavia', color: '#8ab4ff',
      status: 'dev', statusLabel: 'Milestone 6 of 15', progress: [6, 15], year: '2026',
      tagline: 'A hospital operating system, from front desk to pharmacy.',
      summary: 'Multi-hospital software where one hospital can never see another’s patients. A query that forgets its hospital crashes instead of leaking data.',
      categories: ['Health', 'Real-time'], languages: ['Python', 'TypeScript'],
      stack: ['Django 6.1', 'DRF', 'Channels', 'Celery', 'React 19', 'PostgreSQL 18 (RLS)', 'Redis'],
      facts: [['6/15', 'milestones done'], ['4', 'layers of tenant isolation']],
      demo: null, code: 'https://github.com/asgatcreation/curavia',
      problem: 'Hospital data is the worst thing to leak. Forgetting one filter in one query shouldn’t be enough to do it.',
      note: 'In development. Orders, safety checks and referrals are being built now.',
      art: ['Curavia', 'HOSPITAL OPERATING SYSTEM'],
      features: ['Four layers of tenant isolation, including PostgreSQL row-level security', 'A permissions matrix that generates its own tests', 'A hash-chained audit log that can’t be quietly edited', 'TenantScopeMissing: unscoped queries crash on purpose'],
      shots: []
    },
    {
      id: 'ojalive', title: 'Ojà Live', color: '#ff7a59',
      status: 'dev', statusLabel: 'Milestone 2 of 11', progress: [2, 11], year: '2026',
      tagline: 'Live auctions that pick the right winner every time.',
      summary: 'A live auction house built to pick the same winner at the same price, whatever order the bids arrive in.',
      categories: ['Real-time', 'Marketplace'], languages: ['TypeScript'],
      stack: ['Next.js 16', 'Fastify', 'Socket.IO', 'BullMQ', 'Redis Lua', 'PostgreSQL'],
      facts: [['2/11', 'milestones done']],
      demo: null, code: 'https://github.com/asgatcreation/ojalive',
      problem: 'When two bids land in the same millisecond, an auction must still be fair and repeatable.',
      note: 'In development. Load, race and chaos test results arrive in milestones 10 and 11.',
      art: ['Ojà Live', 'LIVE AUCTIONS'],
      features: ['Bid engine checked with property-based tests', 'Bid logic in Redis Lua scripts', 'Live bidding over Socket.IO', 'Design and architecture decisions written up front'],
      shots: []
    },
    {
      id: 'naijapay', title: 'naija-pay', color: '#3ddc97',
      status: 'pre', statusLabel: 'Pre-release · 5 of 11', progress: [5, 11], year: '2026',
      tagline: 'One typed interface to Nigerian payment providers.',
      summary: 'Write your payment code once and switch providers without rewriting it. Money is always whole kobo, never decimals.',
      categories: ['Fintech', 'Open source'], languages: ['TypeScript', 'Python'],
      stack: ['TypeScript', 'Python', 'Webhooks'],
      facts: [['5/11', 'milestones done'], ['1', 'adapter sandbox-verified']],
      demo: null, code: 'https://github.com/asgatcreation/naija-pay',
      problem: 'Every Nigerian payment provider has a different API, and floating-point money quietly loses kobo.',
      note: 'Pre-release. The Paystack adapter is sandbox-verified; a Flutterwave sandbox harness is being added.',
      art: ['naira(5_000)', 'ONE API · MANY PROVIDERS'],
      features: ['Integer kobo everywhere: naira(5_000) is 500000 kobo', 'Paystack adapter verified against the sandbox', 'Flutterwave next'],
      shots: []
    },
    {
      id: 'nei', title: 'Nigeria Economic Intelligence', color: '#b48cff',
      status: 'report', statusLabel: 'Report', year: '2026',
      tagline: 'Nigeria’s economy and labour market, 1991–2025.',
      summary: 'A reproducible analysis of growth, prices, work and population in Nigeria: 708 observations across 20 indicators.',
      categories: ['Data'], languages: ['Python', 'R'],
      stack: ['Python', 'R', 'PostgreSQL', 'Docker', 'Jupyter'],
      facts: [['708', 'observations'], ['20', 'indicators'], ['35', 'years covered']],
      demo: null, code: 'https://github.com/asgatcreation/nigeria-economic-intelligence',
      problem: 'Economic figures for Nigeria are scattered across sources. This brings them together in one reproducible place.',
      note: '', art: ['1991 → 2025', '708 OBSERVATIONS · 20 INDICATORS'],
      features: ['Growth, prices, work and population in one dataset', 'Analysis in Python and R', 'Stored in PostgreSQL, reproducible in Docker'],
      shots: []
    },
    {
      id: 'edunexus', title: 'EduNexus', color: '#ff9fd1',
      status: 'private', statusLabel: 'Private repository', year: '[[ADD]]',
      tagline: '[[ADD: one line on what EduNexus does]]',
      summary: '[[ADD: what EduNexus is, who it is for and what it solves. The code is private, so this page shows the story and screenshots, without a code link.]]',
      categories: ['Private'], languages: ['[[ADD]]'],
      stack: ['[[ADD: stack]]'],
      facts: [], demo: null, code: null,
      problem: '[[ADD: the problem]]', note: 'Private repository: the code isn’t public, but the details and screenshots can be.',
      art: ['EduNexus', 'PRIVATE · DETAILS COMING'],
      features: ['[[ADD: 3–6 key features]]'], shots: []
    }
  ];
  var articles = [
    { title: 'Two buyers, one car: locking rows in a Django checkout', tag: 'Engineering', from: 'CarHub', mins: 6 },
    { title: 'Why money should be whole kobo, never floats', tag: 'Fintech', from: 'naija-pay', mins: 5 },
    { title: 'A double-entry ledger for POS agents, explained simply', tag: 'Fintech', from: 'FloatBook', mins: 8 },
    { title: 'A query that forgets its hospital should crash', tag: 'Security', from: 'Curavia', mins: 7 },
    { title: '13,392 tests, three languages, one answer', tag: 'Open source', from: 'naija-data', mins: 6 },
    { title: 'Push a nudge, not the data: live updates over WebSockets', tag: 'Real-time', from: 'CarHub', mins: 7 }
  ];
  return { projects: projects, articles: articles };
})();
