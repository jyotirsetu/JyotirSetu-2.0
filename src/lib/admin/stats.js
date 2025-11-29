export function computeQuotesTotals(byStatusRows) {
  const list = Array.isArray(byStatusRows) ? byStatusRows : [];
  let amount = 0;
  let count = 0;
  for (const r of list) {
    const s = String(r.status || '');
    const a = Number(r.amount || 0);
    const c = Number(r.count || 0);
    count += c;
    if (s !== 'Cancelled') amount += a;
  }
  if (!isFinite(amount) || amount < 0) amount = 0;
  return { count, amount };
}
