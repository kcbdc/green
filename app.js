const data = 보도자료;   // 데이터.js 에서 불러옴 (fetch 없이 동작 - 로컬 더블클릭 가능)
const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// 이스케이프 후 검색어 하이라이트
function hl(text, kw) {
  const safe = esc(text);
  if (!kw) return safe;
  return safe.replace(new RegExp(escRe(esc(kw)), 'gi'), m => `<mark>${m}</mark>`);
}
// 본문: 첫 제목줄/구분선 제거, **굵게** 처리, 문단 분리
function renderBody(raw, kw) {
  const paras = raw.split(/\n{2,}/).map(p => p.trim())
    .filter(p => p && p !== '---' && !p.startsWith('# '));
  return paras.map(p => {
    let h = hl(p, kw).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return `<p>${h}</p>`;
  }).join('');
}

function matches(a, kw) {
  const k = kw.toLowerCase();
  return a.본문.toLowerCase().includes(k) || a.제목.toLowerCase().includes(k) || a.부처.toLowerCase().includes(k);
}

function render(arr, kw) {
  count.textContent = `결과 ${arr.length}건`;
  if (!arr.length) {
    list.innerHTML = '<div class="empty">검색 결과가 없습니다.</div>';
    return;
  }
  list.innerHTML = arr.map(a => `
    <article class="card">
      <span class="label">${hl(a.부처, kw)}</span><span class="no">보도자료 ${esc(a.번호)}</span>
      <div class="title">${hl(a.제목, kw)}</div>
      <div class="body">${renderBody(a.본문, kw)}</div>
    </article>`).join('');
}

function update() {
  const kw = q.value.trim();
  render(kw ? data.filter(a => matches(a, kw)) : data, kw);
}
q.addEventListener('input', update);
update();
