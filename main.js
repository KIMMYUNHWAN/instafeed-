/* ═══════════════════════════════════════════════
   CLAY CLUB – Card Generator  ·  main.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ── DOM refs ── */
const inputIndex    = document.getElementById('inputIndex');
const inputTitle    = document.getElementById('inputTitle');
const inputSource   = document.getElementById('inputSource');
const inputLink     = document.getElementById('inputLink');
const inputFooter   = document.getElementById('inputFooter');
const imageFileInput = document.getElementById('imageFileInput');
const cardImageArea  = document.getElementById('cardImageArea');
const imageDropZone  = document.getElementById('imageDropZone');
const uploadHint     = document.getElementById('uploadHint');
const colorInputRow  = document.getElementById('colorInputRow');
const btnAddColor    = document.getElementById('btnAddColor');
const btnDownload    = document.getElementById('btnDownload');

const previewIndex  = document.getElementById('previewIndex');
const previewTitle  = document.getElementById('previewTitle');
const previewSource = document.getElementById('previewSource');
const previewLink   = document.getElementById('previewLink');
const previewFooter = document.getElementById('previewFooter');
const previewImage  = document.getElementById('previewImage');
const previewColorRow = document.getElementById('previewColorRow');

/* ── State ── */
let colors = []; // [{hex, code}]
const MAX_COLORS = 6;

/* ══════════════════════════════════════
   LIVE BIND – text inputs
══════════════════════════════════════ */
function bindLive(input, target, transform) {
  input.addEventListener('input', () => {
    const val = input.value.trim() || input.placeholder;
    target.textContent = transform ? transform(val) : val;
  });
}

bindLive(inputIndex,  previewIndex);
bindLive(inputTitle,  previewTitle);
bindLive(inputSource, previewSource);
bindLive(inputFooter, previewFooter);

inputLink.addEventListener('input', () => {
  previewLink.textContent = inputLink.value.trim() || inputLink.placeholder;
});

/* ══════════════════════════════════════
   IMAGE UPLOAD
══════════════════════════════════════ */
function applyImage(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('이미지 파일만 업로드할 수 있습니다.');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    uploadHint.textContent = `✓ ${file.name}`;
    showToast('이미지가 변경되었습니다 ✨');
  };
  reader.readAsDataURL(file);
}

imageFileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) applyImage(file);
});

/* Drag & Drop on card image area */
cardImageArea.addEventListener('dragover', e => {
  e.preventDefault();
  cardImageArea.classList.add('drag-over');
});
cardImageArea.addEventListener('dragleave', () => {
  cardImageArea.classList.remove('drag-over');
});
cardImageArea.addEventListener('drop', e => {
  e.preventDefault();
  cardImageArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) applyImage(file);
});

/* ══════════════════════════════════════
   COLOR CHIPS
══════════════════════════════════════ */

/**
 * Parse a user-typed string into a valid CSS hex color.
 * Accepts: #RGB, #RRGGBB, RGB/RRGGBB (without #), named colors.
 * Returns a hex string like "#a1b2c3" or null if invalid.
 */
function parseColor(raw) {
  if (!raw || !raw.trim()) return null;
  let s = raw.trim();
  // add # if missing and looks like hex digits
  if (/^[0-9a-fA-F]{3}$/.test(s) || /^[0-9a-fA-F]{6}$/.test(s)) s = '#' + s;

  const tmp = document.createElement('canvas').getContext('2d');
  tmp.fillStyle = '#000'; // reset
  tmp.fillStyle = s;
  // If browser couldn't parse it, fillStyle stays '#000000' – but '#000000' is valid too
  const resolved = tmp.fillStyle;
  // Check if it actually changed or was always black
  if (resolved === '#000000' && s !== '#000000' && s.toLowerCase() !== 'black' && s !== '#000') return null;
  return resolved; // e.g. "#1a2b3c"
}

function hexToDisplay(hex) {
  return hex.toUpperCase();
}

function renderColorChips() {
  previewColorRow.innerHTML = '';
  const hasChips = colors.some(c => c.hex);
  previewColorRow.classList.toggle('has-chips', hasChips);

  colors.forEach(c => {
    if (!c.hex) return;
    const chip = document.createElement('div');
    chip.className = 'color-chip';
    chip.style.background = c.hex;
    chip.setAttribute('data-code', c.display || hexToDisplay(c.hex));
    chip.title = c.display || hexToDisplay(c.hex);
    previewColorRow.appendChild(chip);
  });
}

