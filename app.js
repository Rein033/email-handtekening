/* E-mailhandtekening: tabellen + inline stijlen, want mailprogramma's negeren gewone CSS */
const VELDEN = [['naam', 'Naam'], ['functie', 'Functie'], ['bedrijf', 'Bedrijf'], ['afdeling', 'Afdeling'], ['tel', 'Telefoon'], ['mobiel', 'Mobiel'],
  ['email', 'E-mail'], ['web', 'Website'], ['adres', 'Adres', 'Straat 1, 1234 AB Plaats'], ['linkedin', 'LinkedIn', 'linkedin.com/in/...'],
  ['foto', 'Foto (link naar afbeelding)', 'https://...'], ['logo', 'Logo (link naar afbeelding)', 'https://...'], ['extra', 'Eigen regel', 'bijv. Werkdagen: ma t/m do', true]];
const KLEUREN = ['#1e88e5', '#039be5', '#00897b', '#43a047', '#7e57c2', '#d81b60', '#e53935', '#ef6c00', '#455a64', '#212121'];
const VOORBEELD = { naam: 'Sanne de Vries', functie: 'Projectcoördinator', bedrijf: 'Voorbeeld B.V.', tel: '030 123 45 67', email: 'sanne@voorbeeld.nl', web: 'voorbeeld.nl' };
const d = opslag.lees('sig.v1', { ...VOORBEELD, stijl: 'modern', kleur: '#1e88e5', fotorond: true, tekst: false });

$('#velden').innerHTML = VELDEN.map(([k, l, ph = '', wide]) => `<div class="fld${wide || k === 'adres' ? ' wide' : ''}"><label>${l}</label><input data-k="${k}" value="${esc(d[k] || '')}" placeholder="${esc(ph)}"></div>`).join('');
$('#kleuren').innerHTML = KLEUREN.map((k) => `<button type="button" class="sw" style="background:${k}" data-c="${k}"></button>`).join('') + `<input type="color" id="eigen" title="Eigen kleur">`;

const url = (u) => !u ? '' : /^(https?:|mailto:|tel:)/i.test(u) ? u : 'https://' + u.replace(/^\/+/, '');
const zonder = (u) => u.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
const veilig = (u) => /^https:\/\//i.test(url(u)) ? url(u) : '';

function html() {
  const c = d.kleur, e = (k) => esc(d[k] || ''), font = d.stijl === 'klassiek' ? "Georgia,'Times New Roman',serif" : 'Arial,Helvetica,sans-serif';
  const lbl = (ic, t) => d.tekst ? `<span style="color:${c};font-weight:bold">${t}</span>&nbsp;` : `<span style="color:${c}">${ic}</span>&nbsp;`;
  const link = (h, t) => `<a href="${esc(h)}" style="color:#333333;text-decoration:none">${esc(t)}</a>`;
  const regels = [
    d.tel && lbl('&#9742;', 'T:') + link('tel:' + d.tel.replace(/[^\d+]/g, ''), d.tel),
    d.mobiel && lbl('&#128241;', 'M:') + link('tel:' + d.mobiel.replace(/[^\d+]/g, ''), d.mobiel),
    d.email && lbl('&#9993;', 'E:') + link('mailto:' + d.email, d.email),
    d.web && lbl('&#127760;', 'W:') + link(url(d.web), zonder(d.web)),
    d.adres && lbl('&#128205;', 'A:') + e('adres'),
    d.linkedin && lbl('in', 'in:') + link(url(d.linkedin), zonder(d.linkedin)),
  ].filter(Boolean);
  const foto = veilig(d.foto) ? `<img src="${esc(veilig(d.foto))}" alt="${e('naam')}" width="84" height="84" style="display:block;width:84px;height:84px;border-radius:${d.fotorond ? '50%' : '8px'};object-fit:cover">` : '';
  const logo = veilig(d.logo) ? `<img src="${esc(veilig(d.logo))}" alt="${e('bedrijf')}" height="36" style="display:block;height:36px;width:auto;margin-top:10px">` : '';
  const sub = [d.functie, d.afdeling].filter(Boolean).map(esc).join(' · ');
  const naam = d.naam ? `<div style="font-size:17px;font-weight:bold;color:${d.stijl === 'minimaal' ? '#111111' : c};line-height:1.3">${e('naam')}</div>` : '';
  const functie = sub || d.bedrijf ? `<div style="font-size:13px;color:#555555;${d.stijl === 'klassiek' ? 'font-style:italic;' : ''}line-height:1.4">${sub}${sub && d.bedrijf ? ' · ' : ''}${d.bedrijf ? `<b>${e('bedrijf')}</b>` : ''}</div>` : '';
  const contact = regels.length ? `<div style="font-size:12px;color:#333333;line-height:1.7;margin-top:8px">${d.stijl === 'minimaal' ? regels.join('&nbsp;&nbsp;|&nbsp;&nbsp;') : regels.join('<br>')}</div>` : '';
  const extra = d.extra ? `<div style="font-size:11px;color:#777777;margin-top:8px">${e('extra')}</div>` : '';
  const tekst = naam + functie + contact + logo + extra;
  if (d.stijl === 'klassiek') return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font};border-top:2px solid ${c};padding-top:10px"><tr>${foto ? `<td style="padding:10px 16px 0 0;vertical-align:top">${foto}</td>` : ''}<td style="padding-top:10px;vertical-align:top;font-family:${font}">${tekst}</td></tr></table>`;
  if (d.stijl === 'minimaal') return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font}"><tr>${foto ? `<td style="padding-right:14px;vertical-align:top">${foto}</td>` : ''}<td style="vertical-align:top;font-family:${font}">${tekst}</td></tr></table>`;
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${font}"><tr>${foto ? `<td style="padding-right:16px;vertical-align:top">${foto}</td>` : ''}<td style="border-left:3px solid ${c};padding-left:14px;vertical-align:top;font-family:${font}">${tekst}</td></tr></table>`;
}

