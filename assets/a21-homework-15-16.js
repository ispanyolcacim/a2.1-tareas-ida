'use strict';

const part = Number(document.body.dataset.part);
const isListening = part === 1;
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-BwEhVOhO6GkkQHNWJA8LQLMkEGwNCtJ3BXSqik1RnzqZLl4a_a3HmYEoIlJAgY4Wkg/exec';
const SPREADSHEET_ID = '1wziyxdRdIGL7OEq4yRib0i_CaCWJGI14fwDyMKB4abw';
const taskColumn = 'H4 – 15-16.Ders (' + part + '. KISIM)';
const letters = ['A', 'B', 'C', 'D'];
const byId = id => document.getElementById(id);

const sections = isListening
  ? [...RIOJA_TRACKS.map((track, i) => ({ label: (i + 1) + '. Dinleme', maximum: 30, track })),
    { label: 'Kelime Bilgisi', maximum: 10 }]
  : [{ label: 'Cümle Dönüştürme', maximum: 40 }, { label: 'Yanlış Soruyu Bulma', maximum: 60 }];

function listeningQuestions() {
  const questions = [];
  RIOJA_TRACKS.forEach((track, section) => {
    track.gaps = [];
    track.paragraphs = track.transcript.split('\n\n').map(paragraph =>
      paragraph.replace(/\[\[([^\]]+)\]\]/g, (_, word) => {
        const number = questions.length + 1;
        const item = { kind: 'gap', answer: word, section, number, gap: track.gaps.length + 1 };
        track.gaps.push(item);
        questions.push(item);
        return '[[' + number + ']]';
      })
    );
    track.questions.forEach(item => questions.push({
      ...item, kind: 'choice', section, number: questions.length + 1
    }));
  });
  RIOJA_VOCABULARY.forEach(item => questions.push({
    ...item, kind: 'choice', section: 3, number: questions.length + 1
  }));
  return questions;
}

const questions = isListening ? listeningQuestions() : [
  ...TF_DATA.map(item => ({ ...item, kind: 'transform', section: 0, number: item.n })),
  ...MC_DATA.map(item => ({
    ...item, kind: 'choice', section: 1, number: item.n,
    prompt: 'Cevaba uygun olmayan soruyu seçiniz.',
    options: item.opts.map(option => [option]),
    answer: item.ans
  }))
];

const pages = questions.filter(question => question.kind !== 'gap' || question.gap === 1);
let page = 0;
let studentName = '';
let currentAudio = null;
let frozenResult = null;
let saving = false;
const answers = new Map();
const drafts = new Map();
const checkedGaps = new Set();

const navigation = byId('jump-select');
const questionCard = byId('question');
function questionRange(question) {
  if (question.kind !== 'gap') return String(question.number);
  const gaps = sections[question.section].track.gaps;
  return gaps[0].number + '–' + gaps.at(-1).number;
}

const questionOptions = pages.map((question, index) => new Option(questionRange(question), index));
sections.forEach((section, i) => {
  const group = document.createElement('optgroup');
  group.label = section.label;
  pages.forEach((question, index) => {
    if (question.section === i) group.append(questionOptions[index]);
  });
  navigation.append(group);
});