function addColorEntry(initialHex = '#cccccc', initialCode = '') {
  if (colors.length >= MAX_COLORS) {
    showToast(`컬러는 최대 ${MAX_COLORS}개까지 추가할 수 있습니다.`);
    return;
  }

  const idx = colors.length;
  colors.push({ hex: initialHex, display: initialCode || hexToDisplay(initialHex) });

  const entry = document.createElement('div');
  entry.className = 'color-entry';
  entry.dataset.idx = idx;

  // Swatch (opens native color picker)
  const swatchBtn = document.createElement('button');
  swatchBtn.className = 'color-swatch-btn';
  swatchBtn.type = 'button';
  swatchBtn.style.background = initialHex;
  swatchBtn.title = '색상 피커 열기';

  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.value = initialHex;
  swatchBtn.appendChild(colorPicker);

  // Code input
  const codeInput = document.createElement('input');
  codeInput.type = 'text';
  codeInput.className = 'color-code-input';
  codeInput.placeholder = '#RRGGBB 또는 색상코드';
  codeInput.value = initialCode || hexToDisplay(initialHex);
  codeInput.maxLength = 30;

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-color';
  removeBtn.innerHTML = '<i class="fa fa-xmark"></i>';
  removeBtn.title = '삭제';

  entry.appendChild(swatchBtn);
  entry.appendChild(codeInput);
  entry.appendChild(removeBtn);
  colorInputRow.appendChild(entry);

  /* ── Events ── */

  // Color picker → swatch + code input + chip
  colorPicker.addEventListener('input', () => {
    const hex = colorPicker.value;
    swatchBtn.style.background = hex;
    codeInput.value = hexToDisplay(hex);
    colors[idx].hex = hex;
    colors[idx].display = hexToDisplay(hex);
    renderColorChips();
  });

  // Code input → try to parse color
  codeInput.addEventListener('input', () => {
    const raw = codeInput.value;
    const parsed = parseColor(raw);
    colors[idx].display = raw.toUpperCase() || hexToDisplay(colors[idx].hex);
    if (parsed) {
      colors[idx].hex = parsed;
      swatchBtn.style.background = parsed;
      colorPicker.value = parsed;
    }
    renderColorChips();
  });

  // Remove
  removeBtn.addEventListener('click', () => {
    colors.splice(idx, 1);
    entry.remove();
    // Re-index remaining entries
    const remaining = colorInputRow.querySelectorAll('.color-entry');
    remaining.forEach((el, i) => { el.dataset.idx = i; });
    renderColorChips();
  });

  renderColorChips();
}

btnAddColor.addEventListener('click', () => addColorEntry());

/* Seed with two default colors to match reference */
addColorEntry('#cccccc', '#CCCCCC');
addColorEntry('#888888', '#888888');

/* ══════════════════════════════════════
   DOWNLOAD (html2canvas)
══════════════════════════════════════ */
btnDownload.addEventListener('click', async () => {
  const card = document.getElementById('cardFrame');
  btnDownload.disabled = true;
  btnDownload.innerHTML = '<i class="fa fa-circle-notch fa-spin"></i> 생성 중…';

  try {
    const canvas = await html2canvas(card, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement('a');
    const title = (inputTitle.value.trim() || 'card').replace(/\s+/g, '_');
    link.download = `clayclub_${title}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('카드가 저장되었습니다! 🎉');
  } catch (err) {
    console.error(err);
    showToast('저장 중 오류가 발생했습니다.');
  } finally {
    btnDownload.disabled = false;
    btnDownload.innerHTML = '<i class="fa fa-download"></i> 카드 이미지 저장';
  }
});

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
let toastTimeout;
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ══════════════════════════════════════
   INIT – sync placeholders to preview
══════════════════════════════════════ */
(function init() {
  previewIndex.textContent  = inputIndex.value  || inputIndex.placeholder;
  previewTitle.textContent  = inputTitle.value  || inputTitle.placeholder;
  previewSource.textContent = inputSource.value || inputSource.placeholder;
  previewLink.textContent   = inputLink.value   || inputLink.placeholder;
  previewFooter.textContent = inputFooter.value || inputFooter.placeholder;
})();
