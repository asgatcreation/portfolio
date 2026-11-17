/**
 * Content for the standing pages (/now/, /uses/, /research/, /lab/, /services/).
 * Every fact here comes from the CVs in public/cv, from a project README, or from the
 * project files in src/content/projects. Nothing is invented.
 */

/** /now/ — what is actually in progress. Change `nowUpdated` whenever this list changes. */
export const nowUpdated = '17 November 2026';

export interface NowItem {
  what: string;
  where: string;
  detail: string;
  link?: string;
}

export const nowWork: NowItem[] = [
  {
    what: 'Curavia',
    where: 'Health platform · milestone 6 of 15',
    detail:
      'Multi-tenant clinic software: four layers of tenant isolation, a permissions matrix that generates its own tests, and a hash-chained audit log.',
    link: '/work/curavia/',
  },
  {
    what: 'Ojà Live',
    where: 'Live auctions · milestone 2 of 11',
    detail:
      'A live bidding platform in a TypeScript monorepo. Design and decision records are written; the bid engine is being built against race conditions.',
    link: '/work/ojalive/',
  },
  {
    what: 'naija-pay',
    where: 'Open source · milestone 5 of 11',
    detail:
      'One payment interface for Nigerian providers. 25 providers researched, the webhook schemes written up, Paystack verified in sandbox.',
    link: '/work/naijapay/',
  },
  {
    what: 'This portfolio',
    where: 'Built in the open',
    detail: 'Built in the open as a static Astro site. The project pages, charts and case studies are live.',
  },
];

export const nowStudy: NowItem[] = [
  {
    what: 'MSc Statistics dissertation',
    where: 'University of Ibadan',
    detail: 'Modified Three-Parameter Rama Distribution and Its Applications.',
  },
  {
    what: 'Crop Cutting Pilot Survey',
    where: 'NBS × FAO · Team Lead',
    detail: 'Leading a field team on the pilot: enumerator training, plot measurement and data quality control.',
  },
  {
    what: 'AsgatArticles',
    where: 'Writing',
    detail: 'Writing up the hard parts of the projects above: row locking, ledgers, tenant isolation, kobo not floats.',
  },
];

/** /uses/ — grouped tools. Every one is used by a project on this site. */
export const usesGroups: [string, [string, string][]][] = [
  [
    'Languages',
    [
      ['Python', 'Django back ends, data pipelines, naija-data'],
      ['TypeScript', 'Ojà Live monorepo, naija-pay adapters, this site'],
      ['JavaScript', 'Browser code with no framework, naija-data for Node'],
      ['PHP', 'FloatBook on Laravel'],
      ['Go', 'The naija-data Go module'],
      ['R', 'Nigeria Economic Intelligence analysis'],
      ['Dart', 'Flutter work'],
      ['SQL', 'PostgreSQL schemas, migrations and reporting queries'],
    ],
  ],
  [
    'Back end',
    [
      ['Django & DRF', 'CarHub, Curavia, TaskFlow, FinanceFlow'],
      ['Laravel & Inertia', 'FloatBook'],
      ['Fastify', 'Ojà Live services'],
      ['NestJS', 'Scoreline API'],
      ['Django Channels', 'Live tracking in CarHub, live updates in Curavia'],
      ['Celery & BullMQ', 'Background jobs and scheduled work'],
    ],
  ],
  [
    'Front end',
    [
      ['Astro', 'This site: static pages, almost no JavaScript shipped'],
      ['Next.js', 'Ojà Live and Scoreline'],
      ['React', 'Curavia dashboard'],
      ['Vue 3', 'FloatBook screens through Inertia'],
      ['Tailwind CSS', 'FloatBook and Ojà Live'],
      ['Plain CSS', 'This site: tokens, grid and container queries by hand'],
    ],
  ],
  [
    'Data stores',
    [
      ['PostgreSQL', 'Every production project; row-level security in Curavia'],
      ['Redis', 'Queues, locks and live state in Ojà Live'],
      ['SQLite', 'Local development and small deployments'],
      ['Supabase', 'FinanceFlow database and auth'],
    ],
  ],
  [
    'Payments',
    [
      ['Paystack', 'CarHub checkout, verified webhooks with HMAC'],
      ['Flutterwave', 'naija-pay adapter'],
      ['Integer kobo', 'Money is never a float, in any project'],
    ],
  ],
  [
    'Testing',
    [
      ['pytest', '146 automated tests in CarHub'],
      ['Pest', 'FloatBook, with Larastan at level 7'],
      ['Playwright', 'Browser tests for FloatBook'],
      ['Property-based tests', 'The Ojà Live bid engine'],
      ['Shared test vectors', '13,392 cases run in Python, JavaScript and Go for naija-data'],
    ],
  ],
  [
    'Data science & statistics',
    [
      ['pandas & NumPy', 'Cleaning and shaping survey and economic data'],
      ['scikit-learn', 'Modelling and forecasting'],
      ['Stata & SPSS', 'Official statistics work at the NBS'],
      ['CSPro', 'CAPI questionnaires and field data collection'],
      ['LaTeX', 'Dissertations, reports and slides'],
      ['SageMath', 'Mathematics work'],
    ],
  ],
  [
    'Build & run',
    [
      ['Docker', 'Reproducible pipelines, including the economic data pipeline'],
      ['GitHub Actions', 'Tests and checks on every push, in every repository'],
      ['Cloudflare Workers & Pages', 'The naija-data site and API'],
      ['Render', 'The live demos of CarHub, FloatBook, TaskFlow and FinanceFlow'],
      ['Git', 'Small commits, a milestone plan in every repository'],
    ],
  ],
];

/** /research/ — findings from the Nigeria Economic & Labour Market Intelligence project and naija-data. */
export const neiFacts: [string, string][] = [
  ['708', 'observations'],
  ['20', 'indicators'],
  ['37', 'states + FCT'],
  ['67', 'tests on the pipeline'],
];

export const neiFindings: [string, string][] = [
  [
    'Income per person peaked in 2015',
    'Real GDP per head is 8.4% below its 2015 peak, so the average person is poorer than a decade ago even as the economy grows.',
  ],
  [
    'Low unemployment next to wide vulnerability',
    'Measured unemployment is 3.1%, while 66.5% of workers are in vulnerable employment. The headline rate hides how the work is paid.',
  ],
  [
    'Manufacturing has thinned out',
    'Manufacturing fell from 19.5% of GDP to 8.3%, so growth has come from sectors that employ fewer people per naira.',
  ],
];

export const naijaDataFacts: [string, string][] = [
  ['37', 'states'],
  ['774', 'local governments'],
  ['8,809', 'wards'],
  ['899', 'bank codes'],
];
