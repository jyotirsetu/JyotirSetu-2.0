import { getTursoClient } from '../src/lib/turso';

async function run() {
  const client = await getTursoClient();
  await client.execute(`DROP TABLE IF EXISTS ledger_entries;`);
  await client.execute(`DROP TABLE IF EXISTS invoice_payments;`);
  await client.execute(`DROP TABLE IF EXISTS invoice_items;`);
  await client.execute(`DROP TABLE IF EXISTS invoices;`);
  await client.execute(`DROP TABLE IF EXISTS services;`);
  process.stdout.write('Invoice rollback completed\n');
}

run().catch((e) => {
  process.stderr.write(String(e) + '\n');
  process.exit(1);
});