function showScreen(name) {
  for (const id of ['name', 'quiz', 'confirm', 'result']) {
    byId(id + '-screen').hidden = id !== name;
  }
  if (name !== 'quiz') renderAudio(null);
  window.scrollTo(0, 0);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function comparison(value, foldCase = false) {
  const normalized = value.trim().normalize('NFC');
  return foldCase ? normalized.toLocaleLowerCase('es') : normalized;
}

function correctGap(value, question) {
  return comparison(value, true) === comparison(question.answer, true);
}

function correctTransform(value, item) {
  return item.answer.split('|').some(choice => comparison(value) === comparison(choice));
}

function renderAudio(track) {
  if (track === currentAudio) return;
  currentAudio = track;
  const container = byId('listening');
  container.hidden = !track;
  container.replaceChildren();
  if (!track) return;

  const trackNumber = RIOJA_TRACKS.indexOf(track) + 1;
  const title = document.createElement('h2');
  title.lang = 'es';
  title.textContent = 'La magia de La Rioja ' + trackNumber + ' · ' + track.title;
  const player = document.createElement('iframe');
  const parameters = new URLSearchParams({
    url: 'https://api.soundcloud.com/tracks/' + track.audio,
    color: '#b92568', auto_play: 'false', hide_related: 'true', visual: 'false',
    show_comments: 'false', show_reposts: 'false', show_teaser: 'false'
  });
  player.src = 'https://w.soundcloud.com/player/?' + parameters;
  player.title = 'SoundCloud · ' + title.textContent;
  player.allow = 'autoplay; encrypted-media';
  const link = document.createElement('a');
  link.href = 'https://soundcloud.com/profe-hazel/la-magia-de-rioja-' + trackNumber;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'SoundCloud’da aç ↗';
  container.append(title, player, link);
}

function header(question, prompt, lang = 'tr') {
  return '<header><span class="hw-question-number">' + questionRange(question) + '</span>'
    + '<h2 id="prompt" lang="' + lang + '">' + escapeHtml(prompt) + '</h2></header>';
}

function gapCard(question, track) {
  const checked = checkedGaps.has(question.section);
  const locked = checked || Boolean(frozenResult);
  const gapsByNumber = new Map(track.gaps.map(item => [item.number, item]));
  const passage = track.paragraphs.map(paragraph => '<p>' + escapeHtml(paragraph)
    .replace(/\[\[(\d+)\]\]/g, (_, token) => {
      const gap = gapsByNumber.get(Number(token));
      const answer = answers.get(gap.number);
      const value = answer?.value ?? drafts.get(gap.number) ?? '';
      const status = checked && !answer ? 'is-blank' : inputResult(answer?.correct);
      return '<label class="cloze-gap"><span aria-hidden="true">(' + gap.gap + ')</span> '
        + '<input class="answer-input ' + status + '" type="text" data-gap="' + gap.number
        + '" aria-label="Boşluk ' + gap.gap + '" lang="es" spellcheck="false" autocomplete="off" autocapitalize="off"'
        + ' value="' + escapeHtml(value) + '"' + (locked ? ' disabled' : '') + '></label>';
    }) + '</p>').join('');

  const feedback = checked ? gapFeedback(track.gaps) : '';
  return header(question, 'Dinleyin ve metindeki boşlukları doldurun.')
    + '<p class="cloze-instructions">Duyamadığınız kelimeleri boş bırakabilirsiniz. Aksanlara ve ñ harfine dikkat edin.</p>'
    + '<form class="written-form"><div class="cloze-passage" lang="es">' + passage + '</div>'
    + (locked ? '' : '<button class="btn btn-main" type="submit">✔ Boşlukları kontrol et</button>')
    + '</form>' + feedback;
}

function gapFeedback(gaps) {
  let correct = 0;
  let wrong = 0;
  const items = gaps.map(gap => {
    const answer = answers.get(gap.number);
    if (answer?.correct) {
      correct++;
      return '<li>✅ ' + gap.gap + '. Doğru · <strong lang="es">' + escapeHtml(gap.answer) + '</strong></li>';
    }
    const accentOnly = answer && comparison(answer.value, true).normalize('NFD').replace(/\p{M}/gu, '') ===
      comparison(gap.answer, true).normalize('NFD').replace(/\p{M}/gu, '');
    if (answer) wrong++;
    const status = answer ? '❌ ' + gap.gap + '. Yanlış' : '➖ ' + gap.gap + '. Boş';
    return '<li>' + status + ' · Doğru yazım <strong lang="es">' + escapeHtml(gap.answer) + '</strong>'
      + (accentOnly ? ' · Aksanı veya ñ harfini kontrol edin.' : '') + '</li>';
  }).join('');
  return '<div class="notice" role="status"><p class="cloze-counts">' + correct + ' doğru · ' + wrong
    + ' yanlış · ' + (gaps.length - correct - wrong) + ' boş</p><ol class="cloze-feedback">' + items + '</ol></div>';
}

function inputResult(correct) {
  return typeof correct === 'boolean' ? (correct ? 'is-correct' : 'is-wrong') : '';
}

function transformCard(question) {
  const checked = answers.get(question.number);
  const values = checked?.value ?? drafts.get(question.number) ?? ['', '', '', ''];
  const locked = Boolean(checked || frozenResult);
  const items = question.items.map((item, i) => {
    const correct = checked ? correctTransform(values[i], item) : undefined;
    const disabled = locked || (i > 0 && !values[i - 1].trim());
    const feedback = checked ? '<p>' + (correct ? '✅ Doğru.' : '❌ Doğru cevap <strong lang="es">'
      + escapeHtml(item.answer.split('|')[0].trim()) + '</strong>.') + ' ' + escapeHtml(item.exp) + '</p>' : '';
    return '<div class="tf-item"><label for="tf-' + i + '">' + escapeHtml(item.tag) + ' <small>· 0,5 puan</small></label>'
      + '<p lang="es">' + escapeHtml(item.sentence.replace('__', '______')) + '</p>'
      + '<input class="answer-input ' + inputResult(correct) + '" id="tf-' + i + '" lang="es" spellcheck="false" autocomplete="off"'
      + ' value="' + escapeHtml(values[i]) + '" required' + (disabled ? ' disabled' : '') + '>' + feedback + '</div>';
  }).join('');
  return header(question, 'Presente cümlesini verilen dört yapıya dönüştürün.')
    + '<p class="original-sentence" lang="es">' + escapeHtml(question.presente) + '</p>'
    + '<form class="written-form">' + items + (locked ? '' : '<button class="btn btn-main" type="submit">✔ Dört cevabı da kontrol et</button>')
    + '</form>';
}

function choiceCard(question) {
  const checked = answers.get(question.number);
  const choices = question.options.map(([label], i) => {
    const status = checked && (i === question.answer ? ' is-correct'
      : i === checked.value ? ' is-wrong' : '');
    const marker = checked && (i === question.answer ? '✓ ' : i === checked.value ? '✗ ' : '');
    return '<button class="option' + (status || '') + '" data-choice="' + i + '" type="button" lang="es"'
      + (checked || frozenResult ? ' disabled' : '') + '><span class="option-letter">' + (marker || '') + letters[i]
      + '</span><span>' + escapeHtml(label) + '</span></button>';
  }).join('');
  const explanations = question.exp ? '<p>' + escapeHtml(question.exp) + '</p>' : '<ul>'
    + question.options.map(([, explanation], i) => '<li><strong>' + letters[i]
      + (i === question.answer ? ' · Doğru' : ' · Yanlış') + '</strong> ' + escapeHtml(explanation) + '</li>').join('') + '</ul>';
  const feedback = checked ? '<div class="notice ' + inputResult(checked.correct)
    + '" aria-live="polite"><strong>' + (checked.correct ? '✅ Doğru. 2 puan.' : '❌ Doğru seçenek ' + letters[question.answer] + '.')
    + '</strong>' + explanations + '</div>' : '';
  return header(question, question.prompt, isListening ? 'es' : 'tr')
    + (question.resp ? '<p class="original-sentence" lang="es">' + escapeHtml(question.resp) + '</p>' : '')
    + '<div class="answer-list">' + choices + '</div>' + feedback;
}

function render() {
  const question = pages[page];
  const section = sections[question.section];
  renderAudio(section.track ?? null);
  questionCard.innerHTML = question.kind === 'gap' ? gapCard(question, section.track)
    : question.kind === 'transform' ? transformCard(question) : choiceCard(question);

  const graded = [...answers.values()];
  const correct = graded.filter(answer => answer.correct).length;
  const partial = graded.filter(answer => answer.points > 0 && !answer.correct).length;
  byId('top-student').textContent = studentName;
  byId('top-scores').innerHTML = '<span class="score-correct">✓ ' + correct + '</span>'
    + '<span class="score-wrong">✗ ' + (graded.length - correct - partial) + '</span>'
    + (partial ? '<span>◐ ' + partial + ' kısmen doğru</span>' : '');
  byId('answered-count').textContent = graded.length + ' / 50 soru yanıtlandı';
  byId('progress').value = graded.length;
  byId('section-name').textContent = section.label + (question.kind === 'gap' ? ' · Boşluk doldurma' : '');
  const range = questionRange(question);
  byId('question-progress').textContent = 'Soru ' + range + ' / 50';
  byId('nav-counter').textContent = range + ' / 50';
  byId('previous').disabled = page === 0;
  byId('next').disabled = page === pages.length - 1;
  byId('open-confirm').textContent = frozenResult ? 'Sonuca dön' : '✔ Ödevi Teslim Et';
  pages.forEach((item, index) => {
    if (item.kind === 'gap') {
      const completed = checkedGaps.has(item.section);
      const hasDraft = sections[item.section].track.gaps.some(gap => drafts.has(gap.number));
      questionOptions[index].textContent = questionRange(item) + (completed ? ' · Kontrol edildi' : hasDraft ? ' · Taslak' : ' · Boşluklar');
      return;
    }
    const answer = answers.get(item.number);
    const state = answer ? (answer.correct ? ' · ✓' : answer.points ? ' · ◐' : ' · ✗')
      : drafts.has(item.number) ? ' · Taslak' : '';
    questionOptions[index].textContent = item.number + state;
  });
  navigation.value = String(page);
}

function move(index) {
  const next = pages[index];
  if (!next) return;
  const changedSection = pages[page].section !== next.section;
  page = index;
  render();
  const target = changedSection && sections[next.section].track ? byId('listening') : questionCard;
  target.scrollIntoView({ block: 'start' });
}

function saveAnswer(question, value, points) {
  answers.set(question.number, { value, points, correct: points === 2 });
  drafts.delete(question.number);
  render();
}

questionCard.addEventListener('input', event => {
  const question = pages[page];
  if (question.kind === 'gap') {
    const number = Number(event.target.dataset.gap);
    const value = event.target.value;
    if (value.trim()) drafts.set(number, value);
    else drafts.delete(number);
    return;
  }
  const inputs = [...questionCard.querySelectorAll('input')];
  const values = inputs.map(input => input.value);
  let unlocked = true;
  inputs.forEach((input, i) => {
    input.disabled = !unlocked;
    if (!unlocked) values[i] = input.value = '';
    unlocked = unlocked && Boolean(values[i].trim());
  });
  if (values.some(value => value.trim())) drafts.set(question.number, values);
  else drafts.delete(question.number);
});

questionCard.addEventListener('submit', event => {
  event.preventDefault();
  const question = pages[page];
  if (answers.has(question.number) || frozenResult) return;
  const fields = [...event.target.querySelectorAll('input')];
  const values = fields.map(input => input.value.trim());
  if (question.kind === 'gap') {
    if (checkedGaps.has(question.section)) return;
    sections[question.section].track.gaps.forEach((gap, i) => {
      const value = values[i];
      if (value) {
        const correct = correctGap(value, gap);
        answers.set(gap.number, { value, points: correct ? 2 : 0, correct });
      }
      drafts.delete(gap.number);
    });
    checkedGaps.add(question.section);
    render();
    questionCard.querySelector('.cloze-counts')?.scrollIntoView({ block: 'nearest' });
    return;
  }
  if (values.length !== 4 || values.some(value => !value)) {
    fields.find(field => !field.disabled && !field.value.trim())?.focus();
    return;
  }
  const correct = question.items.filter((item, i) => correctTransform(values[i], item)).length;
  saveAnswer(question, values, correct / 2);
});

questionCard.addEventListener('click', event => {
  const button = event.target.closest('[data-choice]');
  const question = pages[page];
  if (!button || answers.has(question.number) || frozenResult) return;
  const chosen = Number(button.dataset.choice);
  saveAnswer(question, chosen, chosen === question.answer ? 2 : 0);
});

byId('name-screen').addEventListener('submit', event => {
  event.preventDefault();
  studentName = byId('name-select').value;
  if (!studentName) return;
  showScreen('quiz');
  render();
});

byId('previous').addEventListener('click', () => move(page - 1));
byId('next').addEventListener('click', () => move(page + 1));
navigation.addEventListener('change', () => move(Number(navigation.value)));
byId('open-confirm').addEventListener('click', () => {
  if (frozenResult) {
    showScreen('result');
    return;
  }
  byId('confirm-name-select').value = studentName;
  const blank = questions.length - answers.size;
  byId('confirm-summary').textContent = blank
    ? blank + ' soru boş bırakıldı veya henüz kontrol edilmedi. Teslim ederseniz bu sorular boş sayılacak.'
    : '50 sorunun tamamı kontrol edildi. Sonucunuzu kaydetmek için adınızı onaylayın.';
  showScreen('confirm');
});
byId('back-to-quiz').addEventListener('click', () => {
  showScreen('quiz');
  render();
});
byId('review').addEventListener('click', () => {
  showScreen('quiz');
  render();
});

function scoreResult() {
  const sectionScores = sections.map(() => 0);
  let correct = 0;
  let partial = 0;
  let wrong = 0;
  questions.forEach(question => {
    const answer = answers.get(question.number);
    if (!answer) return;
    sectionScores[question.section] += answer.points;
    if (answer.correct) correct++;
    else if (answer.points > 0) partial++;
    else wrong++;
  });
  return {
    score: sectionScores.reduce((sum, score) => sum + score, 0),
    sectionScores, correct, partial, wrong, blank: questions.length - answers.size
  };
}

function buildSubmission(name, result) {
  const now = new Date();
  const zone = { timeZone: 'Europe/Istanbul' };
  const date = new Intl.DateTimeFormat('tr-TR', { ...zone, day: '2-digit', month: '2-digit', year: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('tr-TR', { ...zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now);
  const wrong = result.wrong + result.partial;
  const counts = '✓' + result.correct + ' ✗' + wrong;
  return {
    spreadsheetId: SPREADSHEET_ID, sheetName: 'A2.1', studentName: name,
    taskColumn, score: result.score, correct: result.correct, wrong, blank: result.blank,
    formatted: ['✅ ' + (result.score / 2) + '/50', counts, date, time].join('\n')
  };
}

async function saveSubmission() {
  if (saving || !frozenResult) return;
  saving = true;
  const status = byId('result-status');
  const retry = byId('retry-save');
  retry.hidden = true;
  status.className = 'notice';
  status.textContent = '⏳ Sonuç kaydediliyor…';
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(frozenResult.payload)
    });
    const receipt = await response.json();
    if (!response.ok || receipt.success !== true) throw new Error('Sheet rejected the result');
    status.classList.add('is-correct');
    status.textContent = '✅ Ödev e-tabloya kaydedildi.';
  } catch {
    status.classList.add('is-wrong');
    status.textContent = '⚠️ Kaydı doğrulayamadık. Sonucunuzu yeniden gönderebilirsiniz.';
    retry.hidden = false;
  } finally {
    saving = false;
  }
}

byId('confirm-screen').addEventListener('submit', event => {
  event.preventDefault();
  const name = byId('confirm-name-select').value;
  if (!name || frozenResult) return;
  studentName = name;
  const result = scoreResult();
  frozenResult = { payload: buildSubmission(name, result) };
  byId('result-name').textContent = name + ' · ' + part + '. Kısım';
  byId('result-score').textContent = result.score + ' / 100';
  byId('result-breakdown').innerHTML = sections.map((section, i) => '<div><dt>' + escapeHtml(section.label)
    + '</dt><dd>' + result.sectionScores[i] + ' / ' + section.maximum + '</dd></div>').join('');
  const partial = result.partial ? ' · ' + result.partial + ' kısmen doğru' : '';
  byId('result-counts').textContent = result.correct + ' doğru' + partial + ' · ' + result.wrong + ' yanlış · ' + result.blank + ' boş';
  showScreen('result');
  saveSubmission();
});
byId('retry-save').addEventListener('click', saveSubmission);
