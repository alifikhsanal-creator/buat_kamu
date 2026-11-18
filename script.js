// ==========================================
// 1. LOGIKA PERTANYAAN BERTAHAP
// ==========================================
const answers = {
  mood: '',
  matcha: '',
  makan: ''
};

const moodReplies = {
  'Seneng banget! 🥰': 'Ikut seneng dengernya! Semoga mood bagusnya nular seharian ya ✨',
  'Lumayan oke 😊': 'Mantap! Hari yang tenang juga udah keren banget kok 🌷',
  'Agak capek 😮‍💨': 'Peluk jauh dulu 🤗 Istirahat bentar ya, jangan dipaksain terus.',
  'Lagi badmood 🥺': 'Yah, sini-sini cerita. Semoga setelah ini mood-nya balik cerah lagi ya 💗'
};

const matchaReplies = {
  'Udah dong, enak banget! 🍵': 'Asik! Tim pecinta matcha sejati memang beda auranya 💚🩷',
  'Belum, lagi pengen nih 🤤': 'Wah kode keras nih, abis ini wajib beli matcha dingin biar seger!',
  'Ganti minuman lain dulu 🧋': 'Oke deh, yang penting tetep cukup minum biar nggak dehidrasi~',
  'Traktir matcha dong! 🤭': 'Boleh banget! Nanti kita agendakan jajan matcha bareng ya 😆'
};

const makanReplies = {
  'Udah kenyang! 🍽️': 'Good girl! Energi udah penuh, siap menjalani hari dengan ceria!',
  'Baru ngemil dikit 🍪': 'Ngemil boleh, tapi nanti tetep makan makanan berat ya biar kuat!',
  'Belum makan nih 🥺': 'Hayo jangan ditunda-tunda! Abis mainin love di layar langsung makan ya!',
  'Lagi mager nyari makan 🛌': 'Pesen online aja biar praktis, yang penting perutnya keisi ya!'
};

const optionButtons = document.querySelectorAll('.option-btn');
const dots = document.querySelectorAll('.dot');

optionButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const step = parseInt(btn.getAttribute('data-step'), 10);
    const val = btn.getAttribute('data-value');

    if (step === 1) {
      answers.mood = val;
      document.getElementById('reply-1').textContent = moodReplies[val];
      goToStep(2);
    } else if (step === 2) {
      answers.matcha = val;
      document.getElementById('reply-2').textContent = matchaReplies[val];
      goToStep(3);
    } else if (step === 3) {
      answers.makan = val;
      startEnding();
    }
  });
});

function goToStep(stepNumber) {
  document.querySelectorAll('.step').forEach((s) => s.classList.remove('active'));
  document.getElementById(`step-${stepNumber}`).classList.add('active');

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx < stepNumber);
  });
}

function startEnding() {
  const container = document.getElementById('cardContainer');
  const endingUI = document.getElementById('endingUI');
  const finalSummary = document.getElementById('finalSummary');

  finalSummary.textContent = `${makanReplies[answers.makan]} Makasih udah jawab dengan jujur hari ini. Nih aku kasih banyak love buat nemenin kamu!`;

  container.classList.add('fade-out');
  document.body.classList.add('ending-active');

  setTimeout(() => {
    endingUI.classList.remove('hidden');
    initParticles();
  }, 450);
}

// ==========================================
// 2. KANVAS PARTIKEL LOVE DIAM & INTERAKTIF
// ==========================================
const canvas = document.getElementById('loveCanvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initParticles();
});

const pointer = {
  x: -9999,
  y: -9999,
  isDown: false
};

let interactionMode = 'repel'; // 'repel' atau 'attract'
const pinkColors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#c9184a', '#ff0a54'];

