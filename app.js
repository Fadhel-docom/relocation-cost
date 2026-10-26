(() => {
  const form = document.getElementById('budget-form');
  if (!form) return;
  const costInputs = [...form.querySelectorAll('[data-cost]')];
  const currencySelect = document.getElementById('currency');
  const bufferInput = document.getElementById('buffer');
  const bufferValue = document.getElementById('buffer-value');
  const currencyLocales = {USD:'en-US',EUR:'de-DE',GBP:'en-GB',TND:'fr-TN',CAD:'en-CA',AUD:'en-AU',AED:'en-AE'};
  const getNumber = (key) => {
    const input = costInputs.find(el => el.dataset.cost === key);
    const value = input ? Number(input.value) : 0;
    return Number.isFinite(value) && value > 0 ? value : 0;
  };
  const sum = keys => keys.reduce((total, key) => total + getNumber(key), 0);
  const money = value => {
    try {
      return new Intl.NumberFormat(currencyLocales[currencySelect.value] || 'en-US', {
        style: 'currency', currency: currencySelect.value, maximumFractionDigits: 2
      }).format(value);
    } catch (_) { return currencySelect.value + ' ' + value.toFixed(2); }
  };
  const write = (id, value) => { document.getElementById(id).textContent = value; };
  function update() {
    const oneTime = sum(['travel','shipping','paperwork','deposit','temporary','setup','otherOnce']);
    const monthly = sum(['rent','utilities','food','transport','health','otherMonthly']);
    const buffer = oneTime * Number(bufferInput.value) / 100;
    const upfront = oneTime + buffer;
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    write('buffer-value', bufferInput.value);
    write('total-once', money(oneTime));
    write('total-buffer', money(buffer));
    write('total-upfront', money(upfront));
    write('total-monthly', money(monthly));
    write('total-first', money(upfront + monthly));
    write('result-route', origin || destination ? (origin || 'Your origin') + ' → ' + (destination || 'Your destination') : 'Your next chapter');
  }
  costInputs.forEach(input => input.addEventListener('input', update));
  ['origin','destination'].forEach(id => document.getElementById(id).addEventListener('input', update));
  currencySelect.addEventListener('change', update);
  bufferInput.addEventListener('input', update);
  document.getElementById('reset-button').addEventListener('click', () => {
    costInputs.forEach(input => { input.value = ''; });
    document.getElementById('origin').value = '';
    document.getElementById('destination').value = '';
    bufferInput.value = '10';
    currencySelect.value = 'USD';
    update();
  });
  document.getElementById('download-button').addEventListener('click', () => {
    const oneTime = sum(['travel','shipping','paperwork','deposit','temporary','setup','otherOnce']);
    const monthly = sum(['rent','utilities','food','transport','health','otherMonthly']);
    const buffer = oneTime * Number(bufferInput.value) / 100;
    const origin = document.getElementById('origin').value.trim() || 'Not specified';
    const destination = document.getElementById('destination').value.trim() || 'Not specified';
    const rows = [
      ['Relocation Cost Budget'],['Origin', origin],['Destination', destination],['Currency', currencySelect.value],[],
      ['ONE-TIME COSTS','Amount'],
      ['Travel',getNumber('travel')],['Shipping & moving',getNumber('shipping')],['Visa & paperwork',getNumber('paperwork')],
      ['Rental deposit',getNumber('deposit')],['Temporary stay',getNumber('temporary')],['Furniture & setup',getNumber('setup')],
      ['Other one-time costs',getNumber('otherOnce')],['One-time subtotal',oneTime],['Safety buffer (' + bufferInput.value + '%)',buffer],['Estimated cash needed to move',oneTime+buffer],[],
      ['MONTHLY COSTS','Amount'],['Rent / housing',getNumber('rent')],['Utilities & internet',getNumber('utilities')],
      ['Food & groceries',getNumber('food')],['Transport',getNumber('transport')],['Health & insurance',getNumber('health')],
      ['Other monthly costs',getNumber('otherMonthly')],['Estimated monthly living costs',monthly],['First month planning total',oneTime+buffer+monthly],[],
      ['Note','User-entered estimates only. Verify costs with providers and official sources.']
    ];
    const csv = rows.map(row => row.map(cell => {
      const value = String(cell ?? '');
      return '"' + value.replace(/"/g, '""') + '"';
    }).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'relocation-budget.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  update();
})();