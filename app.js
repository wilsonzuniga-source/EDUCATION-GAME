/* ===== STUDENT DATA (filled at registration) ===== */
const STUDENT = { nombre: '', apellido: '', edad: '', mama: '', papa: '', direccion: '', photo: null };
const APP = { level: 1, section: 0, question: 0, errors: {}, startTime: 0, totalErrors: 0, lastSpoken: '', qStartTime: 0 };

/* ===== QUESTIONS - use STUDENT data for validation ===== */
function buildSections() {
  return [
    {
      name: 'Identidad', icon: '🪪', questions: [
        {
          L1: {
            text: '¿Cuál es tu nombre?', type: 'image-select',
            options: () => {
              const d = [STUDENT.nombre, 'Roberto', 'Lucía', 'Pedro'].sort(() => Math.random() - .5);
              return d.map(n => ({ e: n === STUDENT.nombre ? '🧒' : '👤', t: n, correct: n === STUDENT.nombre }));
            }
          },
          L2: { text: 'Ordena las letras de tu nombre', type: 'order', answer: () => STUDENT.nombre.toUpperCase() },
          L3: { text: 'Escribe tu nombre completo', type: 'write', answer: () => STUDENT.nombre }
        },
        {
          L1: {
            text: '¿Cuántos años tienes?', type: 'image-select',
            options: () => {
              const age = parseInt(STUDENT.edad);
              const d = [age, age + 1, age - 1, age + 2].map(a => ({ e: `${a}️`, t: `${a} años`, correct: a === age }));
              return d.sort(() => Math.random() - .5);
            }
          },
          L2: { text: `Completa: ¿Cuántos años tienes?`, type: 'fill', answer: () => STUDENT.edad },
          L3: { text: 'Escribe tu edad', type: 'write', answer: () => STUDENT.edad }
        }
      ]
    },
    {
      name: 'Familiares', icon: '👨‍👩‍👧‍👦', questions: [
        {
          L1: {
            text: '¿Cómo se llama tu mamá?', type: 'image-select',
            options: () => {
              const d = [STUDENT.mama, 'Ana García', 'Rosa Martínez', 'Laura Sánchez'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
              while (d.length < 4) d.push('Otra persona');
              return d.sort(() => Math.random() - .5).map(n => ({ e: n === STUDENT.mama ? '👩' : '👤', t: n, correct: n === STUDENT.mama }));
            }
          },
          L2: { text: 'Ordena las letras del nombre de tu mamá', type: 'order', answer: () => STUDENT.mama.split(' ')[0].toUpperCase() },
          L3: { text: 'Escribe el nombre completo de tu mamá', type: 'write', answer: () => STUDENT.mama }
        },
        {
          L1: {
            text: '¿Cómo se llama tu papá?', type: 'image-select',
            options: () => {
              const d = [STUDENT.papa, 'Juan López', 'Miguel Torres', 'Diego Ruiz'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);
              while (d.length < 4) d.push('Otra persona');
              return d.sort(() => Math.random() - .5).map(n => ({ e: n === STUDENT.papa ? '👨' : '👤', t: n, correct: n === STUDENT.papa }));
            }
          },
          L2: { text: '¿Cómo se llama tu papá?', type: 'fill', answer: () => STUDENT.papa },
          L3: { text: 'Escribe el nombre de tu papá', type: 'write', answer: () => STUDENT.papa }
        }
      ]
    },
    {
      name: 'Domicilio', icon: '🏠', questions: [
        {
          L1: {
            text: '¿Dónde vives?', type: 'image-select',
            options: () => [
              { e: '🏠', t: 'En una casa', correct: true }, { e: '🏫', t: 'En la escuela', correct: false },
              { e: '🏥', t: 'En el hospital', correct: false }, { e: '🛒', t: 'En la tienda', correct: false }
            ].sort(() => Math.random() - .5)
          },
          L2: { text: 'Ordena las palabras de tu dirección', type: 'order', answer: () => STUDENT.direccion.split(' ').slice(0, 3).join(' ').toUpperCase() },
          L3: { text: 'Escribe tu dirección completa', type: 'write', answer: () => STUDENT.direccion }
        }
      ]
    }
  ];
}

/* ===== HELPERS ===== */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
function showScreen(id) { $$('.screen').forEach(s => s.classList.remove('active')); $(id).classList.add('active'); window.scrollTo(0, 0) }

/* ===== WEB SPEECH ===== */
function speak(text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES'; u.rate = 0.85; u.pitch = 1.1;
  const v = speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
  if (v) u.voice = v;
  APP.lastSpoken = text;
  speechSynthesis.speak(u);
}
$('btnRepeatAudio').onclick = () => { if (APP.lastSpoken) speak(APP.lastSpoken) };
if (speechSynthesis.onvoiceschanged !== undefined) speechSynthesis.onvoiceschanged = () => { };

/* ===== POSITIVE REINFORCEMENT ===== */
const REWARDS = [
  { emoji: '🌟', text: '¡Excelente trabajo!' }, { emoji: '🏆', text: '¡Eres un campeón!' },
  { emoji: '🎉', text: '¡Lo lograste, felicidades!' }, { emoji: '💪', text: '¡Muy bien, sigue así!' },
  { emoji: '🦸', text: '¡Eres un superhéroe!' }, { emoji: '🌈', text: '¡Brillante respuesta!' },
  { emoji: '🥇', text: '¡Número uno!' }, { emoji: '⭐', text: '¡Eres fantástico!' },
  { emoji: '🎯', text: '¡Justo en el blanco!' }, { emoji: '🚀', text: '¡Vas volando de bien!' }
];

function showReward() {
  const r = REWARDS[Math.floor(Math.random() * REWARDS.length)];
  $('rewardEmoji').textContent = r.emoji;
  $('rewardText').textContent = r.text;
  $('rewardOverlay').classList.remove('hidden');
  speak(r.text);
  spawnConfetti();
  setTimeout(() => $('rewardOverlay').classList.add('hidden'), 2200);
}

function spawnConfetti() {
  const colors = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#FF6B6B', '#A29BFE'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = Math.random() * 0.8 + 's';
    p.style.animationDuration = (1.5 + Math.random()) + 's';
    p.style.width = (8 + Math.random() * 8) + 'px';
    p.style.height = (8 + Math.random() * 8) + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

/* ===== PHOTO UPLOAD ===== */
document.querySelector('.btn-upload').onclick = () => $('photoInput').click();
$('photoInput').onchange = e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    STUDENT.photo = ev.target.result;
    const img = $('photoPreviewImg');
    img.src = ev.target.result;
    img.classList.remove('hidden');
    document.querySelector('.photo-placeholder').classList.add('hidden');
  };
  reader.readAsDataURL(file);
};

