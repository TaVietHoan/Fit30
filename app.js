'use strict';
/* =====================================================================
   FIT30 — FRONTEND LOGIC
   1) Dán URL Web App của Apps Script (kết thúc bằng /exec) vào GAS_URL.
   2) Video: không điền tay. Chạy findExerciseVideos() trong code.gs, app tự nhận video đã xác minh.
   3) Dữ liệu động tác: sửa trong mảng EXERCISES. Lịch/mục tiêu sửa ngay trong app (lưu Google Sheets).
   ===================================================================== */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyo1AQkT8mHvGljs6ZhCh4lTcRUEiu2ID0w8qVZoI-B80ECeXo48oE8daPR0Uz2GQ8vWA/exec';

/* ------------------------------ DỮ LIỆU ĐỘNG TÁC ------------------------------ */
const EXERCISES = [
  { id:'walkplace', nameVi:'Đi bộ tại chỗ', nameEn:'Walk in place', descriptionVi:'Đi bộ tại chỗ, đánh tay tự nhiên, nâng chân nhẹ nhàng để làm nóng cơ thể.', descriptionEn:'Walk in place with a natural arm swing to raise body temperature.', durationSeconds:60, restSeconds:0, sets:1, videoKey:'march', videoUrl:'', thumbnailUrl:'', muscleGroups:['Chân','Tim mạch'], difficulty:'Dễ', calorieNote:'Cường độ nhẹ', beginnerAlternative:'Đi chậm hơn, bước nhỏ.', safetyNotes:'Giữ lưng thẳng, thở đều.' },
  { id:'shoulder', nameVi:'Xoay vai', nameEn:'Shoulder rolls', descriptionVi:'Xoay vai tròn về phía sau rồi về phía trước, biên độ lớn và chậm.', descriptionEn:'Roll shoulders backward then forward, slow and wide.', durationSeconds:60, restSeconds:0, sets:1, videoKey:'shoulder', videoUrl:'', thumbnailUrl:'', muscleGroups:['Vai','Cổ'], difficulty:'Dễ', calorieNote:'Khởi động, không tính calo', beginnerAlternative:'Xoay từng bên.', safetyNotes:'Không gồng cổ.' },
  { id:'hipcircle', nameVi:'Xoay hông và cổ chân', nameEn:'Hip & ankle circles', descriptionVi:'Hai tay chống hông, xoay hông tròn 30 giây, sau đó xoay từng cổ chân.', descriptionEn:'Hands on hips, circle hips for 30 seconds, then circle each ankle.', durationSeconds:60, restSeconds:0, sets:1, videoKey:'hipcircle', videoUrl:'', thumbnailUrl:'', muscleGroups:['Hông','Cổ chân'], difficulty:'Dễ', calorieNote:'Khởi động, không tính calo', beginnerAlternative:'Vịn tường khi xoay cổ chân.', safetyNotes:'Giữ thăng bằng, xoay chậm.' },
  { id:'sidestep', nameVi:'Bước sang ngang', nameEn:'Side step', descriptionVi:'Bước sang phải rồi sang trái, đầu gối hơi chùng, hai tay đánh nhẹ.', descriptionEn:'Step side to side with soft knees and relaxed arms.', durationSeconds:60, restSeconds:0, sets:1, videoKey:'sidestep', videoUrl:'', thumbnailUrl:'', muscleGroups:['Chân','Mông'], difficulty:'Dễ', calorieNote:'Cường độ nhẹ', beginnerAlternative:'Bước chậm, không đánh tay.', safetyNotes:'Mũi chân và đầu gối cùng hướng.' },
  { id:'kneeraise', nameVi:'Nâng gối nhẹ', nameEn:'Gentle knee raise', descriptionVi:'Luân phiên nâng gối ngang hông, nhịp chậm, bụng hơi siết.', descriptionEn:'Alternate knee raises to hip height at an easy pace.', durationSeconds:60, restSeconds:0, sets:1, videoKey:'march', videoUrl:'', thumbnailUrl:'', muscleGroups:['Đùi trước','Core'], difficulty:'Dễ', calorieNote:'Cường độ nhẹ', beginnerAlternative:'Nâng thấp hơn.', safetyNotes:'Không ưỡn lưng.' },
  { id:'march', nameVi:'Nâng gối nhanh (Low-impact March)', nameEn:'High knees / Low-impact march', descriptionVi:'Đi nhanh tại chỗ, nâng gối cao ngang hông, đánh tay mạnh. Không nhảy, hạn chế va chạm.', descriptionEn:'Brisk march in place with high knees and strong arm drive, no jumping.', durationSeconds:45, restSeconds:20, sets:3, videoKey:'march', videoUrl:'', thumbnailUrl:'', muscleGroups:['Đùi','Core','Tim mạch'], difficulty:'Dễ–Vừa', calorieNote:'Cường độ vừa', beginnerAlternative:'Nâng gối thấp, nhịp chậm.', safetyNotes:'Tiếp đất nhẹ, giữ thân thẳng.' },
  { id:'squat', nameVi:'Squat', nameEn:'Bodyweight squat', descriptionVi:'Chân rộng bằng vai, đẩy hông ra sau, hạ người như ngồi ghế, đẩy gót đứng lên.', descriptionEn:'Feet shoulder-width, push hips back, sit down, drive through heels to stand.', durationSeconds:45, restSeconds:20, sets:3, videoKey:'squat', videoUrl:'', thumbnailUrl:'', muscleGroups:['Đùi trước','Mông','Core'], difficulty:'Vừa', calorieNote:'Cường độ vừa', beginnerAlternative:'Squat vào ghế: chạm ghế rồi đứng lên.', safetyNotes:'Đầu gối thẳng hướng mũi chân, lưng thẳng.' },
  { id:'stepjack', nameVi:'Step Jack', nameEn:'Step jack', descriptionVi:'Bước chân sang ngang và đưa tay lên cao, như Jumping Jack nhưng không nhảy.', descriptionEn:'Step a leg out while raising arms overhead, a no-jump jumping jack.', durationSeconds:45, restSeconds:20, sets:3, videoKey:'stepjack', videoUrl:'', thumbnailUrl:'', muscleGroups:['Toàn thân','Tim mạch'], difficulty:'Dễ–Vừa', calorieNote:'Cường độ vừa', beginnerAlternative:'Chỉ bước chân, tay để thấp.', safetyNotes:'Giữ đầu gối hơi chùng.' },
  { id:'revlunge', nameVi:'Reverse Lunge (bước lùi)', nameEn:'Reverse lunge', descriptionVi:'Bước một chân ra sau, hạ thấp hai gối khoảng 90 độ, đẩy chân trước đứng lên. Đổi bên.', descriptionEn:'Step one foot back, lower both knees to about 90 degrees, push through the front foot. Alternate sides.', durationSeconds:45, restSeconds:20, sets:3, videoKey:'revlunge', videoUrl:'', thumbnailUrl:'', muscleGroups:['Đùi','Mông'], difficulty:'Vừa', calorieNote:'Cường độ vừa', beginnerAlternative:'Hạ nông, vịn tường hoặc ghế.', safetyNotes:'Ít áp lực lên gối hơn lunge bước tới. Dừng nếu đau gối.' },
  { id:'climber', nameVi:'Mountain Climber', nameEn:'Mountain climber', descriptionVi:'Chống tay, thân thẳng, kéo gối luân phiên về ngực.', descriptionEn:'In a high plank, drive knees alternately toward the chest.', durationSeconds:45, restSeconds:20, sets:3, videoKey:'climber', videoUrl:'', thumbnailUrl:'', muscleGroups:['Core','Vai','Chân'], difficulty:'Khó', calorieNote:'Cường độ cao hơn', beginnerAlternative:'Chống tay lên ghế hoặc bàn vững, kéo gối chậm.', safetyNotes:'Không võng lưng. Chậm lại khi mệt.' },
  { id:'birddog', nameVi:'Bird Dog', nameEn:'Bird dog', descriptionVi:'Quỳ bốn điểm, duỗi tay phải và chân trái, giữ 2 giây, đổi bên.', descriptionEn:'On all fours, extend opposite arm and leg, hold 2 seconds, switch.', durationSeconds:45, restSeconds:20, sets:3, videoKey:'birddog', videoUrl:'', thumbnailUrl:'', muscleGroups:['Lưng dưới','Core','Mông'], difficulty:'Dễ', calorieNote:'Cường độ nhẹ', beginnerAlternative:'Chỉ duỗi chân hoặc chỉ duỗi tay.', safetyNotes:'Giữ hông ngang, không xoay người.' },
  { id:'slowwalk', nameVi:'Đi bộ chậm', nameEn:'Slow walk', descriptionVi:'Đi chậm quanh phòng, hít sâu để nhịp tim giảm dần.', descriptionEn:'Walk slowly to bring heart rate down.', durationSeconds:120, restSeconds:0, sets:1, videoKey:'', videoUrl:'', thumbnailUrl:'', muscleGroups:['Toàn thân'], difficulty:'Dễ', calorieNote:'Cường độ nhẹ', beginnerAlternative:'Đứng thả lỏng.', safetyNotes:'Không dừng đột ngột.' },
  { id:'stretch', nameVi:'Thả lỏng và giãn cơ', nameEn:'Cool-down stretch', descriptionVi:'Giãn đùi trước, đùi sau, vai và ngực, mỗi động tác giữ khoảng 20 giây.', descriptionEn:'Stretch quads, hamstrings, shoulders and chest, about 20 seconds each.', durationSeconds:90, restSeconds:0, sets:1, videoKey:'stretch', videoUrl:'', thumbnailUrl:'', muscleGroups:['Toàn thân'], difficulty:'Dễ', calorieNote:'Không tính calo', beginnerAlternative:'Giữ ngắn hơn.', safetyNotes:'Giãn đến mức căng nhẹ, không đau.' },
  { id:'breathing', nameVi:'Hít thở có kiểm soát', nameEn:'Controlled breathing', descriptionVi:'Hít vào bằng mũi 4 nhịp, thở ra bằng miệng 6 nhịp, bụng phình lên khi hít.', descriptionEn:'Inhale through the nose for 4, exhale through the mouth for 6.', durationSeconds:90, restSeconds:0, sets:1, videoKey:'breathing', videoUrl:'', thumbnailUrl:'', muscleGroups:['Cơ hoành'], difficulty:'Dễ', calorieNote:'Không tính calo', beginnerAlternative:'Hít thở tự nhiên.', safetyNotes:'Dừng nếu chóng mặt.' },
  { id:'briskwalk', nameVi:'Đi bộ nhanh', nameEn:'Brisk walk', descriptionVi:'Đi bộ nhanh ngoài trời hoặc trong nhà sao cho vẫn nói chuyện được nhưng hơi gấp.', descriptionEn:'Walk briskly so you can still talk but feel slightly breathless.', durationSeconds:1800, restSeconds:0, sets:1, videoKey:'', videoUrl:'', thumbnailUrl:'', muscleGroups:['Chân','Tim mạch'], difficulty:'Dễ', calorieNote:'Cường độ nhẹ–vừa', beginnerAlternative:'Đi chậm hơn, chia 2 lần 15 phút.', safetyNotes:'Mang giày êm, uống đủ nước.' }
];
const EX = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
const WARM = ['walkplace', 'shoulder', 'hipcircle', 'sidestep', 'kneeraise'];
const COOL = ['slowwalk', 'stretch', 'breathing'];
const WORKOUTS = {
  A: { id:'A', nameVi:'Đốt mỡ toàn thân', sub:'Khởi động 5 phút, 3 vòng, hạ nhiệt 5 phút', main:['march','squat','stepjack','revlunge','climber','birddog'], work:45, rest:20, rounds:3, kind:'main' },
  B: { id:'B', nameVi:'Chân và core ít va chạm', sub:'Khởi động 5 phút, 3 vòng, hạ nhiệt 5 phút', main:['squat','revlunge','birddog','march','stepjack','climber'], work:45, rest:20, rounds:3, kind:'main' },
  L: { id:'L', nameVi:'Vận động nhẹ', sub:'Khoảng 20 phút, cường độ thấp', custom:[['walkplace',300],['shoulder',120],['hipcircle',120],['sidestep',240],['birddog',180],['stretch',180],['breathing',120]], kind:'light' },
  W: { id:'W', nameVi:'Đi bộ nhanh', sub:'30 phút liên tục', custom:[['briskwalk',1800]], kind:'walk' },
  R: { id:'R', nameVi:'Nghỉ và phục hồi', sub:'Ngủ đủ, uống nước, giãn cơ nhẹ', kind:'rest' }
};
const DAYS = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật'];
const MEAL_VI = { breakfast:'Bữa sáng', lunch:'Bữa trưa', dinner:'Bữa tối', snack:'Bữa phụ' };
const MET_NOTE = 3.8; // ~ calisthenics cường độ nhẹ–vừa theo bảng MET phổ biến; chỉ là ước tính thô

