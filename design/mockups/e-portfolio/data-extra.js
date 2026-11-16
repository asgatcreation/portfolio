// Extra detail for every project, plus profile, journey and contact settings.
// Sources: project READMEs and the CVs in design/mockups/shared/cv (Nov 2026).
// Complexity scores are self-assessed (1–5) and labelled that way on the page; adjust freely.
(function (D) {
  var R = ['Data model', 'Real-time', 'Money & payments', 'Security', 'Integrations', 'UX & offline'];
  var X = {
    carhub: {
      industry: 'Automotive · E-commerce',
      why: 'Buying a car online in Nigeria usually means scrolling unverified listings, then wiring money to a stranger. I built CarHub to follow how a car sale really happens (reserve, inspect, then pay) and to prove I can ship a complete marketplace: buyers, sellers, vendors, drivers and staff in one product.',
      hard: [['Two buyers, one car', 'Checkout locks the car rows inside a transaction, so a second buyer is told the car has just gone. Nobody is charged for a car that is already taken.'], ['Live trips that never freeze', 'Every status change is pushed over WebSockets the moment it is committed; if the socket drops, the page reconnects with backoff and falls back to polling.'], ['Prices you can’t fake', 'Ride fares are always recomputed on the server from the real road route, never trusted from the browser.'], ['Parts that really fit', 'Each product is matched against the buyer’s saved make, model and year, and stock rows are locked so nothing is oversold.']],
      radar: [4, 5, 4, 4, 5, 4],
      arch: { 'Users & devices': ['Buyer browser / PWA', 'Seller & vendor dashboards', 'Driver phone (live GPS)', 'Staff console'], 'Application': ['Django 5.2 views', 'Django Channels (WebSockets)', 'Dispatch & pricing', 'Emails & one-time codes'], 'Data': ['PostgreSQL', 'Row locks on checkout'], 'Services': ['Paystack', 'Google sign-in', 'Brevo email', 'OSRM routes', 'Photon search', 'OpenStreetMap'] },
      flow: ['Find a car', 'Reserve with ₦250,000 deposit', 'Seller confirms inspection', 'Inspect in person', 'Pay balance or get refund']
    },
    floatbook: {
      industry: 'Fintech · Agent banking',
      why: 'POS owners run their shops from a notebook and a WhatsApp group: cash goes missing, failed transactions are forgotten, and the owner can’t see today’s profit without being there. FloatBook gives them a proper back office that works on a cheap phone, even offline.',
      hard: [['A ledger that always balances', 'Every figure sits on a double-entry ledger checked by the database itself. Nothing is edited or deleted in place; mistakes are voided or reversed and both sides stay.'], ['Offline without double-counting', 'Entries are kept on the phone when the network drops and sent once it returns, never twice.'], ['A day that closes for good', 'The blind end-of-day count closes the day permanently; any difference needs a supervisor’s approval.'], ['Security for money', '2FA and passkeys with Laravel Fortify, four roles, and static analysis at Larastan level 7.']],
      radar: [5, 3, 5, 5, 3, 5],
      arch: { 'Users & devices': ['Agent phone (offline PWA)', 'Owner dashboard', 'Supervisor & accountant'], 'Application': ['Laravel 13 + Inertia', 'Vue 3 + TypeScript', 'Queue worker & scheduler', 'Fortify: 2FA, passkeys'], 'Data': ['PostgreSQL 17 (Neon)', 'Double-entry ledger'], 'Services': ['Brevo email', 'Provider statements (CSV/Excel)'] },
      flow: ['Record a sale', 'Float updates live', 'Blind end-of-day count', 'Supervisor approves gaps', 'Owner gets the daily email']
    },
    financeflow: {
      industry: 'Personal finance',
      why: 'Managing money across several currencies usually means converting everything by hand. I built FinanceFlow so naira, dollars and euros each stay in their own currency, with budgets, charts and reports that never blend them.',
      hard: [['Never mixing currencies', 'Totals, KPIs, budgets and charts are all computed per currency, so ₦ and $ never land in one sum.'], ['Reports people can use', '12-month trends, 6-month predictions with a weighted moving average, and PDF, CSV and Excel exports.'], ['Your data only', 'Email or Google sign-in, with every query scoped to the signed-in user.']],
      radar: [3, 1, 3, 3, 2, 4],
      arch: { 'Users & devices': ['Browser (desktop & phone)'], 'Application': ['Django 5', 'Chart.js dashboards', 'PDF & Excel export'], 'Data': ['PostgreSQL (Supabase)'], 'Services': ['Google OAuth', 'Render hosting'] },
      flow: ['Sign up', 'Pick currencies', 'Log transactions', 'Watch charts update', 'Export reports']
    },
    taskflow: {
      industry: 'Productivity',
      why: 'A simple product done properly. TaskFlow shows a complete, production-ready Django workflow, from local development to a live deployment with PostgreSQL, user isolation, deadlines and priorities.',
      hard: [['Per-user isolation', 'Every task belongs to one account and every query is scoped to it.'], ['Production setup', 'Gunicorn, Whitenoise, HSTS and a one-file Render blueprint.']],
      radar: [2, 1, 1, 2, 1, 3],
      arch: { 'Users & devices': ['Browser'], 'Application': ['Django 5', 'Gunicorn + Whitenoise'], 'Data': ['PostgreSQL'], 'Services': ['Render'] },
      flow: ['Register', 'Add tasks', 'Set priority & deadline', 'Track overdue', 'Complete']
    },
    naijadata: {
      industry: 'Developer tools · Public data',
      why: 'Nigerian apps need states, LGAs, wards, banks and phone rules, and most lists online have no source. As a statistician I wanted reference data with a source for every record, giving the same answer in every language.',
      hard: [['One truth, three languages', '13,392 shared test cases run in CI against Python, JavaScript and Go, so every package returns identical results.'], ['8,809 wards', 'The finest level of Nigerian geography, each record with a source.'], ['Four packages, one release', 'PyPI, npm, Go modules and django-naija, plus a free REST API on Cloudflare Workers.']],
      radar: [4, 1, 1, 2, 5, 2],
      arch: { 'Users & devices': ['Python apps', 'JavaScript / TS apps', 'Go services', 'Django forms & models'], 'Application': ['Shared dataset', '13,392 shared tests'], 'Data': ['Sourced records'], 'Services': ['PyPI', 'npm', 'Go modules', 'REST API on Workers'] },
      chart: { type: 'bars', title: 'What’s inside', note: 'Records per level (log scale)', log: true, rows: [['States + FCT', 37], ['LGAs', 774], ['Wards', 8809], ['Shared tests', 13392]] }
    },
    curavia: {
      industry: 'HealthTech',
      why: 'Hospital records are the worst thing to leak. Curavia is a hospital operating system for Nigerian hospitals, from front desk and triage to lab, pharmacy, billing and wards, built so one forgotten filter can never expose another hospital’s patients.',
      hard: [['Four layers of tenant isolation', 'Including PostgreSQL row-level security; a query with no hospital scope crashes with TenantScopeMissing.'], ['Permissions that test themselves', 'A role-by-action matrix generates the permission tests.'], ['An audit log you can trust', 'Hash-chained, so a quiet edit breaks the chain.'], ['Mandatory 2FA', 'For every staff account.']],
      radar: [5, 4, 3, 5, 3, 4],
      arch: { 'Users & devices': ['Front desk & triage', 'Doctors, lab & pharmacy', 'Billing & wards'], 'Application': ['Django 6.1 + DRF', 'React 19', 'Channels (live)', 'Celery workers'], 'Data': ['PostgreSQL 18 + RLS', 'Redis', 'Hash-chained audit log'], 'Services': [] }
    },
    ojalive: {
      industry: 'E-commerce · Real-time',
      why: 'When two bids land in the same millisecond, a live auction must still pick the same winner at the same price every time. Ojà Live is built to prove that under load, races and failures.',
      hard: [['Order-independent bidding', 'Bid logic runs in Redis Lua scripts and is checked with property-based tests.'], ['Proof, not promises', 'Load, race and chaos test results are planned for milestones 10 and 11.']],
      radar: [3, 5, 4, 3, 2, 3],
      arch: { 'Users & devices': ['Bidders (Next.js 16)', 'Sellers'], 'Application': ['Fastify API', 'Socket.IO gateway', 'BullMQ jobs'], 'Data': ['Redis + Lua bid engine', 'PostgreSQL'], 'Services': [] }
    },
    naijapay: {
      industry: 'Fintech · Developer tools',
      why: 'Every Nigerian payment provider has a different API, and floating-point money quietly loses kobo. naija-pay gives one typed interface for collections, virtual accounts, split payments, payouts and webhooks.',
      hard: [['Whole kobo only', 'naira(5_000) is 500000 kobo: integers everywhere, never floats.'], ['Webhook signature checks', 'Every provider’s webhook is verified before it is trusted.'], ['Sandbox-verified', 'The Paystack adapter passes against the real sandbox; Flutterwave is next.']],
      radar: [3, 1, 5, 4, 5, 1],
      arch: { 'Users & devices': ['Your app (TypeScript or Python)'], 'Application': ['naija-pay typed interface', 'Webhook verification'], 'Data': [], 'Services': ['Paystack', 'Flutterwave', 'More providers'] }
    },
    nei: {
      industry: 'Economics · Public policy',
      summary: 'A reproducible analysis of Nigeria’s economy and labour market from 1991 to 2025: 898 observations across 25 indicators, national and for all 36 states plus the FCT.',
      facts: [['898', 'observations'], ['25', 'indicators'], ['37', 'states + FCT'], ['35', 'years covered']],
      why: 'Economic figures for Nigeria are scattered across sources. I brought them together through validated, tracked imports with a full revision history, so the evidence for policy can be checked and rerun.',
      hard: [['Validated, tracked imports', 'Every load is checked and recorded with a revision history.'], ['National and state level', 'All 36 states plus the FCT, side by side.'], ['Clear findings', 'GDP per capita is still 8.4% below its 2015 peak.']],
      radar: [5, 1, 1, 2, 3, 2],
      arch: { 'Users & devices': ['Report readers', 'Analysts'], 'Application': ['Validated imports (Python)', 'Analysis (Python & R)'], 'Data': ['PostgreSQL + revision history'], 'Services': ['Official statistics sources', 'Docker'] },
      chart: { type: 'bars', title: 'Key findings', note: 'Per cent, from the analysis', rows: [['Vulnerable employment', 66.5], ['Measured unemployment', 3.1], ['Poverty: Bauchi', 75.4], ['Poverty: Lagos', 1.1]], unit: '%', max: 100 },
      chart2: { type: 'bars', title: 'Poverty vs age dependency', note: 'Correlation (r)', rows: [['North', 0.86], ['South', 0.07]], max: 1 }
    },
    edunexus: { industry: 'EdTech', categories: ['EdTech', 'Private'], why: '[[ADD: why you built EduNexus]]', hard: [], radar: null, arch: null },
    scoreline: null, authwiki: null
  };
  D.projects.forEach(function (p) { var x = X[p.id]; if (x) Object.keys(x).forEach(function (k) { p[k] = x[k]; }); });
  var nei = D.projects.filter(function (p) { return p.id === 'nei'; })[0];
  if (nei) { nei.art = ['1991 → 2025', '898 OBSERVATIONS · 25 INDICATORS']; nei.tagline = 'Nigeria’s economy and labour market, 1991–2025.'; }
  D.projects.push(
    { id: 'scoreline', title: 'Scoreline', color: '#5fd4ff', status: 'dev', statusLabel: 'In development', year: '2026', industry: 'Sports · Real-time',
      tagline: 'Real-time football live scores.', summary: 'Match timelines, line-ups and league tables pushed to fans the moment they change, over WebSockets.',
      categories: ['Real-time', 'Sports'], languages: ['TypeScript'], stack: ['Next.js 16', 'NestJS', 'Socket.IO', 'Prisma', 'PostgreSQL'], facts: [],
      demo: null, code: 'https://github.com/asgatcreation/scoreline', problem: 'Fans want the goal on their screen the second it happens, not after a refresh.',
      why: 'To build a live, push-first product where many viewers watch the same changing data at once.', note: 'In development; the demo is coming.',
      art: ['2 – 1', 'LIVE SCORES'], features: ['Live match timelines', 'Line-ups and tables', 'Updates pushed over WebSockets'], shots: [],
      hard: [['Fan-out', 'One goal event must reach every viewer instantly.']], radar: [3, 5, 1, 2, 3, 3],
      arch: { 'Users & devices': ['Fans (Next.js 16)'], 'Application': ['NestJS API', 'Socket.IO'], 'Data': ['Prisma + PostgreSQL'], 'Services': [] } },
    { id: 'authwiki', title: 'Auth Wiki', color: '#c9a7ff', status: 'team', statusLabel: 'Team project', year: '2022–23', industry: 'EdTech · Developer learning',
      tagline: 'An authentication knowledge base, built as a team.', summary: 'Built with Team Parrot during the Zuri full-stack programme with Ingressive for Good (I4G): a frontend with a Python/Django backend.',
      categories: ['EdTech', 'Team'], languages: ['Python', 'JavaScript'], stack: ['Django', 'Python', 'HTML & CSS', 'JavaScript'], facts: [],
      demo: null, code: 'https://github.com/asgatcreation/Auth_wiki-Team-Parrot', problem: 'Developers learning authentication need one clear place to read about it.',
      why: 'A team project in the Zuri × I4G programme: learning to ship with others, review code and split work.', note: 'Team project. [[ADD: your exact role]]',
      art: ['Auth Wiki', 'TEAM PARROT · ZURI × I4G'], features: ['Authentication knowledge base', 'Built in a team', 'Django backend'], shots: [], hard: [], radar: null, arch: null }
  );
  D.radarAxes = R;
  D.cvs = [
    ['General CV', 'Everything in two pages', 'Akanji_Oluwaseun_CV_General.pdf'],
    ['General CV (full)', 'The complete record', 'Akanji_Oluwaseun_CV_General_Full.pdf'],
    ['Software Engineer CV', 'Full-stack, APIs, payments', 'Akanji_Oluwaseun_CV_Software_Engineer.pdf'],
    ['Data Scientist CV', 'Analysis, ML, research', 'Akanji_Oluwaseun_CV_Data_Scientist.pdf'],
    ['Statistician CV', 'Surveys, official statistics', 'Akanji_Oluwaseun_CV_Statistician.pdf']
  ];
  D.contact = { email: 'asgatcreation@gmail.com', whatsapp: '2348160948723', phone: '+234 816 094 8723',
    // Booking hours are a suggestion: change them to the times you really take calls.
    slots: ['10:00', '12:00', '14:00', '16:00'], days: 14 };
})(window.PORTFOLIO);
