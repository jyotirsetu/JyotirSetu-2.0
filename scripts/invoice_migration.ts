import {
  ensureInvoicesTable,
  ensureInvoiceItemsTable,
  ensureServicesTable,
  ensureInvoicePaymentsTable,
  ensureLedgerTable,
} from '../src/lib/turso';

async function run() {
  await ensureInvoicesTable();
  await ensureInvoiceItemsTable();
  await ensureServicesTable();
  await ensureInvoicePaymentsTable();
  await ensureLedgerTable();
  process.stdout.write('Invoice migration completed\n');
}

run().catch((e) => {
  process.stderr.write(String(e) + '\n');
  process.exit(1);
});
