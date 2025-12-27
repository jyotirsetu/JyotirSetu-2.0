
import { getTursoClient } from '../src/lib/turso';

async function main() {
  try {
    console.log('Connecting to database...');
    const db = await getTursoClient();
    
    // 1. Find client
    const email = 'blnlyt3@gmail.com';
    const phone = '9414159238';
    
    console.log(`Searching for client with email "${email}" or phone "${phone}"...`);
    
    // Try email first
    let clientRes = await db.execute({
      sql: `SELECT id, name, email FROM clients WHERE email = ?`,
      args: [email]
    });
    
    // If not found, try phone
    if (clientRes.rows.length === 0) {
      console.log('Not found by email, trying phone...');
      clientRes = await db.execute({
        sql: `SELECT id, name, email FROM clients WHERE phone LIKE ?`,
        args: [`%${phone}%`]
      });
    }
    
    if (clientRes.rows.length === 0) {
      console.error('❌ Client not found. Please ensure you are connected to the correct database.');
      return;
    }
    
    const client = clientRes.rows[0];
    const clientId = String(client.id);
    console.log(`✅ Found client: ${client.name} (${client.email}) - ID: ${clientId}`);
    
    // 2. Find payments of 2100
    console.log('Searching for payments of ₹2100...');
    const paymentsRes = await db.execute({
      sql: `SELECT id, amount, created_at, note FROM payments WHERE client_id = ? AND amount = 2100 ORDER BY created_at DESC`,
      args: [clientId]
    });
    
    const payments = paymentsRes.rows;
    console.log(`Found ${payments.length} payments of ₹2100:`);
    payments.forEach(p => console.log(`- ID: ${p.id}, Created: ${p.created_at}, Note: ${p.note}`));
    
    if (payments.length < 2) {
      console.log('⚠️ Less than 2 payments found. No duplicates to delete.');
      return;
    }
    
    // 3. Delete the most recent one (duplicate)
    const toDelete = payments[0]; // Most recent because of ORDER BY DESC
    console.log(`\n🗑️ Deleting duplicate payment ID: ${toDelete.id} created at ${toDelete.created_at}`);
    
    await db.execute({
      sql: `DELETE FROM payments WHERE id = ?`,
      args: [String(toDelete.id)]
    });
    console.log('✅ Payment deleted from payments table.');
    
    // 4. Find and delete corresponding ledger entry
    console.log('Searching for corresponding ledger entries...');
    const ledgerRes = await db.execute({
      sql: `SELECT id, amount, created_at FROM ledger_entries WHERE client_id = ? AND amount = 2100 ORDER BY created_at DESC`,
      args: [clientId]
    });
    
    const ledgers = ledgerRes.rows;
    console.log(`Found ${ledgers.length} ledger entries of ₹2100:`);
    ledgers.forEach(l => console.log(`- ID: ${l.id}, Created: ${l.created_at}`));
    
    if (ledgers.length >= 2) {
       const ledgerToDelete = ledgers[0]; // Most recent
       console.log(`\n🗑️ Deleting duplicate ledger entry ID: ${ledgerToDelete.id}`);
       await db.execute({
         sql: `DELETE FROM ledger_entries WHERE id = ?`,
         args: [String(ledgerToDelete.id)]
       });
       console.log('✅ Ledger entry deleted.');
    } else {
      console.log('⚠️ Could not confidently identify duplicate ledger entry (count < 2). Skipping ledger deletion.');
    }
    
    console.log('\n✨ Cleanup complete.');
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

main();
