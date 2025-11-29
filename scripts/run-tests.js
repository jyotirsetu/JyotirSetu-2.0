import assert from 'node:assert/strict';
import { computeQuotesTotals } from '../src/lib/admin/stats.js';
import { formatLocationFromIpApi } from '../src/lib/admin/geo.js';

function testComputeQuotesTotals(){
  const rows = [
    { status: 'Created', amount: 1000, count: 2 },
    { status: 'Purchased', amount: 500, count: 1 },
    { status: 'Cancelled', amount: 200, count: 1 },
  ];
  const t = computeQuotesTotals(rows);
  assert.equal(t.count, 4);
  assert.equal(t.amount, 1500);
  const t2 = computeQuotesTotals([{ status: 'Cancelled', amount: 999, count: 5 }]);
  assert.equal(t2.amount, 0);
}

function testFormatLocation(){
  const j = { city: 'Delhi', region: 'Delhi', country_name: 'India' };
  const s = formatLocationFromIpApi(j);
  assert.equal(s, 'Delhi, Delhi, India');
  const j2 = { city: '', region_code: 'HR', country: 'IN' };
  const s2 = formatLocationFromIpApi(j2);
  assert.equal(s2, 'HR, IN');
}

function run(){
  testComputeQuotesTotals();
  testFormatLocation();
  console.log('All tests passed');
}

run();
