'use strict';

const exercises = [
  {
    id: 'vocab-meaning',
    options: [
      'Recipiente con tierra donde crece una planta.',
      'Poner agua en la tierra para que crezcan las plantas.',
      'Lugar donde se detiene el autobús para que suban o bajen los pasajeros.',
      'Recipiente pequeño, normalmente de vidrio, con una tapa.',
      'Bolsa que se lleva en la espalda.',
      'Lo que se ve al mirar un lugar, como sus montañas, campos o casas.',
      'Construcción de una plaza o un jardín de la que sale agua.',
      'Etapa de la vida en la que una persona es niña.',
    ],
    items: [['la mochila',4], ['el paisaje',5], ['la infancia',7], ['la parada',2],
      ['las macetas',0], ['la fuente',6], ['el frasco',3], ['regar',1]],
  },
  {
    id: 'vocab-opposites',
    options: ['sucio', 'moderna', 'silencio', 'cerca', 'corto', 'tarde'],
    items: [['lejos',3], ['temprano',5], ['antigua',1], ['largo',4], ['ruido',2], ['limpio',0]],
  },
  {
    id: 'vocab-groups',
    options: ['Naturaleza', 'Alimentos', 'Viaje y transporte'],
    items: [['la estación',2], ['la miel',1], ['el río',0], ['el autobús',2], ['el queso',1],
      ['los árboles',0], ['la carretera',2], ['la mantequilla',1], ['las montañas',0]],
  },
];

for (const {id, options, items} of exercises) {
  const form = document.getElementById(id);
  const letters = 'ABCDEFGH';
  form.querySelector('.vocab-rows').innerHTML = items.map(([word], index) => {
    const inputId = id + '-' + index;
    return `<div class="vocab-row">
      <label for="${inputId}" lang="es">${word}</label>
      <select id="${inputId}" required>
        <option value="">Seç</option>
        ${options.map((text, choice) => `<option value="${choice}" lang="es">${letters[choice]}. ${text}</option>`).join('')}
      </select>
      <p class="vocab-feedback" hidden></p>
    </div>`;
  }).join('');
  form.querySelector('.vocab-rows').insertAdjacentHTML('beforebegin',
    `<ol class="vocab-print-bank" type="A" lang="es">${options.map(text => `<li>${text}</li>`).join('')}</ol>`);
  form.insertAdjacentHTML('beforeend', `<div class="vocab-actions">
    <button type="submit">Kontrol et</button>
    <button type="reset">Temizle</button>
    <output aria-live="polite"></output>
  </div>`);

  const rows = [...form.querySelectorAll('.vocab-row')];
  const output = form.querySelector('output');
  function clearFeedback() {
    for (const row of rows) row.querySelector('.vocab-feedback').hidden = true;
    output.textContent = '';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    let correct = 0;
    rows.forEach((row, index) => {
      const expected = items[index][1];
      const match = row.querySelector('select').value === String(expected);
      const feedback = row.querySelector('.vocab-feedback');
      if (match) correct++;
      feedback.textContent = match ? '✓ Doğru' : 'Doğru cevap · ' + options[expected];
      feedback.dataset.correct = String(match);
      feedback.hidden = false;
    });
    output.textContent = correct + ' / ' + items.length + ' doğru';
  });
  form.addEventListener('reset', clearFeedback);
  form.addEventListener('change', clearFeedback);
}

const tabs = [...document.querySelectorAll('.lesson-tabs [role="tab"]')];
function showLessonPage(index, focus = false) {
  tabs.forEach((tab, position) => {
    const active = position === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) tabs[index].focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showLessonPage(index));
  tab.addEventListener('keydown', event => {
    const nextByKey = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0, End: tabs.length - 1,
    };
    if (!Object.hasOwn(nextByKey, event.key)) return;
    event.preventDefault();
    showLessonPage(nextByKey[event.key], true);
  });
});

const initialPage = tabs.findIndex(tab => tab.getAttribute('aria-controls') === location.hash.slice(1));
showLessonPage(Math.max(0, initialPage));
if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
