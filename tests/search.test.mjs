// What the search box is expected to do. These are the queries a real visitor types.
import test from 'node:test';
import assert from 'node:assert/strict';
import { norm, prepare, rank } from '../src/scripts/search-core.js';

const index = prepare([
  {
    g: 'Projects',
    t: 'CarHub',
    s: 'Live · Marketplace, Fintech',
    u: '/work/carhub/',
    i: 'C',
    body: 'Reserve a car online with a refundable deposit, inspect it in person, then pay the balance. Checkout locks the car rows inside a transaction.',
  },
  {
    g: 'Projects',
    t: 'Curavia',
    s: 'In development · Health',
    u: '/work/curavia/',
    i: 'C',
    body: 'Four layers of tenant isolation, including PostgreSQL row-level security, and a hash-chained audit log.',
  },
  {
    g: 'Projects',
    t: 'Ojà Live',
    s: 'In development · Real-time',
    u: '/work/ojalive/',
    i: 'O',
    body: 'Live auctions that pick the right winner every time.',
  },
  {
    g: 'Pages',
    t: 'Now',
    s: 'What I am working on this month',
    u: '/now/',
    i: '◑',
    body: 'Curavia: tenant isolation and a hash-chained audit log. Writing up row locking and ledgers.',
  },
  {
    g: 'AsgatArticles',
    t: 'Why money should be whole kobo, never floats',
    s: 'Fintech · from naija-pay',
    u: '/writing/',
    i: '✎',
    body: 'article writing asgatarticles',
  },
]);

const titles = (q, n = 3) => rank(index, q, n).map((h) => h.item.t);

test('a title match beats a mention in the body', () => {
  assert.equal(titles('carhub')[0], 'CarHub');
});

test('accents do not have to be typed', () => {
  assert.equal(titles('oja')[0], 'Ojà Live');
  assert.equal(titles('ojà')[0], 'Ojà Live');
});

test('the project that does the thing beats the page that mentions it', () => {
  assert.equal(titles('tenant isolation')[0], 'Curavia');
  assert.equal(titles('audit log')[0], 'Curavia');
});

test('words typed together are treated as a phrase', () => {
  // FinanceFlow-style entries contain both words apart; only CarHub says "in person".
  assert.equal(titles('in person')[0], 'CarHub');
});

test('every word must match, not just one of them', () => {
  assert.deepEqual(titles('curavia kobo'), []);
});

test('a query that matches nothing returns nothing', () => {
  assert.deepEqual(titles('zzzqqq'), []);
});

test('an empty query lists everything, in the order given', () => {
  assert.equal(rank(index, '', 50).length, index.length);
  assert.equal(rank(index, '   ', 50)[0].item.t, 'CarHub');
});

test('a body-only match explains itself, and the snippet is readable', () => {
  const hit = rank(index, 'refundable deposit', 1)[0];
  assert.equal(hit.item.t, 'CarHub');
  assert.ok(hit.where.includes('refundable deposit'), `snippet was: ${hit.where}`);
  // The snippet is cut out of the original text, so it must not be mangled or mis-aligned.
  assert.ok(hit.item.body.includes(hit.where.replace(/^…|…$/g, '')), `snippet was: ${hit.where}`);
});

test('a title match needs no explanation', () => {
  assert.equal(rank(index, 'curavia', 1)[0].where, '');
});

test('the limit is respected', () => {
  assert.equal(rank(index, 'a', 2).length <= 2, true);
});

test('normalising folds case, accents and punctuation', () => {
  assert.equal(norm('Ojà  Live!'), 'oja live');
  assert.equal(norm('naija-pay'), 'naija-pay');
});