/* ===== LEVEL SELECT ===== */
$$('.btn-level').forEach(btn => {
  btn.onclick = () => {
    $$('.btn-level').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false') });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    APP.level = parseInt(btn.dataset.level);
  };
});

/* ===== START GAME ===== */
$('btnStartGame').onclick = () => {
  // Validate all fields
  const fields = { nombre: 'regNombre', apellido: 'regApellido', edad: 'regEdad', mama: 'regMama', papa: 'regPapa', direccion: 'regDireccion' };
  for (const [key, id] of Object.entries(fields)) {
    const val = $(id).value.trim();
    if (!val) { speak('Por favor completa el campo: ' + $(id).previousElementSibling.textContent); $(id).focus(); return; }
    STUDENT[key] = val;
  }
  // Go to puzzle if photo exists, else go to questions
  if (STUDENT.photo) {
    showScreen('screenPuzzle');
    initPuzzle();
    speak('¡Muy bien ' + STUDENT.nombre + '! Ahora arma tu foto como rompecabezas.');
  } else {
    startQuestions();
  }
};

function startQuestions() {
  APP.section = 0; APP.question = 0; APP.errors = {}; APP.totalErrors = 0;
  APP.startTime = Date.now();
  showScreen('screenQuestions');
  loadQuestion();
}

$('btnDashboard').onclick = () => { showScreen('screenDashboard'); loadDashboard() };
$('btnBackFromPuzzle').onclick = () => showScreen('screenRegister');
$('btnBackFromQ').onclick = () => showScreen('screenRegister');
$('btnBackFromDash').onclick = () => showScreen('screenRegister');
$('btnRestart').onclick = () => showScreen('screenRegister');
$('btnGoToDash').onclick = () => { showScreen('screenDashboard'); loadDashboard() };
$('btnSkipPuzzle').onclick = () => startQuestions();

/* ===== PUZZLE ===== */
let puzzleData = { img: null, cols: 2, rows: 2, placed: [] };

function initPuzzle() {
  puzzleData.img = new Image();
  puzzleData.img.onload = () => buildPuzzle();
  puzzleData.img.src = STUDENT.photo;
}