class HeartParticle {
  constructor(x, y, isExtra = false) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.vx = isExtra ? (Math.random() - 0.5) * 8 : 0;
    this.vy = isExtra ? (Math.random() - 0.5) * 8 : 0;
    this.size = Math.random() * 14 + 10;
    this.color = pinkColors[Math.floor(Math.random() * pinkColors.length)];
    this.angle = (Math.random() - 0.5) * 0.4;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.friction = 0.9; // Redaman agar kembali diam tenang
    this.spring = 0.025; // Tarikan lembut ke posisi diam asal
  }

  draw(time) {
    const pulse = 1 + Math.sin(time * 0.003 + this.pulseOffset) * 0.06;
    const s = this.size * pulse;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.shadowColor = 'rgba(255, 77, 109, 0.3)';
    ctx.shadowBlur = 8;

    // Menggambar bentuk hati (Love)
    ctx.beginPath();
    const topCurveHeight = s * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, topCurveHeight);
    ctx.bezierCurveTo(-s / 2, (s + topCurveHeight) / 2, 0, (s + topCurveHeight) / 1.35, 0, s);
    ctx.bezierCurveTo(0, (s + topCurveHeight) / 1.35, s / 2, (s + topCurveHeight) / 2, s / 2, topCurveHeight);
    ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update() {
    const dx = pointer.x - this.x;
    const dy = pointer.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 130;

    // Interaksi kursor / sentuhan jari
    if (distance < maxDist && distance > 0.1) {
      const force = (maxDist - distance) / maxDist;
      const angle = Math.atan2(dy, dx);

      if (interactionMode === 'repel') {
        this.vx -= Math.cos(angle) * force * 2.2;
        this.vy -= Math.sin(angle) * force * 2.2;
      } else {
        this.vx += Math.cos(angle) * force * 1.4;
        this.vy += Math.sin(angle) * force * 1.4;
      }
    }

    // Kembali ke posisi diamnya secara perlahan jika tidak disentuh
    const homeDx = this.baseX - this.x;
    const homeDy = this.baseY - this.y;
    this.vx += homeDx * this.spring;
    this.vy += homeDy * this.spring;

    // Terapkan kecepatan dan gesekan agar berhenti diam
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;
  }
}

let particles = [];

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((width * height) / 11000), 95);

  for (let i = 0; i < count; i++) {
    const x = Math.random() * (width - 60) + 30;
    const y = Math.random() * (height - 140) + 30;
    particles.push(new HeartParticle(x, y));
  }
}

// Event Pointer (Mouse & Layar Sentuh)
window.addEventListener('pointermove', (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
});

window.addEventListener('pointerdown', (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;

  // Klik di layar saat ending memunculkan letupan hati baru
  if (document.body.classList.contains('ending-active') && e.target === canvas) {
    for (let i = 0; i < 6; i++) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      const p = new HeartParticle(e.clientX + offsetX, e.clientY + offsetY, true);
      particles.push(p);
    }
    if (particles.length > 140) {
      particles.splice(0, particles.length - 140);
    }
  }
});

window.addEventListener('pointerleave', () => {
  pointer.x = -9999;
  pointer.y = -9999;
});

// Kontrol Tombol Ending
const modeRepelBtn = document.getElementById('modeRepel');
const modeAttractBtn = document.getElementById('modeAttract');
const btnBurst = document.getElementById('btnBurst');
const btnRestart = document.getElementById('btnRestart');

modeRepelBtn.addEventListener('click', () => {
  interactionMode = 'repel';
  modeRepelBtn.classList.add('active');
  modeAttractBtn.classList.remove('active');
});

modeAttractBtn.addEventListener('click', () => {
  interactionMode = 'attract';
  modeAttractBtn.classList.add('active');
  modeRepelBtn.classList.remove('active');
});

btnBurst.addEventListener('click', () => {
  particles.forEach((p) => {
    p.vx = (Math.random() - 0.5) * 28;
    p.vy = (Math.random() - 0.5) * 28;
  });
});

btnRestart.addEventListener('click', () => {
  document.body.classList.remove('ending-active');
  document.getElementById('endingUI').classList.add('hidden');
  document.getElementById('cardContainer').classList.remove('fade-out');
  goToStep(1);
});

// Loop Animasi
function animate(time) {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw(time);
  }
  requestAnimationFrame(animate);
}

initParticles();
requestAnimationFrame(animate);