function teken() {
  $('#sig').innerHTML = html();
  $$('#stijl button').forEach((b) => b.classList.toggle('on', b.dataset.v === d.stijl));
  $$('.sw').forEach((b) => b.classList.toggle('sel', b.dataset.c === d.kleur));
  $('#eigen').value = d.kleur; $('#fotorond').checked = d.fotorond; $('#iconen').checked = d.tekst;
  opslag.schrijf('sig.v1', d);
}
$('#velden').oninput = (e) => { if (e.target.dataset.k) { d[e.target.dataset.k] = e.target.value.trim(); teken(); } };
$('#stijl').onclick = (e) => { const b = e.target.closest('button'); if (b) { d.stijl = b.dataset.v; teken(); } };
$('#kleuren').onclick = (e) => { const b = e.target.closest('.sw'); if (b) { d.kleur = b.dataset.c; teken(); } };
$('#eigen').oninput = (e) => { d.kleur = e.target.value; teken(); };
$('#fotorond').onchange = (e) => { d.fotorond = e.target.checked; teken(); };
$('#iconen').onchange = (e) => { d.tekst = e.target.checked; teken(); };
$('#copyrich').onclick = async () => {
  const h = html();
  try {
    await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([h], { type: 'text/html' }), 'text/plain': new Blob([$('#sig').innerText], { type: 'text/plain' }) })]);
    toast('Gekopieerd: plak hem in je mailprogramma');
  } catch (err) {   // oudere browsers: selecteer het voorbeeld en kopieer dat
    const r = document.createRange(); r.selectNodeContents($('#sig')); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    try { document.execCommand('copy'); toast('Gekopieerd: plak hem in je mailprogramma'); } catch (e2) { toast('Selecteer het voorbeeld en kopieer met Ctrl+C'); }
    s.removeAllRanges();
  }
};
$('#copyhtml').onclick = () => kopieer(html(), 'HTML gekopieerd');
$('#dl').onclick = () => download('handtekening.htm', `<!doctype html><html><head><meta charset="utf-8"></head><body>${html()}</body></html>`, 'text/html;charset=utf-8');
$('#wis').onclick = () => { if (!confirm('Alle velden leegmaken?')) return; VELDEN.forEach(([k]) => { d[k] = ''; }); $$('#velden input').forEach((i) => { i.value = ''; }); teken(); };
teken();