function buildSteps(wid) {
  const W = WORKOUTS[wid], steps = [];
  const add = (exId, dur, kind, group, extra) => steps.push(Object.assign({ kind, exId, dur, group }, extra || {}));
  if (W.custom) { W.custom.forEach(([id, d]) => add(id, d, 'work', 'custom')); }
  else {
    WARM.forEach(id => add(id, EX[id].durationSeconds, 'work', 'warmup'));
    for (let r = 1; r <= W.rounds; r++) W.main.forEach((id, i) => {
      add(id, W.work, 'work', 'main', { round: r });
      if (!(r === W.rounds && i === W.main.length - 1)) add(id, W.rest, 'rest', 'main', { round: r });
    });
    COOL.forEach(id => add(id, EX[id].durationSeconds, 'work', 'cool'));
  }
  for (let i = 0; i < steps.length; i++) if (steps[i].kind === 'rest') { const n = steps.slice(i + 1).find(s => s.kind === 'work'); if (n) steps[i].exId = n.exId; }
  return steps;
}
const totalSec = steps => steps.reduce((a, s) => a + s.dur, 0);

/* ------------------------------ TIỆN ÍCH ------------------------------ */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = v => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').slice(0, 20) : Math.random().toString(36).slice(2) + Date.now().toString(36)).padEnd(10, '0');
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const today = () => ymd(new Date());
const parseD = s => new Date(s + 'T00:00:00');
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return ymd(d); };
const weekIdx = s => (parseD(s).getDay() + 6) % 7;
const weekStart = s => addDays(s, -weekIdx(s));
const fmtN = (n, dec) => (n === null || n === undefined || n === '' || isNaN(n)) ? '—' : Number(n).toLocaleString('vi-VN', { maximumFractionDigits: dec === undefined ? 1 : dec });
const fmtDate = (s, o) => parseD(s).toLocaleDateString('vi-VN', o || { weekday: 'long', day: 'numeric', month: 'numeric' });
const fmtClock = sec => { sec = Math.max(0, Math.ceil(sec)); return sec >= 60 ? `${Math.floor(sec / 60)}:${pad2(sec % 60)}` : String(sec); };
const fmtMin = sec => `${Math.floor(sec / 60)}:${pad2(Math.round(sec % 60))}`;
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const lsDel = k => { try { localStorage.removeItem(k); } catch (e) {} };
const icon = n => `<svg class="i"><use href="#i-${n}"/></svg>`;

/* ------------------------------ API (iframe + postMessage) ------------------------------ */
const ORIGIN_OK = /^https:\/\/([\w-]+\.)*(googleusercontent\.com|google\.com)$/;
let passcode = lsGet('fit30_pc', '');
function apiErr(code, message) { const e = new Error(message); e.code = code; return e; }
function postOnce(action, data, requestId, timeoutMs) {
  return new Promise((resolve, reject) => {
    const name = 'f30_' + requestId + '_' + Math.random().toString(36).slice(2, 6);
    const frame = document.createElement('iframe');
    frame.name = name; frame.style.display = 'none'; frame.tabIndex = -1; frame.title = 'api';
    const form = document.createElement('form');
    form.method = 'POST'; form.action = GAS_URL; form.target = name; form.style.display = 'none';
    const inp = document.createElement('textarea'); inp.name = 'payload';
    inp.value = JSON.stringify({ action, data: data || {}, requestId, passcode });
    form.appendChild(inp);
    let done = false;
    const cleanup = () => { done = true; clearTimeout(timer); window.removeEventListener('message', onMsg); frame.remove(); form.remove(); };
    const onMsg = ev => {
      if (!ORIGIN_OK.test(ev.origin)) return;
      const m = ev.data;
      if (!m || m.fit30 !== true || m.requestId !== requestId || done) return;
      cleanup();
      const r = m.result || {};
      if (r.success) resolve(r.data); else reject(apiErr((r.error && r.error.code) || 'ERROR', (r.error && r.error.message) || 'Có lỗi xảy ra'));
    };
    const timer = setTimeout(() => { if (done) return; cleanup(); reject(apiErr('TIMEOUT', 'Quá thời gian chờ phản hồi')); }, timeoutMs);
    window.addEventListener('message', onMsg);
    document.body.appendChild(frame); document.body.appendChild(form);
    form.submit();
  });
}
async function api(action, data, opt) {
  opt = opt || {};
  if (!GAS_URL || GAS_URL.indexOf('PASTE_') === 0) throw apiErr('NO_URL', 'Chưa cấu hình GAS_URL trong app.js');
  const requestId = opt.requestId || uid();
  const tries = opt.retries === undefined ? 1 : opt.retries; // cùng requestId nên backend không ghi trùng
  let last;
  for (let i = 0; i <= tries; i++) {
    try { return await postOnce(action, data, requestId, opt.timeout || 45000); }
    catch (e) { last = e; if (e.code !== 'TIMEOUT') break; }
  }
  throw last;
}
const errMsg = e => ({ TIMEOUT: 'Máy chủ phản hồi chậm. Kiểm tra mạng rồi thử lại.', UNAUTHORIZED: 'Sai mật khẩu truy cập.', NO_URL: 'Chưa cấu hình GAS_URL trong app.js.' }[e.code] || e.message || 'Có lỗi xảy ra');

/* ------------------------------ TRẠNG THÁI ------------------------------ */
const state = {
  tab: 'dashboard', loaded: false, settings: null, videos: {}, geminiReady: false,
  workoutLogs: [], weightLogs: [], foodLogs: [], foodDate: today(), foodLoaded: {},
  draft: null, image: null, analyzing: false, savingFood: false, savingWeight: false, planEdit: false
};
let S = null; // buổi tập đang chạy

/* ------------------------------ TOAST / MODAL ------------------------------ */
function toast(msg, type) {
  const el = document.createElement('div'); el.className = 'toast ' + (type || ''); el.textContent = msg;
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), type === 'err' ? 6000 : 3000);
}
function openModal(html, onClose) {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  m.addEventListener('mousedown', e => { if (e.target === m) closeModal(); });
  m._onClose = onClose; $('#modalRoot').appendChild(m);
  const f = $('input,select,button.btn', m); if (f && matchMedia('(min-width:700px)').matches) f.focus();
  return m;
}
function closeModal() { const m = $('#modalRoot .modal'); if (m) { if (m._onClose) m._onClose(); m.remove(); } }
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modalRoot .modal')) closeModal(); });
function confirmBox(title, text, okLabel, danger) {
  return new Promise(res => {
    const m = openModal(`<h3>${esc(title)}</h3><p class="muted" style="margin-bottom:18px">${esc(text)}</p>
      <div class="grid2"><button class="btn" data-c="0">Hủy</button><button class="btn ${danger ? 'danger' : 'primary'}" data-c="1">${esc(okLabel || 'Đồng ý')}</button></div>`, () => res(false));
    $$('[data-c]', m).forEach(b => b.onclick = () => { m._onClose = null; m.remove(); res(b.dataset.c === '1'); });
  });
}