function buildPuzzle() {
  const lvl = APP.level;
  const firstName = STUDENT.nombre.trim().split(' ')[0].toUpperCase();
  if (lvl === 1) { puzzleData.cols = Math.max(2, firstName.length); puzzleData.rows = 1 }
  else if (lvl === 2) { puzzleData.cols = 3; puzzleData.rows = 2 }
  else { puzzleData.cols = 3; puzzleData.rows = 3 }
  const total = puzzleData.cols * puzzleData.rows;
  const size = Math.min(300, window.innerWidth - 60);
  const cw = Math.floor(size / puzzleData.cols), ch = Math.floor(size / puzzleData.rows);
  const grid = $('puzzleTarget');
  grid.style.gridTemplateColumns = `repeat(${puzzleData.cols},${cw}px)`;
  grid.style.gridTemplateRows = `repeat(${puzzleData.rows},${ch}px)`;
  grid.innerHTML = '';
  puzzleData.placed = new Array(total).fill(false);
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.className = 'puzzle-cell'; cell.dataset.index = i; 
    if (lvl === 1) {
      const letterChar = i < firstName.length ? firstName[i] : '';
      cell.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;padding-bottom:10px;opacity:0.5;">
          <div style="font-size:2rem;font-weight:900">${letterChar}</div>
          <div style="font-size:1.4rem;font-weight:800">${i + 1}</div>
        </div>`;
    } else {
      cell.textContent = i + 1;
    }
    cell.ondragover = e => { e.preventDefault(); cell.classList.add('drag-over') };
    cell.ondragleave = () => cell.classList.remove('drag-over');
    cell.ondrop = e => handleDrop(e, cell, i, cw, ch);
    grid.appendChild(cell);
  }
  const pDiv = $('puzzlePieces'); pDiv.innerHTML = '';
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
  canvas.width = puzzleData.img.width; canvas.height = puzzleData.img.height;
  ctx.drawImage(puzzleData.img, 0, 0);
  const pw = puzzleData.img.width / puzzleData.cols, ph = puzzleData.img.height / puzzleData.rows;
  let idx = Array.from({ length: total }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[idx[i], idx[j]] = [idx[j], idx[i]] }
  idx.forEach(ii => {
    const pc = document.createElement('canvas'); pc.width = pw; pc.height = ph;
    pc.getContext('2d').drawImage(puzzleData.img, (ii % puzzleData.cols) * pw, Math.floor(ii / puzzleData.cols) * ph, pw, ph, 0, 0, pw, ph);
    const w = document.createElement('div');
    w.className = 'puzzle-piece'; w.style.width = cw + 'px'; w.style.height = ch + 'px';
    w.draggable = true; w.dataset.index = ii;
    const img = document.createElement('img'); img.src = pc.toDataURL(); w.appendChild(img);
    if (lvl === 1) {
      const letterChar = ii < firstName.length ? firstName[ii] : '';
      const color = ['#2ed573', '#ff4757', '#9b59b6', '#2e86de', '#ff9f43', '#1dd1a1'][ii % 6];
      const indicators = document.createElement('div');
      indicators.className = 'puzzle-piece-indicators';
      indicators.innerHTML = `
        <div class="puzzle-piece-letter" style="color:${color}">${letterChar}</div>
        <div class="puzzle-piece-num" style="color:${color}">${ii + 1}</div>
      `;
      w.appendChild(indicators);
    }
    w.ondragstart = e => { e.dataTransfer.setData('text/plain', ii); w.classList.add('dragging') };
    w.ondragend = () => w.classList.remove('dragging');
    // Touch
    let clone = null;
    w.ontouchstart = () => { APP._dp = w; APP._di = ii; clone = w.cloneNode(true); clone.style.cssText = 'position:fixed;opacity:.7;pointer-events:none;z-index:9999'; document.body.appendChild(clone) };
    w.ontouchmove = e => { e.preventDefault(); if (clone) { const t = e.touches[0]; clone.style.left = (t.clientX - cw / 2) + 'px'; clone.style.top = (t.clientY - ch / 2) + 'px' } };
    w.ontouchend = e => { if (clone) { clone.remove(); clone = null } const t = e.changedTouches[0]; const el = document.elementFromPoint(t.clientX, t.clientY); if (el && el.classList.contains('puzzle-cell')) placePiece(w, el, APP._di, parseInt(el.dataset.index), cw, ch) };
    pDiv.appendChild(w);
  });
  $('puzzlePreview').innerHTML = `<img src="${STUDENT.photo}" alt="Vista previa">`;
  // Render Student Name Guide below the puzzle area
  const nameGuide = $('puzzleNameGuide');
  nameGuide.innerHTML = STUDENT.nombre.toUpperCase().split('').map(letter => `<span class="name-guide-letter">${letter}</span>`).join('');
}

function handleDrop(e, cell, ci, cw, ch) {
  e.preventDefault(); cell.classList.remove('drag-over');
  const pi = parseInt(e.dataTransfer.getData('text/plain'));
  placePiece(document.querySelector(`.puzzle-piece[data-index="${pi}"]`), cell, pi, ci, cw, ch);
}

function placePiece(pieceEl, cell, pi, ci, cw, ch) {
  if (puzzleData.placed[ci]) return;
  if (pi === ci) {
    cell.innerHTML = ''; cell.classList.add('filled');
    const img = document.createElement('img'); img.src = pieceEl.querySelector('img').src;
    img.style.width = cw + 'px'; img.style.height = ch + 'px'; cell.appendChild(img);
    pieceEl.remove(); puzzleData.placed[ci] = true;
    if (puzzleData.placed.every(Boolean)) {
      showReward();
      setTimeout(() => startQuestions(), 2500);
    } else speak('¡Bien!');
  } else {
    cell.style.animation = 'shake .4s ease'; setTimeout(() => cell.style.animation = '', 400);
    speak('Intenta de nuevo');
  }
}

/* ===== QUESTIONS ===== */
let selectedAnswer = null, currentOptions = null;

function getQ() {
  const secs = buildSections();
  const sec = secs[APP.section];
  return { sec, qd: sec.questions[APP.question][`L${APP.level}`] };
}
function totalQ() { return buildSections().reduce((s, sec) => s + sec.questions.length, 0) }
function curIdx() { let i = 0; const secs = buildSections(); for (let j = 0; j < APP.section; j++)i += secs[j].questions.length; return i + APP.question }

function loadQuestion() {
  selectedAnswer = null; currentOptions = null;
  APP.qStartTime = Date.now();
  const { sec, qd } = getQ();
  $('sectionTitle').textContent = `${sec.icon} ${sec.name}`;
  $('progressFill').style.width = ((curIdx()) / totalQ() * 100) + '%';
  const area = $('questionArea');
  let html = `<p class="question-text">${qd.text}</p>`;
  if (qd.type === 'image-select') {
    currentOptions = typeof qd.options === 'function' ? qd.options() : qd.options;
    html += '<div class="options-grid">';
    currentOptions.forEach((o, i) => {
      html += `<button class="option-btn" data-idx="${i}" onclick="selectOpt(this,${i})"><span class="option-emoji">${o.e}</span><span>${o.t}</span></button>`;
    });
    html += '</div>';
  } else if (qd.type === 'write' || qd.type === 'fill') {
    html += `<input type="text" class="input-answer" id="ansInput" placeholder="${qd.type === 'fill' ? 'Escribe aquí tu respuesta' : 'Escribe tu respuesta completa'}" autocomplete="off">`;
  } else if (qd.type === 'order') {
    const word = typeof qd.answer === 'function' ? qd.answer() : 'NOMBRE';
    const letters = word.split('');
    const shuf = [...letters].sort(() => Math.random() - .5);
    html += '<p style="text-align:center;margin-bottom:10px;font-weight:600">Resultado:</p><div class="order-container" id="oTarget">';
    letters.forEach((_, i) => html += `<div class="order-slot" data-pos="${i}"></div>`);
    html += '</div><br><p style="text-align:center;margin-bottom:10px;font-weight:600">Letras disponibles:</p><div class="order-container" id="oSource">';
    shuf.forEach((l, i) => html += `<button class="order-word" data-letter="${l}" onclick="pickL(this)">${l}</button>`);
    html += '</div>';
  }
  area.innerHTML = html;
  speak(qd.text);
}

window.selectOpt = function (btn, idx) {
  $$('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected'); selectedAnswer = idx;
};

window.pickL = function (btn) {
  const slots = $$('#oTarget .order-slot');
  for (const s of slots) {
    if (!s.classList.contains('filled')) {
      s.textContent = btn.textContent; s.classList.add('filled'); s.dataset.letter = btn.dataset.letter;
      s.onclick = () => { s.textContent = ''; s.classList.remove('filled'); delete s.dataset.letter; btn.style.display = '' };
      btn.style.display = 'none'; break;
    }
  }
};

/* ===== SUBMIT ===== */
$('btnSubmitAnswer').onclick = () => {
  const { qd } = getQ();
  const key = `${APP.section}-${APP.question}`;
  let correct = false;

  if (qd.type === 'image-select') {
    if (selectedAnswer === null) { speak('Selecciona una respuesta'); return }
    correct = currentOptions[selectedAnswer].correct === true;
  } else if (qd.type === 'write' || qd.type === 'fill') {
    const val = document.getElementById('ansInput')?.value.trim();
    if (!val) { speak('Escribe tu respuesta'); return }
    const expected = typeof qd.answer === 'function' ? qd.answer() : '';
    correct = normalize(val) === normalize(expected);
  } else if (qd.type === 'order') {
    const slots = $$('#oTarget .order-slot');
    const expected = typeof qd.answer === 'function' ? qd.answer() : '';
    let result = ''; slots.forEach(s => result += (s.dataset.letter || ''));
    if (result.length < expected.length) { speak('Coloca todas las letras'); return }
    correct = result === expected;
  }

  if (!correct) {
    APP.errors[key] = (APP.errors[key] || 0) + 1; APP.totalErrors++;
    showFeedback(false);
    speak('Intenta de nuevo, tú puedes ' + STUDENT.nombre);
  } else {
    showFeedback(true);
    saveRecord(key);
    showReward();
    setTimeout(() => nextQ(), 2400);
  }
};

function normalize(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim() }

function showFeedback(ok) {
  const fb = $('feedback');
  fb.textContent = ok ? '✅ ¡Correcto!' : '❌ Intenta de nuevo';
  fb.className = `feedback ${ok ? 'correct' : 'incorrect'}`;
  fb.classList.remove('hidden');
  setTimeout(() => fb.classList.add('hidden'), 2000);
}

function nextQ() {
  const secs = buildSections();
  APP.question++;
  if (APP.question >= secs[APP.section].questions.length) {
    APP.question = 0; APP.section++;
    if (APP.section >= secs.length) { showResults(); return }
    speak(`¡Siguiente sección: ${secs[APP.section].name}!`);
  }
  loadQuestion();
}

function showResults() {
  const elapsed = Math.round((Date.now() - APP.startTime) / 1000);
  $('resultMsg').textContent = `${STUDENT.nombre} ${STUDENT.apellido}, completaste todas las secciones.`;
  $('resultStats').innerHTML = `
    <div class="stat-item"><div class="stat-value">${APP.level}</div><div class="stat-label">Nivel</div></div>
    <div class="stat-item"><div class="stat-value">${APP.totalErrors}</div><div class="stat-label">Errores</div></div>
    <div class="stat-item"><div class="stat-value">${elapsed}s</div><div class="stat-label">Tiempo</div></div>
    <div class="stat-item"><div class="stat-value">3</div><div class="stat-label">Secciones</div></div>`;
  showScreen('screenResult');
  speak(`¡Felicidades ${STUDENT.nombre}! Completaste el juego con ${APP.totalErrors} errores en ${elapsed} segundos. ¡Eres increíble!`);
  spawnConfetti();
}

/* ===== DASHBOARD ===== */
function saveRecord(key) {
  const secs = buildSections();
  const elapsed = Math.round((Date.now() - APP.qStartTime) / 1000);
  const r = {
    student: `${STUDENT.nombre} ${STUDENT.apellido}`, level: APP.level, section: secs[APP.section].name,
    question: `P${APP.question + 1}`, errors: APP.errors[key] || 0, time: elapsed, date: new Date().toLocaleDateString('es-ES')
  };
  const d = JSON.parse(localStorage.getItem('autonomia_records') || '[]');
  d.push(r); localStorage.setItem('autonomia_records', JSON.stringify(d));
}

function loadDashboard() {
  const d = JSON.parse(localStorage.getItem('autonomia_records') || '[]');
  if (!d.length) { $('dashBody').innerHTML = ''; $('dashEmpty').classList.remove('hidden'); return }
  $('dashEmpty').classList.add('hidden');
  $('dashBody').innerHTML = d.map(r => `<tr><td>${r.student}</td><td>⭐${r.level}</td><td>${r.section}</td><td>${r.question}</td><td>${r.errors}</td><td>${r.time}</td><td>${r.date}</td></tr>`).join('');
}

$('btnExportData').onclick = () => {
  const d = JSON.parse(localStorage.getItem('autonomia_records') || '[]');
  if (!d.length) { speak('No hay datos'); return }
  let csv = 'Estudiante,Nivel,Sección,Pregunta,Errores,Tiempo,Fecha\n';
  d.forEach(r => csv += `${r.student},${r.level},${r.section},${r.question},${r.errors},${r.time},${r.date}\n`);
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'registro_autonomia.csv'; a.click();
};

$('btnClearData').onclick = () => {
  if (confirm('¿Borrar todos los registros?')) { localStorage.removeItem('autonomia_records'); loadDashboard(); speak('Registros borrados') }
};

/* Init */
speak('Bienvenido al juego de Autonomía Funcional. Completa tus datos y sube tu foto para comenzar.');