/* ------------------------------ ÂM THANH ------------------------------ */
let actx = null;
const soundOn = () => lsGet('fit30_sound', '1') === '1';
const vibeOn = () => lsGet('fit30_vibe', '1') === '1';
function unlockAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {} }
function beep(freq, ms, vol) {
  if (soundOn() && actx) {
    try {
      const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol || .25, actx.currentTime); g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + ms / 1000);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + ms / 1000);
    } catch (e) {}
  }
}
const buzz = p => { if (vibeOn() && navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };
const cue = {
  work: () => { beep(880, 260); buzz(120); }, rest: () => { beep(520, 260); buzz([80, 60, 80]); },
  tick: () => beep(700, 90, .18), done: () => { beep(660, 160); setTimeout(() => beep(880, 160), 190); setTimeout(() => beep(1040, 320), 380); buzz([150, 80, 150, 80, 300]); }
};

/* ------------------------------ DỮ LIỆU ------------------------------ */
function applyVideos() {
  EXERCISES.forEach(e => {
    const v = state.videos[e.videoKey || e.id];
    e.videoUrl = v ? `https://www.youtube.com/watch?v=${v.videoId}` : '';
    e.thumbnailUrl = v ? `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg` : '';
    e._vid = v || null;
  });
}
async function loadAll() {
  const from = addDays(today(), -120), fFrom = addDays(today(), -6);
  const [init, wl, wt, fl] = await Promise.all([
    api('getInitialData'), api('getWorkoutLogs', { fromDate: from }), api('getWeightLogs'), api('getFoodLogs', { fromDate: fFrom })
  ]);
  state.settings = init.settings; state.videos = init.videos || {}; state.geminiReady = init.geminiReady;
  state.workoutLogs = wl.logs; state.weightLogs = wt.logs; state.foodLogs = fl.logs;
  for (let i = 0; i < 7; i++) state.foodLoaded[addDays(today(), -i)] = true;
  applyVideos(); state.loaded = true;
}
const doneLogs = () => state.workoutLogs.filter(l => l.status === 'completed' || Number(l.completedExercises) > 0);
const logsOn = d => state.workoutLogs.filter(l => l.date === d);
function weekStats() {
  const ws = weekStart(today()), we = addDays(ws, 6);
  const L = state.workoutLogs.filter(l => l.date >= ws && l.date <= we);
  return { count: L.length, minutes: Math.round(L.reduce((a, l) => a + Number(l.durationSeconds || 0), 0) / 60), days: new Set(L.map(l => l.date)) };
}
function streak() {
  const days = new Set(state.workoutLogs.map(l => l.date)); let d = today(), n = 0;
  if (!days.has(d)) d = addDays(d, -1);
  while (days.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
const weightsAsc = () => state.weightLogs.filter(l => l.weightKg !== '' && l.weightKg !== null).slice().sort((a, b) => a.date < b.date ? -1 : 1);
const waistAsc = () => state.weightLogs.filter(l => l.waistCm !== '' && l.waistCm !== null).slice().sort((a, b) => a.date < b.date ? -1 : 1);
const todayWorkoutId = () => (state.settings && state.settings.schedule[weekIdx(today())]) || 'R';

/* ------------------------------ ĐIỀU HƯỚNG ------------------------------ */
function go(tab) {
  state.tab = tab;
  $$('[data-nav]').forEach(b => b.setAttribute('aria-current', b.dataset.nav === tab ? 'page' : 'false'));
  render(); window.scrollTo({ top: 0 });
}
function render() {
  const v = $('#view');
  if (!state.loaded) { v.innerHTML = '<div class="stack"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>'; return; }
  const fn = { dashboard: vDashboard, plan: vPlan, train: vTrain, food: vFood, progress: vProgress }[state.tab];
  v.innerHTML = fn();
  if (state.tab === 'food') bindFoodView();
}

/* ------------------------------ VIDEO / CHI TIẾT BÀI ------------------------------ */
function videoBox(ex, id) {
  if (ex._vid) {
    return `<div class="vid" data-vid="${esc(ex._vid.videoId)}" id="${id || ''}">
      <img src="${esc(ex.thumbnailUrl)}" alt="" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55" onerror="this.remove()">
      <button class="play" data-act="playvid" aria-label="Phát video hướng dẫn ${esc(ex.nameVi)}">${icon('play')}</button></div>
      <p class="muted sm" style="margin-top:6px">${esc(ex._vid.title)} · ${esc(ex._vid.channel)}</p>`;
  }
  const q = encodeURIComponent(ex.nameEn + ' exercise form tutorial');
  return `<div class="vid" id="${id || ''}"><div class="poster"><svg class="i anim"><use href="#i-bolt"/></svg>
    <span class="sm">Chưa có video đã xác minh cho bài này.</span>
    <a class="btn sm" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">${icon('ext')} Tìm trên YouTube</a></div></div>`;
}
function playVid(box) {
  const id = box.dataset.vid; if (!id) return;
  box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&playsinline=1&modestbranding=1" title="Video hướng dẫn" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>`;
}
function exDetail(id) {
  const e = EX[id]; if (!e) return;
  openModal(`<div class="row between"><h3>${esc(e.nameVi)}</h3><button class="btn ghost icon-btn" data-act="closemodal" aria-label="Đóng">${icon('x')}</button></div>
    <p class="muted sm" style="margin:-6px 0 12px">${esc(e.nameEn)}</p>${videoBox(e)}
    <div class="stack" style="margin-top:14px"><p>${esc(e.descriptionVi)}</p><p class="muted sm">${esc(e.descriptionEn)}</p>
    <div class="row wrap">${e.muscleGroups.map(m => `<span class="chip">${esc(m)}</span>`).join('')}<span class="chip on">${esc(e.difficulty)}</span></div>
    <div class="card"><b>Phiên bản dễ hơn</b><p class="muted">${esc(e.beginnerAlternative)}</p></div>
    <div class="card"><b>An toàn</b><p class="muted">${esc(e.safetyNotes)}</p></div>
    <p class="muted sm">${esc(e.durationSeconds)} giây${e.restSeconds ? ` · nghỉ ${e.restSeconds} giây` : ''} · ${esc(e.calorieNote)}</p>
    ${e.videoUrl ? `<a class="btn" href="${esc(e.videoUrl)}" target="_blank" rel="noopener">${icon('ext')} Mở video gốc</a>` : ''}</div>`);
}

/* ------------------------------ TỔNG QUAN ------------------------------ */
function greeting() { const h = new Date().getHours(); return h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'; }
function statCard(k, v, unit, d) { return `<div class="stat"><div class="k">${k}</div><div class="v">${v}<small>${unit}</small></div><div class="d">${d}</div></div>`; }
function vDashboard() {
  const st = state.settings, ws = weekStats(), goal = st.weeklyGoal || 4, wi = weekIdx(today());
  const msg = ws.count === 0 ? 'Bắt đầu nhẹ nhàng, 30 phút mỗi ngày là đủ.' : ws.count < goal ? `Bạn đã tập ${ws.count}/${goal} buổi tuần này. Giữ nhịp nhé.` : 'Đã đạt mục tiêu tuần. Giữ nhịp và nghỉ ngơi hợp lý.';
  const wA = weightsAsc(), cA = waistAsc();
  const lastW = wA[wA.length - 1], lastC = cA[cA.length - 1];
  const startW = st.startWeightKg || (wA[0] && Number(wA[0].weightKg)), startC = st.startWaistCm || (cA[0] && Number(cA[0].waistCm));
  const dW = lastW && startW ? Number(lastW.weightKg) - startW : null, dC = lastC && startC ? Number(lastC.waistCm) - startC : null;
  const kcal = state.foodLogs.filter(l => l.date === today()).reduce((a, l) => a + Number(l.totalCaloriesKcal || 0), 0);
  const hasFood = state.foodLogs.some(l => l.date === today());
  const dstr = d => d === null ? 'Chưa có mốc so sánh' : `${d > 0 ? '+' : ''}${fmtN(d)} so với lúc bắt đầu`;
  const sk = streak();
  return `<div class="stack">
    <section class="hero"><div class="date">${esc(fmtDate(today()))}</div><h1>${greeting()}</h1>
      <p class="msg">${esc(msg)}</p>
      <div class="week" aria-label="Tiến độ tuần">${[0,1,2,3,4,5,6].map(i => `<i class="${ws.days.has(addDays(weekStart(today()), i)) ? 'on' : ''}" title="${DAYS[i]}"></i>`).join('')}</div>
      <p class="sm muted" style="margin-top:8px">${ws.count}/${goal} buổi · ${ws.minutes} phút${sk > 1 ? ` · chuỗi ${sk} ngày` : ''}</p></section>
    ${todayCard()}
    <div class="grid2">
      ${statCard('Cân nặng gần nhất', lastW ? fmtN(lastW.weightKg) : '—', lastW ? 'kg' : '', lastW ? dstr(dW) : 'Chưa có dữ liệu. Nhập ở tab Tiến trình.')}
      ${statCard('Vòng bụng gần nhất', lastC ? fmtN(lastC.waistCm) : '—', lastC ? 'cm' : '', lastC ? dstr(dC) : 'Chưa có dữ liệu.')}
      ${statCard('Buổi tập tuần này', ws.count, `/${goal}`, 'Mục tiêu tuần')}
      ${statCard('Phút tập tuần này', ws.minutes, 'phút', wi === 0 && !ws.minutes ? 'Tuần mới bắt đầu' : 'Tích lũy từ Thứ 2')}
    </div>
    ${statCard('Calo ăn vào hôm nay', hasFood ? fmtN(kcal, 0) : '—', hasFood ? 'kcal' : '', hasFood ? 'Tổng các bữa đã ghi' : 'Chưa ghi bữa nào. Chụp món ăn ở tab Dinh dưỡng.')}
  </div>`;
}
function todayCard() {
  const wid = todayWorkoutId(), W = WORKOUTS[wid], done = logsOn(today()).some(l => l.workoutId === wid);
  if (W.kind === 'rest') return `<section class="card today"><span class="chip">Hôm nay</span><h2>${esc(W.nameVi)}</h2><p class="muted">${esc(W.sub)}</p></section>`;
  const ids = W.custom ? W.custom.map(c => c[0]) : [...new Set([...WARM, ...W.main, ...COOL])];
  const mins = Math.round(totalSec(buildSteps(wid)) / 60);
  return `<section class="card today"><div class="row between"><span class="chip on">Buổi tập hôm nay</span>${done ? `<span class="done-badge">${icon('check')} Đã hoàn thành</span>` : ''}</div>
    <h2>${esc(W.nameVi)}</h2><p class="muted">Khoảng ${mins} phút · ${esc(W.sub)}</p>
    <ul class="exlist">${ids.slice(0, 8).map(id => `<li data-act="exdetail" data-id="${id}"><span class="thumb">${icon('bolt')}</span><span class="t"><b>${esc(EX[id].nameVi)}</b><span class="muted sm">${esc(EX[id].nameEn)}</span></span></li>`).join('')}</ul>
    <button class="btn primary big" style="margin-top:16px" data-act="start" data-id="${wid}">${done ? 'TẬP LẠI' : 'BẮT ĐẦU TẬP'}</button></section>`;
}

/* ------------------------------ LỊCH TẬP ------------------------------ */
function vPlan() {
  const sched = state.settings.schedule, ws = weekStart(today());
  const hist = state.workoutLogs.slice(0, 15);
  return `<div class="pagehead row between"><div><h2>Lịch tập</h2><p>4 buổi chính, 1 buổi nhẹ, 1 buổi đi bộ, 1 ngày nghỉ.</p></div><button class="btn" data-act="editplan">${icon('edit')} Sửa lịch</button></div>
  <div class="stack">${sched.map((w, i) => { const d = addDays(ws, i), W = WORKOUTS[w], ok = logsOn(d).length > 0;
    return `<div class="day ${i === weekIdx(today()) ? 'now' : ''}"><div class="dn">${DAYS[i]}</div><div><b>${esc(W.nameVi)}</b><div class="st muted">${esc(W.sub)}</div></div>
    <div style="display:flex;gap:8px;align-items:center">${W.kind !== 'rest' && d === today() ? `<button class="btn sm" data-act="start" data-id="${w}">${icon('play')}</button>` : ''}<span class="tick ${ok ? 'on' : ''}" aria-label="${ok ? 'Đã tập' : 'Chưa tập'}">${icon('check')}</span></div></div>`; }).join('')}</div>
  <h3 style="margin:26px 0 12px;font-size:28px">Thư viện động tác</h3>
  <ul class="exlist" style="margin-top:0">${EXERCISES.map(e => `<li data-act="exdetail" data-id="${e.id}" style="background:var(--surface)"><span class="thumb">${icon('bolt')}</span><span class="t"><b>${esc(e.nameVi)}</b><span class="muted sm">${esc(e.muscleGroups.join(', '))}</span></span>${e._vid ? '<span class="chip on">Video</span>' : ''}</li>`).join('')}</ul>
  <h3 style="margin:26px 0 8px;font-size:28px">Lịch sử tập</h3>
  ${hist.length ? hist.map(l => `<div class="hist"><div><b>${esc((WORKOUTS[l.workoutId] || {}).nameVi || l.workoutId)}</b><div class="muted sm">${esc(fmtDate(l.date, { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' }))}</div></div><div class="muted sm" style="text-align:right">${fmtMin(Number(l.durationSeconds))} phút<br>${esc(l.completedExercises)}/${esc(l.totalExercises)} bài</div></div>`).join('') : '<div class="empty"><h3>Chưa có buổi tập nào</h3><p>Hoàn thành buổi đầu tiên để thấy lịch sử ở đây.</p></div>'}`;
}
function editPlan() {
  const s = state.settings.schedule.slice();
  const opts = Object.values(WORKOUTS).map(w => `<option value="${w.id}">${esc(w.nameVi)}</option>`).join('');
  const m = openModal(`<h3>Sửa lịch tuần</h3><div class="stack">${DAYS.map((d, i) => `<div class="row"><label class="f" style="width:84px;margin:0">${d}</label><select data-d="${i}">${opts}</select></div>`).join('')}
    <div class="grid2"><button class="btn" data-act="closemodal">Hủy</button><button class="btn primary" id="savePlan">Lưu lịch</button></div></div>`);
  $$('select', m).forEach(sel => sel.value = s[sel.dataset.d]);
  $('#savePlan', m).onclick = async e => {
    const b = e.currentTarget; if (b.disabled) return; b.disabled = true;
    const sch = $$('select', m).map(x => x.value);
    try { const r = await api('updateSettings', { schedule: sch }); state.settings = r.settings; closeModal(); toast('Đã lưu lịch tập', 'ok'); render(); }
    catch (er) { toast(errMsg(er), 'err'); b.disabled = false; }
  };
}

/* ------------------------------ TẬP LUYỆN (chọn buổi) ------------------------------ */
function vTrain() {
  const t = todayWorkoutId();
  return `<div class="pagehead"><h2>Tập luyện</h2><p>Chọn buổi tập và bấm bắt đầu. Đồng hồ tự chuyển bài và nghỉ.</p></div>
  <div class="stack">${['A', 'B', 'L', 'W'].map(id => { const W = WORKOUTS[id]; return `<div class="card ${id === t ? 'today' : ''}"><div class="row between"><div><h3 style="font-size:30px">${esc(W.nameVi)}</h3><p class="muted sm">${Math.round(totalSec(buildSteps(id)) / 60)} phút · ${esc(W.sub)}</p></div>${id === t ? '<span class="chip on">Hôm nay</span>' : ''}</div>
    <button class="btn primary" style="margin-top:12px;width:100%" data-act="start" data-id="${id}">${icon('play')} Bắt đầu</button></div>`; }).join('')}</div>
  <p class="muted sm" style="margin-top:16px">Mẹo: đặt điện thoại ở nơi dễ nhìn, bật âm thanh. Nếu khớp gối khó chịu, chọn phiên bản dễ hơn trong thư viện động tác.</p>`;
}

/* ------------------------------ BUỔI TẬP + ĐỒNG HỒ ------------------------------ */
const RC = 2 * Math.PI * 45;
function openSession(wid) {
  if (S) return;
  const W = WORKOUTS[wid]; if (!W || W.kind === 'rest') return;
  const steps = buildSteps(wid);
  const first = steps[0];
  steps.unshift({ kind: 'prepare', exId: first.exId, dur: 10, group: 'prepare' });
  const uniq = []; steps.forEach(s => { if (s.kind === 'work' && uniq.indexOf(s.exId) < 0) uniq.push(s.exId); });
  S = { id: uid(), wid, steps, uniq, idx: 0, state: 'ready', stepStart: 0, elapsedInStep: 0, pausedAt: 0, pausedTotal: 0, begin: 0, beginWall: null,
    skipped: new Set(), total: totalSec(steps), lastTick: -1, saving: false, saved: false, timer: null, wake: null, lastEx: null };
  $('#sessionRoot').innerHTML = `<div class="session" id="sess" role="dialog" aria-modal="true" aria-label="Buổi tập">
    <div class="top"><button class="btn ghost icon-btn" data-act="endsess" aria-label="Kết thúc buổi tập">${icon('x')}</button><b class="num" style="font-size:22px" id="sTitle">${esc(W.nameVi)}</b>
    <button class="btn ghost icon-btn" data-act="togglesound" id="sSound" aria-label="Bật tắt âm thanh">${icon(soundOn() ? 'vol' : 'mute')}</button></div>
    <div><div class="bar"><i id="sBar"></i></div><div class="row between muted sm" style="margin-top:6px"><span id="sCount"></span><span id="sLeft"></span></div></div>
    <div style="text-align:center"><span class="phase" id="sPhase"></span></div>
    <div style="text-align:center"><h2 id="sName" style="font-size:38px"></h2><p class="muted" id="sEn"></p></div>
    <div class="ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="45" fill="none" stroke-width="6"/><circle class="fg" id="sRing" cx="50" cy="50" r="45" fill="none" stroke-width="6" stroke-dasharray="${RC}" stroke-dashoffset="0"/></svg><div class="big" id="sBig"></div></div>
    <p id="sTip" class="muted" style="text-align:center;max-width:46ch;margin:0 auto"></p>
    <div id="sVid" style="max-width:520px;width:100%;margin:0 auto"></div>
    <div style="flex:1"></div>
    <div class="ctrl" id="sCtrl"></div></div>`;
  document.addEventListener('visibilitychange', onVis);
  document.body.style.overflow = 'hidden';
  renderSession();
}
function onVis() { if (S && S.state === 'running' && !document.hidden) { tick(); if (navigator.wakeLock && !S.wake) reqWake(); } }
async function reqWake() { try { if (navigator.wakeLock) S.wake = await navigator.wakeLock.request('screen'); } catch (e) { if (S) S.wake = null; } }
function startSession() {
  unlockAudio(); const now = performance.now();
  S.state = 'running'; S.begin = now; S.beginWall = new Date(); S.stepStart = now; S.lastTick = -1;
  S.timer = setInterval(tick, 250); reqWake(); cue.work(); renderSession();
}
function pauseSession() { if (S.state !== 'running') return; S.pausedAt = performance.now(); S.elapsedInStep = S.pausedAt - S.stepStart; S.state = 'paused'; renderSession(); }
function resumeSession() { if (S.state !== 'paused') return; const now = performance.now(); S.pausedTotal += now - S.pausedAt; S.stepStart = now - S.elapsedInStep; S.state = 'running'; tick(); renderSession(); }
function curElapsed() { return S.state === 'paused' ? S.elapsedInStep / 1000 : S.state === 'running' ? (performance.now() - S.stepStart) / 1000 : 0; }
function tick() {
  if (!S || S.state !== 'running') return;
  const now = performance.now(); let changed = false, guard = 0, last = S.steps[S.idx];
  let remaining = last.dur - (now - S.stepStart) / 1000;
  while (remaining <= 0 && guard++ < 200) {
    if (S.idx >= S.steps.length - 1) { finishSession(false); return; }
    const carry = -remaining; S.idx++; S.stepStart = now - carry * 1000; S.lastTick = -1; changed = true;
    remaining = S.steps[S.idx].dur - carry;
  }
  if (changed) { const k = S.steps[S.idx].kind; (k === 'rest' ? cue.rest : cue.work)(); }
  const sec = Math.ceil(remaining);
  if (sec <= 3 && sec >= 1 && S.lastTick !== sec && S.steps[S.idx].dur > 6) { S.lastTick = sec; cue.tick(); }
  renderSession();
}
function gotoStep(i) {
  S.idx = Math.max(0, Math.min(S.steps.length - 1, i)); const now = performance.now(); S.stepStart = now; S.elapsedInStep = 0; S.pausedAt = now; S.lastTick = -1;
  (S.steps[S.idx].kind === 'rest' ? cue.rest : cue.work)(); renderSession();
}
function skipStep() {
  if (!S || S.state === 'ready' || S.state === 'done') return;
  const cur = S.steps[S.idx]; if (cur.kind === 'work') S.skipped.add(cur.exId);
  let n = S.idx + 1; while (n < S.steps.length && S.steps[n].kind !== 'work') n++;
  if (n >= S.steps.length) { finishSession(false); return; } gotoStep(n);
}
function redoStep() {
  if (!S || S.state === 'ready' || S.state === 'done') return;
  let n = S.idx; while (n > 0 && S.steps[n].kind === 'rest') n--; gotoStep(n);
}
function sessionProgress() {
  let before = 0; for (let i = 0; i < S.idx; i++) before += S.steps[i].dur;
  const el = S.state === 'done' ? 0 : curElapsed(); return { done: before + Math.min(el, S.steps[S.idx].dur), before };
}
function renderSession() {
  const root = $('#sess'); if (!root || !S) return;
  if (S.state === 'done') return;
  const st = S.steps[S.idx], ex = EX[st.exId];
  const el = S.state === 'ready' ? 0 : curElapsed(), rem = Math.max(0, st.dur - el), p = sessionProgress();
  root.className = 'session ' + (st.kind === 'rest' ? 'rest' : '');
  const ph = $('#sPhase'); ph.className = 'phase ' + (S.state === 'ready' ? '' : st.kind);
  ph.textContent = S.state === 'ready' ? 'SẴN SÀNG' : S.state === 'paused' ? 'TẠM DỪNG' : st.kind === 'prepare' ? 'CHUẨN BỊ' : st.kind === 'rest' ? 'NGHỈ' : 'ĐANG TẬP';
  $('#sName').textContent = (st.kind === 'rest' ? 'Tiếp theo: ' : '') + ex.nameVi; $('#sEn').textContent = ex.nameEn;
  $('#sBig').textContent = S.state === 'ready' ? fmtClock(st.dur) : fmtClock(rem);
  $('#sRing').style.strokeDashoffset = String(RC * (S.state === 'ready' ? 0 : Math.min(1, el / st.dur)));
  $('#sBar').style.width = (100 * p.done / S.total).toFixed(1) + '%';
  const pos = S.uniq.indexOf(st.exId) + 1;
  $('#sCount').textContent = `Bài ${pos}/${S.uniq.length}${st.round ? ` · vòng ${st.round}/${WORKOUTS[S.wid].rounds}` : ''}`;
  $('#sLeft').textContent = `Còn ${fmtMin(Math.max(0, S.total - p.done))}`;
  $('#sTip').textContent = st.kind === 'rest' ? 'Thả lỏng, uống nước, hít thở sâu.' : `${ex.descriptionVi} ${ex.safetyNotes}`;
  if (S.lastEx !== st.exId) { S.lastEx = st.exId; $('#sVid').innerHTML = videoBox(ex); }
  const main = S.state === 'ready' ? ['play', 'Bắt đầu', 'startsess'] : S.state === 'paused' ? ['play', 'Tiếp tục', 'resumesess'] : ['pause', 'Tạm dừng', 'pausesess'];
  const ctrl = $('#sCtrl'), key = S.state + st.kind;
  if (ctrl.dataset.k !== key) {
    ctrl.dataset.k = key;
    ctrl.innerHTML = `<button class="btn primary" data-act="${main[2]}">${icon(main[0])}${main[1]}</button><button class="btn" data-act="skipstep" ${S.state === 'ready' ? 'disabled' : ''}>${icon('skip')}Bỏ qua</button><button class="btn" data-act="redostep" ${S.state === 'ready' ? 'disabled' : ''}>${icon('redo')}Tập lại</button><button class="btn danger" data-act="endsess">${icon('x')}Kết thúc</button>`;
  }
}
function finishSession(early) {
  if (!S || S.state === 'done') return;
  const now = performance.now(); let paused = S.pausedTotal; if (S.state === 'paused') paused += now - S.pausedAt;
  S.durationSeconds = S.state === 'ready' ? 0 : Math.max(0, Math.round((now - S.begin - paused) / 1000));
  const reached = new Set(); S.steps.forEach((s, i) => { if (s.kind === 'work' && (i < S.idx || (!early && i <= S.idx))) reached.add(s.exId); });
  S.skipped.forEach(id => reached.delete(id));
  S.completedCount = reached.size; S.allDone = !early && S.skipped.size === 0 && reached.size === S.uniq.length;
  S.endWall = new Date(); S.state = 'done'; clearInterval(S.timer); S.timer = null;
  if (!early) cue.done();
  showSummary();
}
function estKcal(sec) { const w = weightsAsc(); const last = w[w.length - 1]; return last ? Math.round(MET_NOTE * Number(last.weightKg) * (sec / 3600)) : null; }
function showSummary() {
  const root = $('#sess'); if (!root) return;
  const ws = weekStats(), k = estKcal(S.durationSeconds);
  root.className = 'session';
  root.innerHTML = `<div class="top"><span></span><b class="num" style="font-size:22px">${S.allDone ? 'Hoàn thành' : 'Kết thúc sớm'}</b><span></span></div>
    <div style="text-align:center;margin-top:10px"><h2 style="font-size:50px;color:var(--lime)">${S.allDone ? 'Làm tốt lắm' : 'Mỗi buổi đều có giá trị'}</h2><p class="muted">${esc(fmtDate(today()))}</p></div>
    <div class="summary">
      <div class="stat"><div class="k">Thời lượng thực tế</div><div class="v">${fmtMin(S.durationSeconds)}<small>phút</small></div></div>
      <div class="stat"><div class="k">Bài đã hoàn thành</div><div class="v">${S.completedCount}<small>/${S.uniq.length}</small></div></div>
      <div class="stat"><div class="k">Phút tập tuần này</div><div class="v">${ws.minutes + Math.round(S.durationSeconds / 60)}<small>phút</small></div></div>
      <div class="stat"><div class="k">Calo (ước tính thô)</div><div class="v">${k === null ? '—' : '~' + k}<small>${k === null ? '' : 'kcal'}</small></div></div></div>
    <p class="muted sm">${k === null ? 'Nhập cân nặng ở tab Tiến trình để xem ước tính calo.' : `Ước tính = ${String(MET_NOTE).replace('.', ',')} MET × cân nặng × thời gian. Sai số lớn, chỉ để tham khảo.`}</p>
    <textarea id="sNotes" rows="2" maxlength="300" placeholder="Ghi chú buổi tập (không bắt buộc)" aria-label="Ghi chú"></textarea>
    <div style="flex:1"></div>
    <button class="btn primary big" id="sSave" data-act="savesess">Lưu buổi tập</button>
    <button class="btn" data-act="closesess">Quay về trang chủ</button>`;
}
async function saveSession() {
  if (!S || S.saving || S.saved) return;
  const btn = $('#sSave'); S.saving = true; btn.disabled = true; btn.textContent = 'Đang lưu...';
  const p = { id: S.id, date: ymd(S.beginWall || new Date()), workoutId: S.wid, startTime: (S.beginWall || new Date()).toISOString(), endTime: S.endWall.toISOString(),
    durationSeconds: S.durationSeconds, completedExercises: S.completedCount, totalExercises: S.uniq.length, status: S.allDone ? 'completed' : 'partial', notes: ($('#sNotes') || {}).value || '' };
  lsSet('fit30_pending', JSON.stringify(p));
  try {
    const r = await api('saveWorkoutLog', p, { retries: 1 });
    S.saved = true; lsDel('fit30_pending');
    if (!state.workoutLogs.some(l => l.id === p.id)) state.workoutLogs.unshift(r.log);
    btn.textContent = 'Đã lưu'; toast('Đã lưu buổi tập', 'ok');
  } catch (e) { btn.disabled = false; btn.textContent = 'Thử lưu lại'; toast(errMsg(e), 'err'); }
  finally { if (S) S.saving = false; }
}
function closeSession() {
  if (!S) return;
  clearInterval(S.timer); document.removeEventListener('visibilitychange', onVis);
  try { if (S.wake) S.wake.release(); } catch (e) {}
  S = null; $('#sessionRoot').innerHTML = ''; document.body.style.overflow = '';
  render();
}
async function endSession() {
  if (!S) return;
  if (S.state === 'ready') { closeSession(); return; }
  const wasRunning = S.state === 'running'; if (wasRunning) pauseSession();
  const ok = await confirmBox('Kết thúc buổi tập?', 'Bạn có thể lưu phần đã tập ở bước tiếp theo.', 'Kết thúc', true);
  if (ok) finishSession(true); else if (wasRunning && S && S.state === 'paused') resumeSession();
}

/* ------------------------------ DINH DƯỠNG ------------------------------ */
const defMeal = () => { const h = new Date().getHours(); return h < 10 ? 'breakfast' : h < 15 ? 'lunch' : h < 21 ? 'dinner' : 'snack'; };
function dayFood(d) { return state.foodLogs.filter(l => l.date === d); }
function dayTotals(list) { return list.reduce((a, l) => ({ k: a.k + Number(l.totalCaloriesKcal || 0), p: a.p + Number(l.totalProteinGrams || 0), c: a.c + Number(l.totalCarbsGrams || 0), f: a.f + Number(l.totalFatGrams || 0) }), { k: 0, p: 0, c: 0, f: 0 }); }
function macroBox(t) { return `<div class="macro"><div><b>${fmtN(t.k, 0)}</b><span>kcal</span></div><div><b>${fmtN(t.p)}</b><span>Đạm (g)</span></div><div><b>${fmtN(t.c)}</b><span>Tinh bột (g)</span></div><div><b>${fmtN(t.f)}</b><span>Béo (g)</span></div></div>`; }
function vFood() {
  const d = state.foodDate, list = dayFood(d), t = dayTotals(list);
  return `<div class="pagehead"><h2>Dinh dưỡng</h2><p>Chụp món ăn, AI ước tính, bạn chỉnh lại rồi mới lưu.</p></div>
  <div class="stack">
    <div class="card"><div class="row between wrap"><input type="date" id="fDate" value="${d}" max="${today()}" style="width:auto" aria-label="Chọn ngày"><span class="muted sm">${esc(fmtDate(d))}</span></div><div style="margin-top:12px">${macroBox(t)}</div></div>
    <div class="card" id="analyzer">${analyzerHTML()}</div>
    ${['breakfast', 'lunch', 'dinner', 'snack'].map(m => { const L = list.filter(l => l.mealType === m); if (!L.length) return '';
      return `<div class="meal"><b>${MEAL_VI[m]}</b>${L.map(l => `<div class="hist"><div><div>${(l.foodItems || []).map(f => esc(f.name)).join(', ') || '—'}</div><div class="muted sm">${fmtN(l.totalCaloriesKcal, 0)} kcal · Đ ${fmtN(l.totalProteinGrams)} · T ${fmtN(l.totalCarbsGrams)} · B ${fmtN(l.totalFatGrams)}</div></div>
      <div class="row" style="gap:4px"><button class="btn ghost icon-btn" data-act="editfood" data-id="${esc(l.id)}" aria-label="Sửa">${icon('edit')}</button><button class="btn ghost icon-btn" data-act="delfood" data-id="${esc(l.id)}" aria-label="Xóa">${icon('trash')}</button></div></div>`).join('')}</div>`; }).join('')}
    ${list.length ? '' : '<div class="empty"><h3>Chưa có bữa nào trong ngày này</h3><p>Chụp món ăn đầu tiên để bắt đầu nhật ký.</p></div>'}
  </div>`;
}
function analyzerHTML() {
  if (state.draft && !state.draft.id) return draftHTML();
  const img = state.image;
  return `<b>Chụp món ăn</b>
  ${!state.geminiReady ? '<p class="muted sm" style="margin-top:6px">Backend chưa có GEMINI_API_KEY. Bạn vẫn có thể nhập món thủ công.</p>' : ''}
  ${img ? `<img class="preview" src="${img.url}" alt="Ảnh món ăn" style="margin-top:12px">` : ''}
  <div class="grid2" style="margin-top:12px">
    <button class="btn primary" data-act="shoot">${icon('cam')} ${img ? 'Chụp lại' : 'Chụp món ăn'}</button>
    <button class="btn" data-act="pick">Chọn ảnh khác</button></div>
  ${img ? `<button class="btn primary" style="width:100%;margin-top:10px" data-act="analyze" ${state.analyzing || !state.geminiReady ? 'disabled' : ''}>${state.analyzing ? 'Đang phân tích, chờ vài giây...' : 'Phân tích calo'}</button>` : ''}
  <button class="btn ghost" style="width:100%;margin-top:8px" data-act="manual">Nhập món thủ công</button>
  <input type="file" id="fCam" accept="image/*" capture="environment" hidden><input type="file" id="fPick" accept="image/jpeg,image/png,image/webp,image/*" hidden>`;
}
function bindFoodView() {
  const dt = $('#fDate'); if (dt) dt.onchange = async () => { if (!dt.value) return; state.foodDate = dt.value; await ensureFood(dt.value); render(); };
  ['fCam', 'fPick'].forEach(id => { const f = $('#' + id); if (f) f.onchange = () => { if (f.files && f.files[0]) onImage(f.files[0]); f.value = ''; }; });
}
async function ensureFood(d) {
  if (state.foodLoaded[d]) return;
  try { const r = await api('getFoodLogs', { fromDate: d, toDate: d }); state.foodLogs = state.foodLogs.filter(l => l.date !== d).concat(r.logs); state.foodLoaded[d] = true; }
  catch (e) { toast(errMsg(e), 'err'); }
}
function compress(file) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) return reject(new Error('Tệp không phải ảnh'));
    if (file.size > 25 * 1024 * 1024) return reject(new Error('Ảnh quá lớn (trên 25MB)'));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      let max = 1024, q = .8, out = null;
      for (let i = 0; i < 6; i++) {
        const sc = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement('canvas');
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        out = c.toDataURL('image/jpeg', q);
        if (out.length - 23 < 1300000) break; max = Math.round(max * .8); q = Math.max(.5, q - .08);
      }
      URL.revokeObjectURL(url);
      if (out.length - 23 >= 1300000) return reject(new Error('Không nén được ảnh đủ nhỏ'));
      resolve({ url: out, base64: out.split(',')[1], mime: 'image/jpeg' });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Không đọc được ảnh. Hãy thử ảnh JPEG hoặc PNG.')); };
    img.src = url;
  });
}
async function onImage(file) {
  try { state.image = await compress(file); state.draft = null; $('#analyzer').innerHTML = analyzerHTML(); bindFoodView(); }
  catch (e) { toast(e.message, 'err'); }
}
async function analyze() {
  if (state.analyzing || !state.image) return;
  state.analyzing = true; $('#analyzer').innerHTML = analyzerHTML(); bindFoodView();
  try {
    const r = await api('analyzeFoodImage', { mimeType: state.image.mime, imageBase64: state.image.base64 }, { timeout: 75000, retries: 0 });
    if (r.empty) { toast(r.uncertaintyNote || 'Không nhận diện được món ăn. Hãy chụp rõ hơn hoặc nhập thủ công.', 'err'); }
    else { state.draft = { id: null, date: state.foodDate, mealType: defMeal(), items: r.foods, note: r.uncertaintyNote, fromAI: true }; }
  } catch (e) { toast(errMsg(e), 'err'); }
  finally { state.analyzing = false; const a = $('#analyzer'); if (a) { a.innerHTML = analyzerHTML(); bindFoodView(); } }
}
function newItem() { return { name: '', estimatedGrams: '', caloriesKcal: '', proteinGrams: 0, carbsGrams: 0, fatGrams: 0, confidence: 'medium', assumptions: '' }; }
function draftTotals(dr) { return dr.items.reduce((a, i) => ({ k: a.k + (Number(i.caloriesKcal) || 0), p: a.p + (Number(i.proteinGrams) || 0), c: a.c + (Number(i.carbsGrams) || 0), f: a.f + (Number(i.fatGrams) || 0) }), { k: 0, p: 0, c: 0, f: 0 }); }
function draftHTML() {
  const dr = state.draft, mk = (i, k, label, type) => `<div><label class="f">${label}</label><input data-fi="${i}" data-fk="${k}" type="${type || 'number'}" inputmode="${type ? 'text' : 'decimal'}" min="0" step="any" value="${esc(dr.items[i][k])}"></div>`;
  return `${dr.fromAI ? `<b>Kết quả ước tính</b><p class="muted sm">${esc(dr.note || 'Đây là ước tính từ hình ảnh, hãy chỉnh lại nếu cần.')}</p>` : ''}
  <div class="grid2" style="margin-top:10px"><div><label class="f">Bữa ăn</label><select id="dMeal">${Object.keys(MEAL_VI).map(k => `<option value="${k}" ${k === dr.mealType ? 'selected' : ''}>${MEAL_VI[k]}</option>`).join('')}</select></div>
  <div><label class="f">Ngày</label><input type="date" id="dDate" value="${esc(dr.date)}" max="${today()}"></div></div>
  ${dr.items.map((it, i) => `<div class="fooditem"><div class="full">${mk(i, 'name', 'Tên món', 'text')}${it.assumptions ? `<p class="muted sm" style="margin-top:4px">Giả định: ${esc(it.assumptions)}</p>` : ''}</div>
    ${mk(i, 'estimatedGrams', 'Khối lượng (g)')}${mk(i, 'caloriesKcal', 'Calo (kcal)')}${mk(i, 'proteinGrams', 'Đạm (g)')}${mk(i, 'carbsGrams', 'Tinh bột (g)')}${mk(i, 'fatGrams', 'Béo (g)')}
    <div style="align-self:end"><button class="btn danger" style="width:100%" data-act="rmitem" data-i="${i}">${icon('trash')} Xóa món</button></div></div>`).join('')}
  <button class="btn ghost" style="width:100%;margin-top:10px" data-act="additem">+ Thêm món</button>
  <div id="dTot" style="margin-top:12px">${macroBox(draftTotals(dr))}</div>
  <div class="grid2" style="margin-top:12px"><button class="btn" data-act="canceldraft">Hủy</button><button class="btn primary" data-act="savefood" ${state.savingFood ? 'disabled' : ''}>${dr.id ? 'Cập nhật' : 'Lưu nhật ký'}</button></div>`;
}
function refreshDraft() { const t = $('#dTot'); if (t) t.innerHTML = macroBox(draftTotals(state.draft)); }
async function saveFood() {
  const dr = state.draft; if (!dr || state.savingFood) return;
  const items = dr.items.filter(i => String(i.name).trim() || i.caloriesKcal !== '');
  if (!items.length) return toast('Hãy nhập ít nhất một món.', 'err');
  for (const i of items) if (!String(i.name).trim() || !(Number(i.caloriesKcal) >= 0) || i.caloriesKcal === '') return toast('Mỗi món cần có tên và calo.', 'err');
  state.savingFood = true; rerenderDraft();
  try {
    const payload = { id: dr.id, date: dr.date, mealType: dr.mealType, foodItems: items.map(i => ({ name: i.name, estimatedGrams: i.estimatedGrams === '' ? '' : Number(i.estimatedGrams), caloriesKcal: Number(i.caloriesKcal), proteinGrams: Number(i.proteinGrams) || 0, carbsGrams: Number(i.carbsGrams) || 0, fatGrams: Number(i.fatGrams) || 0, confidence: i.confidence, assumptions: i.assumptions })) };
    const r = await api(dr.id ? 'updateFoodLog' : 'saveFoodLog', payload, { retries: dr.id ? 1 : 0 });
    state.foodLogs = state.foodLogs.filter(l => l.id !== r.log.id); state.foodLogs.push(r.log); state.foodLoaded[r.log.date] = true;
    state.draft = null; state.image = null; state.foodDate = r.log.date; closeModal(); toast('Đã lưu nhật ký', 'ok'); state.savingFood = false; render();
  } catch (e) { state.savingFood = false; toast(errMsg(e), 'err'); rerenderDraft(); }
}
function rerenderDraft() {
  const m = $('#modalRoot .modal'); if (m) { $('.sheet', m).innerHTML = `<h3>Sửa bữa ăn</h3>${draftHTML()}`; return; }
  const a = $('#analyzer'); if (a) { a.innerHTML = analyzerHTML(); bindFoodView(); }
}
function editFood(id) {
  const l = state.foodLogs.find(x => x.id === id); if (!l) return;
  state.draft = { id: l.id, date: l.date, mealType: l.mealType, items: (l.foodItems || []).map(i => Object.assign({}, i)), note: '', fromAI: false };
  openModal(`<h3>Sửa bữa ăn</h3>${draftHTML()}`, () => { if (state.draft && state.draft.id) state.draft = null; });
}
async function delFood(id) {
  if (!await confirmBox('Xóa bản ghi?', 'Bản ghi bữa ăn này sẽ bị xóa vĩnh viễn.', 'Xóa', true)) return;
  try { await api('deleteFoodLog', { id }); state.foodLogs = state.foodLogs.filter(l => l.id !== id); toast('Đã xóa', 'ok'); render(); } catch (e) { toast(errMsg(e), 'err'); }
}

/* ------------------------------ TIẾN TRÌNH ------------------------------ */
function lineChart(pts, goal, unit, color) {
  if (!pts.length) return '';
  const W = 320, H = 170, pd = { l: 38, r: 12, t: 12, b: 26 };
  const vs = pts.map(p => p.v); if (goal) vs.push(goal);
  let mn = Math.min(...vs), mx = Math.max(...vs); if (mn === mx) { mn -= 1; mx += 1; } const ex = (mx - mn) * .15; mn -= ex; mx += ex;
  const t0 = +parseD(pts[0].d), t1 = +parseD(pts[pts.length - 1].d);
  const X = d => pts.length === 1 ? W / 2 : pd.l + (+parseD(d) - t0) / ((t1 - t0) || 1) * (W - pd.l - pd.r);
  const Y = v => pd.t + (1 - (v - mn) / (mx - mn)) * (H - pd.t - pd.b);
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.d).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
  const short = d => { const x = parseD(d); return `${x.getDate()}/${x.getMonth() + 1}`; };
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ ${esc(unit)}">
    ${[0, .5, 1].map(f => { const v = mn + (mx - mn) * f, y = Y(v); return `<line x1="${pd.l}" x2="${W - pd.r}" y1="${y}" y2="${y}" stroke="#2a3832" stroke-width="1"/><text x="${pd.l - 6}" y="${y + 4}" text-anchor="end">${fmtN(v)}</text>`; }).join('')}
    ${goal ? `<line x1="${pd.l}" x2="${W - pd.r}" y1="${Y(goal)}" y2="${Y(goal)}" stroke="#ffb454" stroke-dasharray="4 4"/><text x="${W - pd.r}" y="${Y(goal) - 4}" text-anchor="end" style="fill:#ffb454">Mục tiêu ${fmtN(goal)}</text>` : ''}
    ${pts.length > 1 ? `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
    ${pts.map(p => `<circle cx="${X(p.d).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="3.6" fill="${color}"/>`).join('')}
    <text x="${pd.l}" y="${H - 6}">${short(pts[0].d)}</text>${pts.length > 1 ? `<text x="${W - pd.r}" y="${H - 6}" text-anchor="end">${short(pts[pts.length - 1].d)}</text>` : ''}</svg>`;
}
function vProgress() {
  const st = state.settings, wA = weightsAsc(), cA = waistAsc();
  const sW = st.startWeightKg || (wA[0] && Number(wA[0].weightKg)), sC = st.startWaistCm || (cA[0] && Number(cA[0].waistCm));
  const lW = wA.length ? Number(wA[wA.length - 1].weightKg) : null, lC = cA.length ? Number(cA[cA.length - 1].waistCm) : null;
  const hist = state.weightLogs.slice().sort((a, b) => a.date < b.date ? 1 : -1);
  const dl = (a, b) => a === null || !b ? '—' : `${a - b > 0 ? '+' : ''}${fmtN(a - b)}`;
  return `<div class="pagehead row between"><div><h2>Tiến trình</h2><p>Theo dõi cân nặng và vòng bụng.</p></div><button class="btn" data-act="settings">${icon('gear')} Mục tiêu</button></div>
  <div class="stack">
    <form class="card" id="wForm" autocomplete="off"><b>Ghi số đo mới</b>
      <div class="grid2" style="margin-top:12px"><div><label class="f">Ngày</label><input type="date" id="wDate" value="${today()}" max="${today()}" required></div>
      <div><label class="f">Cân nặng (kg)</label><input id="wKg" type="number" inputmode="decimal" step="0.1" min="20" max="400"></div>
      <div><label class="f">Vòng bụng (cm)</label><input id="wCm" type="number" inputmode="decimal" step="0.1" min="30" max="250"></div>
      <div><label class="f">Ghi chú</label><input id="wNote" maxlength="300"></div></div>
      <button class="btn primary" style="width:100%;margin-top:12px" id="wSave" type="submit">Lưu số đo</button></form>
    <div class="grid2">${statCard('So với lúc bắt đầu (cân nặng)', dl(lW, sW), 'kg', sW ? `Mốc: ${fmtN(sW)} kg` : 'Chưa có mốc')}${statCard('So với lúc bắt đầu (vòng bụng)', dl(lC, sC), 'cm', sC ? `Mốc: ${fmtN(sC)} cm` : 'Chưa có mốc')}</div>
    <div class="card"><b>Cân nặng</b>${wA.length ? lineChart(wA.map(l => ({ d: l.date, v: Number(l.weightKg) })), st.goalWeightKg, 'kg', '#c8f53a') : '<div class="empty" style="margin-top:10px"><h3>Chưa có cân nặng</h3><p>Nhập số đo đầu tiên ở trên để bắt đầu biểu đồ.</p></div>'}</div>
    <div class="card"><b>Vòng bụng</b>${cA.length ? lineChart(cA.map(l => ({ d: l.date, v: Number(l.waistCm) })), st.goalWaistCm, 'cm', '#6fb0ff') : '<div class="empty" style="margin-top:10px"><h3>Chưa có vòng bụng</h3><p>Đo ngang rốn, buổi sáng, cùng điều kiện mỗi lần.</p></div>'}</div>
    <div class="card"><b>Lịch sử đo</b>${hist.length ? hist.map(l => `<div class="hist"><div><b>${fmtDate(l.date, { day: 'numeric', month: 'numeric', year: 'numeric' })}</b><div class="muted sm">${l.weightKg !== '' ? fmtN(l.weightKg) + ' kg' : ''}${l.weightKg !== '' && l.waistCm !== '' ? ' · ' : ''}${l.waistCm !== '' ? fmtN(l.waistCm) + ' cm' : ''}${l.notes ? ' · ' + esc(l.notes) : ''}</div></div>
      <div class="row" style="gap:4px"><button class="btn ghost icon-btn" data-act="editw" data-id="${esc(l.id)}" aria-label="Sửa">${icon('edit')}</button><button class="btn ghost icon-btn" data-act="delw" data-id="${esc(l.id)}" aria-label="Xóa">${icon('trash')}</button></div></div>`).join('') : '<p class="muted" style="margin-top:8px">Chưa có lần đo nào.</p>'}</div></div>`;
}
async function saveWeight(ev) {
  ev.preventDefault(); if (state.savingWeight) return;
  const w = $('#wKg').value, c = $('#wCm').value;
  if (!w && !c) return toast('Nhập cân nặng hoặc vòng bụng.', 'err');
  state.savingWeight = true; $('#wSave').disabled = true;
  try {
    const r = await api('saveWeightLog', { date: $('#wDate').value, weightKg: w, waistCm: c, notes: $('#wNote').value }, { retries: 0 });
    state.weightLogs.push(r.log); toast('Đã lưu số đo', 'ok'); state.savingWeight = false; render();
  } catch (e) { state.savingWeight = false; $('#wSave').disabled = false; toast(errMsg(e), 'err'); }
}
function editWeight(id) {
  const l = state.weightLogs.find(x => x.id === id); if (!l) return;
  const m = openModal(`<h3>Sửa số đo</h3><div class="stack"><div class="grid2"><div><label class="f">Ngày</label><input type="date" id="eDate" value="${esc(l.date)}" max="${today()}"></div>
    <div><label class="f">Cân nặng (kg)</label><input id="eKg" type="number" step="0.1" value="${esc(l.weightKg)}"></div><div><label class="f">Vòng bụng (cm)</label><input id="eCm" type="number" step="0.1" value="${esc(l.waistCm)}"></div>
    <div><label class="f">Ghi chú</label><input id="eNote" maxlength="300" value="${esc(l.notes)}"></div></div>
    <div class="grid2"><button class="btn" data-act="closemodal">Hủy</button><button class="btn primary" id="eSave">Cập nhật</button></div></div>`);
  $('#eSave', m).onclick = async e => {
    const b = e.currentTarget; if (b.disabled) return; b.disabled = true;
    try { const r = await api('updateWeightLog', { id, date: $('#eDate', m).value, weightKg: $('#eKg', m).value, waistCm: $('#eCm', m).value, notes: $('#eNote', m).value }, { retries: 1 });
      state.weightLogs = state.weightLogs.map(x => x.id === id ? r.log : x); closeModal(); toast('Đã cập nhật', 'ok'); render(); }
    catch (er) { b.disabled = false; toast(errMsg(er), 'err'); }
  };
}
async function delWeight(id) {
  if (!await confirmBox('Xóa lần đo?', 'Bản ghi sẽ bị xóa vĩnh viễn.', 'Xóa', true)) return;
  try { await api('deleteWeightLog', { id }); state.weightLogs = state.weightLogs.filter(l => l.id !== id); toast('Đã xóa', 'ok'); render(); } catch (e) { toast(errMsg(e), 'err'); }
}

/* ------------------------------ CÀI ĐẶT / MỤC TIÊU ------------------------------ */
function openSettings() {
  const s = state.settings, v = x => x === null || x === undefined ? '' : x;
  const m = openModal(`<h3>Mục tiêu và cài đặt</h3><div class="stack">
    <p class="muted sm">Hãy chọn mục tiêu vừa sức. Giảm khoảng 0,25–0,5 kg mỗi tuần thường dễ duy trì hơn.</p>
    <div class="grid2"><div><label class="f">Cân nặng bắt đầu (kg)</label><input id="sSW" type="number" step="0.1" value="${esc(v(s.startWeightKg))}"></div><div><label class="f">Cân nặng mục tiêu (kg)</label><input id="sGW" type="number" step="0.1" value="${esc(v(s.goalWeightKg))}"></div>
    <div><label class="f">Vòng bụng bắt đầu (cm)</label><input id="sSC" type="number" step="0.1" value="${esc(v(s.startWaistCm))}"></div><div><label class="f">Vòng bụng mục tiêu (cm)</label><input id="sGC" type="number" step="0.1" value="${esc(v(s.goalWaistCm))}"></div>
    <div><label class="f">Buổi tập mỗi tuần</label><input id="sWk" type="number" min="1" max="7" value="${esc(s.weeklyGoal || 4)}"></div><div><label class="f">Phút mặc định</label><input id="sMin" type="number" min="10" max="90" value="${esc(s.defaultMinutes || 30)}"></div></div>
    <label class="row"><input type="checkbox" id="sSnd" style="width:22px;min-height:22px" ${soundOn() ? 'checked' : ''}> Âm báo khi tập</label>
    <label class="row"><input type="checkbox" id="sVib" style="width:22px;min-height:22px" ${vibeOn() ? 'checked' : ''}> Rung (nếu thiết bị hỗ trợ)</label>
    <p class="muted sm">Model AI: ${esc(state.modelName || 'xem CONFIG trong code.gs')}</p>
    <div class="grid2"><button class="btn danger" id="sOut">Đổi mật khẩu truy cập</button><button class="btn primary" id="sSave2">Lưu</button></div></div>`);
  $('#sOut', m).onclick = () => { lsDel('fit30_pc'); passcode = ''; location.reload(); };
  $('#sSave2', m).onclick = async e => {
    const b = e.currentTarget; if (b.disabled) return; b.disabled = true;
    lsSet('fit30_sound', $('#sSnd', m).checked ? '1' : '0'); lsSet('fit30_vibe', $('#sVib', m).checked ? '1' : '0');
    try {
      const r = await api('updateSettings', { startWeightKg: $('#sSW', m).value, goalWeightKg: $('#sGW', m).value, startWaistCm: $('#sSC', m).value, goalWaistCm: $('#sGC', m).value, weeklyGoal: $('#sWk', m).value, defaultMinutes: $('#sMin', m).value });
      state.settings = r.settings; closeModal(); toast('Đã lưu', 'ok'); render();
    } catch (er) { b.disabled = false; toast(errMsg(er), 'err'); }
  };
}

/* ------------------------------ SỰ KIỆN CHUNG ------------------------------ */
const ACTS = {
  closemodal: closeModal, start: el => openSession(el.dataset.id), exdetail: el => exDetail(el.dataset.id), editplan: editPlan, settings: openSettings,
  playvid: el => playVid(el.closest('.vid')),
  startsess: startSession, pausesess: pauseSession, resumesess: resumeSession, skipstep: skipStep, redostep: redoStep, endsess: endSession,
  savesess: saveSession, closesess: closeSession,
  togglesound: () => { lsSet('fit30_sound', soundOn() ? '0' : '1'); unlockAudio(); const b = $('#sSound'); if (b) b.innerHTML = icon(soundOn() ? 'vol' : 'mute'); },
  shoot: () => { const f = $('#fCam'); if (f) f.click(); }, pick: () => { const f = $('#fPick'); if (f) f.click(); }, analyze,
  manual: () => { state.draft = { id: null, date: state.foodDate, mealType: defMeal(), items: [newItem()], note: '', fromAI: false }; rerenderDraft(); },
  additem: () => { state.draft.items.push(newItem()); rerenderDraft(); }, rmitem: el => { state.draft.items.splice(Number(el.dataset.i), 1); if (!state.draft.items.length) state.draft.items.push(newItem()); rerenderDraft(); },
  canceldraft: () => { if (state.draft && state.draft.id) closeModal(); state.draft = null; rerenderDraft(); }, savefood: saveFood,
  editfood: el => editFood(el.dataset.id), delfood: el => delFood(el.dataset.id), editw: el => editWeight(el.dataset.id), delw: el => delWeight(el.dataset.id)
};
document.addEventListener('click', e => {
  const nav = e.target.closest('[data-nav]'); if (nav) { go(nav.dataset.nav); return; }
  const a = e.target.closest('[data-act]'); if (a && ACTS[a.dataset.act]) { e.preventDefault(); ACTS[a.dataset.act](a); }
});
document.addEventListener('input', e => {
  const t = e.target, d = state.draft;
  if (t.dataset && t.dataset.fi !== undefined && d) { const it = d.items[Number(t.dataset.fi)]; if (it) { it[t.dataset.fk] = t.type === 'number' ? t.value : t.value; refreshDraft(); } }
  else if (t.id === 'dMeal' && d) d.mealType = t.value; else if (t.id === 'dDate' && d) d.date = t.value;
});
document.addEventListener('submit', e => { if (e.target.id === 'wForm') saveWeight(e); });
$('#btnSettingsSide') && ($('#btnSettingsSide').onclick = openSettings);
window.addEventListener('beforeunload', () => { if (S && S.state === 'running') pauseSession(); });

/* ------------------------------ KHỞI ĐỘNG ------------------------------ */
function showGate(msg) {
  $('#app').hidden = true; $('#bottomNav').hidden = true;
  const g = $('#gate'); g.hidden = false;
  g.innerHTML = `<h1>FIT<b>30</b></h1><p class="muted" style="margin:6px 0 22px">30 Minutes to a Better You</p>
    <form id="gForm" class="stack"><div><label class="f" for="gPw">Mật khẩu truy cập</label><input id="gPw" type="password" autocomplete="current-password" required></div>
    ${msg ? `<p style="color:var(--bad)">${esc(msg)}</p>` : ''}<button class="btn primary big" type="submit">VÀO ỨNG DỤNG</button></form>`;
  $('#gForm').onsubmit = e => { e.preventDefault(); passcode = $('#gPw').value; lsSet('fit30_pc', passcode); boot(); };
}
function showFatal(msg) {
  $('#app').hidden = true; $('#bottomNav').hidden = true;
  const g = $('#gate'); g.hidden = false;
  g.innerHTML = `<h1>FIT<b>30</b></h1><div class="card" style="margin-top:20px"><b>Không kết nối được máy chủ</b><p class="muted" style="margin:6px 0 14px">${esc(msg)}</p><button class="btn primary" id="gRetry">Thử lại</button></div>`;
  $('#gRetry').onclick = boot;
}
async function boot() {
  $('#gate').hidden = true; $('#app').hidden = false; $('#bottomNav').hidden = false;
  state.loaded = false; go(state.tab);
  try {
    const h = await api('health', {}, { timeout: 30000 });
    state.modelName = h.model;
    if (h.passcodeRequired && !passcode) return showGate('');
    await loadAll();
  } catch (e) {
    if (e.code === 'UNAUTHORIZED') { lsDel('fit30_pc'); passcode = ''; return showGate('Sai mật khẩu, hãy thử lại.'); }
    if (e.code === 'NOT_SETUP') return showFatal('Chưa khởi tạo Google Sheets. Hãy chạy setupFit30() trong Apps Script Editor.');
    return showFatal(errMsg(e) + (e.code === 'TIMEOUT' ? ' Kiểm tra GAS_URL, quyền truy cập "Anyone" và phiên bản deploy mới nhất.' : ''));
  }
  go(state.tab);
  const pend = lsGet('fit30_pending', ''); // buổi tập chưa lưu được lần trước
  if (pend) { try { const r = await api('saveWorkoutLog', JSON.parse(pend)); lsDel('fit30_pending'); if (!state.workoutLogs.some(l => l.id === r.log.id)) state.workoutLogs.unshift(r.log); toast('Đã lưu buổi tập trước đó', 'ok'); render(); } catch (e) {} }
}
boot();