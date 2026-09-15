/**
 * Urban Escape: Boy vs Police — Complete Canvas Game Engine
 * Features:
 * - The Boy runs, jumps over road blockers, and slides under overhead blockers
 * - Skateboard mode with custom board rendering, ollies, and board slides
 * - Speed accelerates continuously as the boy collects points/coins ("speed up itself")
 * - If the boy hits an obstacle, speed drops low immediately and the police closes in to catch him!
 * - Police maintains a safe chase distance when running clean, but rushes to catch when boy stumbles
 * - Floating feedback texts (SPEED UP, JUMP, SLIDE, BUSTED warning)
 * - Full Web Audio API synthesizer for sound effects
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.sirenOsc = null;
    this.sirenGain = null;
    this.isSirenPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.isSirenPlaying) {
      this.stopSiren();
    }
    return this.enabled;
  }

  playJump() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playSlide() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.22);
  }

  playCoin() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987, this.ctx.currentTime);
    osc.frequency.setValueAtTime(1318, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playStumble() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playSkate() {
    if (!this.enabled || !this.ctx) return;
    const notes = [523, 659, 783, 1046];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.05 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.1);
    });
  }

  playPowerup() {
    if (!this.enabled || !this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.06 + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.12);
    });
  }

  playGameOver() {
    if (!this.enabled || !this.ctx) return;
    const notes = [392, 349, 311, 261];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.12);
      osc.stop(this.ctx.currentTime + idx * 0.12 + 0.2);
    });
  }

  startSiren(intensity = 0.5) {
    if (!this.enabled || !this.ctx || this.isSirenPlaying) return;
    try {
      this.sirenOsc = this.ctx.createOscillator();
      this.sirenGain = this.ctx.createGain();
      this.sirenOsc.type = 'sine';

      const now = this.ctx.currentTime;
      this.sirenOsc.frequency.setValueAtTime(650, now);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 2.8;
      lfoGain.gain.value = 260;
      lfo.connect(this.sirenOsc.frequency);
      lfo.start();

      this.sirenGain.gain.setValueAtTime(0.06 * intensity, now);
      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.ctx.destination);
      this.sirenOsc.start();
      this.isSirenPlaying = true;
    } catch (e) {}
  }

  stopSiren() {
    if (this.sirenOsc && this.isSirenPlaying) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch (e) {}
      this.isSirenPlaying = false;
      this.sirenOsc = null;
    }
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new SoundEngine();

    // Virtual resolution
    this.width = 960;
    this.height = 540;
    this.groundY = 440;

    // Game state
    this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER
    this.distance = 0;
    this.coins = 0;
    this.baseSpeed = 6.8;
    this.speed = 6.8;
    this.speedBonusFromPoints = 0; // Speed increases as boy collects points!
    this.highScore = parseInt(localStorage.getItem('urban_escape_highscore') || '0', 10);

    // Characters
    this.boy = {
      x: 320,
      y: this.groundY - 70,
      width: 44,
      height: 70,
      vy: 0,
      gravity: 0.88,
      jumpForce: -16.5,
      isGrounded: true,
      isSliding: false,
      slideTimer: 0,
      slideDuration: 36,
      stumbleTimer: 0,
      runAnimFrame: 0,
      isSkating: false,
      skateTimer: 0,
      shieldActive: false,
      magnetActive: false,
      turboActive: false,
      powerupTimer: 0
    };

    // Police Officer (Chaser)
    this.cop = {
      x: 100,
      y: this.groundY - 74,
      width: 46,
      height: 74,
      defaultGap: 220, // Safe distance when running clean
      gap: 220,
      runAnimFrame: 0,
      sirenAngle: 0,
      warningActive: false
    };

    // World Entities
    this.obstacles = [];
    this.pickups = [];
    this.particles = [];
    this.floatTexts = [];
    this.buildings = [];
    this.clouds = [];
    this.streetlights = [];

    this.spawnTimer = 0;
    this.minSpawnInterval = 65;

    this.initBackground();
    this.bindEvents();
    this.updateHUD();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  initBackground() {
    let bx = 0;
    while (bx < this.width + 400) {
      const bw = 60 + Math.random() * 80;
      const bh = 140 + Math.random() * 220;
      this.buildings.push({
        x: bx,
        width: bw,
        height: bh,
        color: Math.random() > 0.5 ? '#0f172a' : '#1e293b',
        windows: this.generateWindows(bw, bh)
      });
      bx += bw + 8;
    }

    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * this.width,
        y: 40 + Math.random() * 90,
        w: 90 + Math.random() * 60,
        speed: 0.3 + Math.random() * 0.4
      });
    }

    for (let i = 0; i < 4; i++) {
      this.streetlights.push({
        x: i * 260 + 50
      });
    }
  }

  generateWindows(w, h) {
    const wins = [];
    const rows = Math.floor(h / 24);
    const cols = Math.floor(w / 18);
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (Math.random() > 0.35) {
          wins.push({
            rx: c * 18,
            ry: r * 24,
            lit: Math.random() > 0.4,
            color: Math.random() > 0.2 ? '#fef08a' : '#38bdf8'
          });
        }
      }
    }
    return wins;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.code)) {
        e.preventDefault();
      }
      this.handleInput(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.handleInput(e.code, false);
    });

    // Universal Both-Side Control Buttons (Works on Mobile, Tablet/Pad, Laptop, Desktop PC)
    const touchJump = document.getElementById('touch-jump');
    const touchSlide = document.getElementById('touch-slide');

    const handleJumpAction = (e) => {
      if (e) e.preventDefault();
      if (this.state === 'START') {
        this.startGame();
        return;
      }
      if (this.state === 'GAMEOVER') {
        this.restartGame();
        return;
      }
      this.jump();
    };

    const handleSlideAction = (e) => {
      if (e) e.preventDefault();
      if (this.state === 'START') {
        this.startGame();
        return;
      }
      if (this.state === 'GAMEOVER') {
        this.restartGame();
        return;
      }
      this.slide();
    };

    if (touchJump) {
      touchJump.addEventListener('touchstart', handleJumpAction, { passive: false });
      touchJump.addEventListener('mousedown', handleJumpAction);
    }
    if (touchSlide) {
      touchSlide.addEventListener('touchstart', handleSlideAction, { passive: false });
      touchSlide.addEventListener('mousedown', handleSlideAction);
    }

    // Comprehensive Canvas Swipe & Tap Gestures for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = performance.now();
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      const diffX = t.clientX - touchStartX;
      const diffY = t.clientY - touchStartY;
      const elapsed = performance.now() - touchStartTime;

      // Tap detection (quick tap under 250ms with minimal movement)
      if (elapsed < 250 && Math.abs(diffX) < 15 && Math.abs(diffY) < 15) {
        if (this.state === 'START') {
          this.startGame();
          return;
        } else if (this.state === 'GAMEOVER') {
          this.restartGame();
          return;
        }
      }

      // Swipe detection
      if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY < -25) this.jump();
        else if (diffY > 25) this.slide();
      } else {
        if (diffX > 30) this.boy.x = Math.min(this.boy.x + 20, 420);
        else if (diffX < -30) this.boy.x = Math.max(this.boy.x - 20, 220);
      }
    }, { passive: false });

    // UI Buttons
    document.getElementById('btn-start').addEventListener('click', () => this.startGame());
    document.getElementById('btn-restart').addEventListener('click', () => this.restartGame());
    document.getElementById('btn-restart-pause').addEventListener('click', () => this.restartGame());
    document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());

    const btnSound = document.getElementById('btn-sound');
    btnSound.addEventListener('click', () => {
      const on = this.sound.toggle();
      btnSound.textContent = on ? '🔊' : '🔇';
    });

    const btnFullscreen = document.getElementById('btn-fullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }

    document.addEventListener('fullscreenchange', () => {
      if (btnFullscreen) {
        btnFullscreen.textContent = document.fullscreenElement ? '🗗' : '⛶';
      }
    });
  }

  toggleFullscreen() {
    const container = document.getElementById('game-container');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  handleInput(code, isDown) {
    const touchJump = document.getElementById('touch-jump');
    const touchSlide = document.getElementById('touch-slide');

    // Visual synchronization for on-screen buttons on Laptop / PC keyboards
    if (['Space', 'KeyW', 'ArrowUp'].includes(code)) {
      if (touchJump) {
        if (isDown) touchJump.classList.add('pressed');
        else touchJump.classList.remove('pressed');
      }
    } else if (['ArrowDown', 'KeyS'].includes(code)) {
      if (touchSlide) {
        if (isDown) touchSlide.classList.add('pressed');
        else touchSlide.classList.remove('pressed');
      }
    }

    if (this.state === 'START' && isDown) {
      if (['Space', 'Enter', 'KeyW', 'ArrowUp'].includes(code)) {
        this.startGame();
        return;
      }
    }

    if (this.state === 'GAMEOVER' && isDown) {
      if (['Space', 'Enter'].includes(code)) {
        this.restartGame();
        return;
      }
    }

    if (isDown && (code === 'KeyF')) {
      this.toggleFullscreen();
      return;
    }

    if (this.state !== 'PLAYING') return;

    if (isDown) {
      if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
        this.jump();
      } else if (code === 'ArrowDown' || code === 'KeyS') {
        this.slide();
      } else if (code === 'Escape' || code === 'KeyP') {
        this.togglePause();
      } else if (code === 'ArrowRight' || code === 'KeyD') {
        this.boy.x = Math.min(this.boy.x + 10, 420);
      } else if (code === 'ArrowLeft' || code === 'KeyA') {
        this.boy.x = Math.max(this.boy.x - 10, 220);
      }
    }
  }

  jump() {
    if (this.boy.isGrounded && !this.boy.isSliding) {
      // Skateboard gives extra spring to jump (ollie!)
      this.boy.vy = this.boy.isSkating ? this.boy.jumpForce * 1.1 : this.boy.jumpForce;
      this.boy.isGrounded = false;
      this.sound.playJump();
      this.createDust(this.boy.x + 10, this.groundY, 8);
      if (this.boy.isSkating) {
        this.addFloatingText(this.boy.x, this.boy.y - 15, 'OLLIE JUMP! 🛹', '#38bdf8');
      }
    }
  }

  slide() {
    if (this.boy.isGrounded && !this.boy.isSliding) {
      this.boy.isSliding = true;
      this.boy.slideTimer = this.boy.slideDuration;
      this.boy.height = 34;
      this.boy.y = this.groundY - 34;
      this.sound.playSlide();
      this.createSparks(this.boy.x, this.groundY, 8);
      this.addFloatingText(this.boy.x + 10, this.groundY - 45, 'SLIDE DOWN! ⬇', '#facc15');
    }
  }

  activateSkating(duration = 450) {
    this.boy.isSkating = true;
    this.boy.skateTimer = duration; // ~7.5 seconds
    this.sound.playSkate();
    this.addFloatingText(this.boy.x, this.boy.y - 30, 'SKATEBOARD ACTIVATED! 🛹', '#06b6d4');
    this.createSparkle(this.boy.x + 20, this.boy.y + 30, '#06b6d4', 20);
  }

  startGame() {
    this.sound.init();
    this.state = 'PLAYING';
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('pause-screen').classList.remove('active');
    document.getElementById('gameover-screen').classList.remove('active');
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.sound.stopSiren();
      document.getElementById('pause-screen').classList.add('active');
    } else if (this.state === 'PAUSED') {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.state = 'PLAYING';
    document.getElementById('pause-screen').classList.remove('active');
  }

  restartGame() {
    this.distance = 0;
    this.coins = 0;
    this.speedBonusFromPoints = 0;
    this.speed = this.baseSpeed;
    this.obstacles = [];
    this.pickups = [];
    this.particles = [];
    this.floatTexts = [];
    this.spawnTimer = 0;

    this.boy.x = 320;
    this.boy.y = this.groundY - 70;
    this.boy.height = 70;
    this.boy.vy = 0;
    this.boy.isGrounded = true;
    this.boy.isSliding = false;
    this.boy.stumbleTimer = 0;
    this.boy.isSkating = false;
    this.boy.skateTimer = 0;
    this.boy.shieldActive = false;
    this.boy.turboActive = false;
    this.boy.magnetActive = false;
    this.boy.powerupTimer = 0;

    this.cop.gap = 220;
    this.cop.x = this.boy.x - this.cop.gap;
    this.cop.warningActive = false;

    this.sound.stopSiren();
    this.startGame();
  }

  gameOver() {
    this.state = 'GAMEOVER';
    this.sound.stopSiren();
    this.sound.playGameOver();

    const finalDist = Math.floor(this.distance);
    if (finalDist > this.highScore) {
      this.highScore = finalDist;
      localStorage.setItem('urban_escape_highscore', this.highScore);
    }

    let rank = 'Rookie Sprinter';
    if (finalDist >= 3000) rank = 'Untouchable Legend';
    else if (finalDist >= 1500) rank = 'Urban Phantom';
    else if (finalDist >= 600) rank = 'Street Dodger';

    document.getElementById('final-distance').textContent = `${finalDist}m`;
    document.getElementById('final-coins').textContent = this.coins;
    document.getElementById('high-score').textContent = `${this.highScore}m`;
    document.getElementById('rank-badge').textContent = rank;
    document.getElementById('gameover-screen').classList.add('active');

    const warning = document.getElementById('police-warning');
    if (warning) warning.classList.remove('active');
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (this.state === 'PLAYING') {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // 1. Point-Based Speed & Progression
    // User requested: "how the points is collecting, and he continuously speed up, speed up itself"
    // As coins are collected, speed steadily climbs!
    const pointBoost = Math.min(this.speedBonusFromPoints, 7.5);
    const naturalProgression = Math.min(this.distance / 500, 4.5);
    let targetSpeed = this.baseSpeed + naturalProgression + pointBoost;

    if (this.boy.isSkating) {
      targetSpeed += 2.2;
    }
    if (this.boy.turboActive) {
      targetSpeed *= 1.35;
    }

    // User requested: "if he hit and the speed is goes low, and the police will catch"
    if (this.boy.stumbleTimer > 0) {
      // Speed drops low immediately!
      this.speed = 3.4;
    } else {
      // Smooth acceleration up to target speed
      this.speed += (targetSpeed - this.speed) * 0.08;
    }

    this.distance += (this.speed * 0.1);

    // 2. Boy Physics & Animation
    this.boy.runAnimFrame += 0.26 * (this.speed / 7);

    if (!this.boy.isGrounded) {
      this.boy.vy += this.boy.gravity;
      this.boy.y += this.boy.vy;

      if (this.boy.y >= this.groundY - this.boy.height) {
        this.boy.y = this.groundY - this.boy.height;
        this.boy.vy = 0;
        this.boy.isGrounded = true;
        this.createDust(this.boy.x + 10, this.groundY, 5);
      }
    }

    // Handle slide timer
    if (this.boy.isSliding) {
      this.boy.slideTimer--;
      if (Math.random() > 0.3) {
        this.createSparks(this.boy.x, this.groundY, 3);
      }
      if (this.boy.slideTimer <= 0) {
        this.boy.isSliding = false;
        this.boy.height = 70;
        this.boy.y = this.groundY - 70;
      }
    }

    // Handle stumble timer
    if (this.boy.stumbleTimer > 0) {
      this.boy.stumbleTimer--;
    }

    // Handle Skateboard timer
    if (this.boy.isSkating) {
      this.boy.skateTimer--;
      if (Math.random() > 0.5) {
        this.createSparks(this.boy.x - 5, this.groundY, 1);
      }
      if (this.boy.skateTimer <= 0) {
        this.boy.isSkating = false;
        this.addFloatingText(this.boy.x, this.boy.y - 20, 'BACK TO SPRINT!', '#94a3b8');
      }
    }

    // Handle Power-up timers
    if (this.boy.powerupTimer > 0) {
      this.boy.powerupTimer--;
      const fill = document.getElementById('powerup-fill');
      if (fill) fill.style.width = `${(this.boy.powerupTimer / 300) * 100}%`;

      if (this.boy.powerupTimer <= 0) {
        this.boy.turboActive = false;
        this.boy.shieldActive = false;
        this.boy.magnetActive = false;
        document.getElementById('powerup-card').style.display = 'none';
      }
    }

    // 3. Police Chase AI & Dynamics
    // User requested: "the police will not run fast, between when he get hit it will catch, means it will close to that"
    this.cop.runAnimFrame += 0.28 * (this.speed / 7);
    this.cop.sirenAngle += 0.22;

    if (this.boy.stumbleTimer > 0) {
      // BOY HIT AN OBSTACLE! Speed is low -> Police charges forward aggressively to catch him!
      this.cop.gap -= 2.6;
    } else if (this.boy.turboActive || this.boy.isSkating) {
      // Boy is fast/skating -> Pulls away, opening safe distance
      this.cop.gap = Math.min(this.cop.gap + 1.2, 270);
    } else {
      // Clean running: Police maintains normal distance and does NOT run fast
      if (this.cop.gap < this.cop.defaultGap) {
        this.cop.gap += 0.35; // gradually recovers safe distance
      }
    }

    // Update cop absolute X
    this.cop.x = this.boy.x - this.cop.gap;

    // Police Proximity Warning
    const warning = document.getElementById('police-warning');
    if (this.cop.gap < 85) {
      if (!this.cop.warningActive) {
        this.cop.warningActive = true;
        if (warning) warning.classList.add('active');
        this.sound.startSiren(1.0);
      }
    } else {
      if (this.cop.warningActive) {
        this.cop.warningActive = false;
        if (warning) warning.classList.remove('active');
        this.sound.stopSiren();
      }
    }

    // Catch condition!
    if (this.cop.gap <= 12) {
      this.gameOver();
      return;
    }

    // 4. Parallax Background updates
    this.clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x < -c.w) c.x = this.width + 50;
    });

    this.buildings.forEach(b => {
      b.x -= this.speed * 0.35;
      if (b.x + b.width < 0) {
        const maxX = Math.max(...this.buildings.map(item => item.x + item.width));
        b.x = maxX + 8;
      }
    });

    this.streetlights.forEach(s => {
      s.x -= this.speed;
      if (s.x < -60) s.x = this.width + 120;
    });

    // 5. Spawning Obstacles
    this.spawnTimer++;
    if (this.spawnTimer >= this.minSpawnInterval) {
      if (Math.random() < 0.7) {
        this.spawnObstacle();
        this.spawnTimer = 0;
      }
    }

    // 6. Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= this.speed;

      // Check if boy successfully cleared obstacle
      if (!obs.cleared && !obs.passed && obs.x + obs.w < this.boy.x) {
        obs.cleared = true;
        if (obs.isOverhead) {
          this.addFloatingText(this.boy.x + 10, this.boy.y - 20, 'CLEAN SLIDE! ⚡', '#38bdf8');
        } else {
          this.addFloatingText(this.boy.x + 10, this.boy.y - 20, 'NICE JUMP! 🚀', '#10b981');
        }
      }

      // Collision detection with Boy
      if (!obs.passed && this.checkCollision(this.boy, obs)) {
        obs.passed = true;
        if (this.boy.shieldActive) {
          this.createDebris(obs.x + obs.w / 2, obs.y + obs.h / 2, 14);
          this.sound.playCoin();
          this.addFloatingText(obs.x, obs.y - 15, 'SMASHED! 💥', '#10b981');
          this.obstacles.splice(i, 1);
          continue;
        } else {
          // User requested: "if he hit and the speed is goes low, and the police will catch"
          this.boy.stumbleTimer = 65;
          this.sound.playStumble();
          this.createDust(this.boy.x, this.boy.y + this.boy.height, 12);
          this.addFloatingText(this.boy.x, this.boy.y - 25, 'OOF! SPEED LOW! ⚠️', '#ef4444');
          // If skating, lost skateboard
          if (this.boy.isSkating) {
            this.boy.isSkating = false;
            this.addFloatingText(this.boy.x, this.boy.y - 45, 'SKATEBOARD LOST!', '#f43f5e');
          }
        }
      }

      // Remove off-screen
      if (obs.x + obs.w < -50) {
        this.obstacles.splice(i, 1);
      }
    }

    // 7. Update Pickups (Coins, Skateboard, Powerups)
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.x -= this.speed;

      // Magnet pull
      if (this.boy.magnetActive && p.type === 'coin') {
        const dx = (this.boy.x + 20) - p.x;
        const dy = (this.boy.y + 30) - p.y;
        p.x += dx * 0.18;
        p.y += dy * 0.18;
      }

      // Collect detection
      if (this.checkCollision(this.boy, p)) {
        if (p.type === 'coin') {
          this.coins++;
          // User requested: "how the points is collecting, and he continuously speed up, speed up itself"
          this.speedBonusFromPoints += 0.15; // Speed accelerates with each coin!
          this.sound.playCoin();
          this.createSparkle(p.x, p.y, '#facc15');
          this.addFloatingText(p.x, p.y - 10, '+SPEED UP!', '#facc15');

          // Every 12 coins, trigger skateboard ride!
          if (this.coins % 12 === 0 && !this.boy.isSkating) {
            this.activateSkating(400);
          }
        } else if (p.type === 'skateboard') {
          this.activateSkating(500);
        } else {
          this.activatePowerup(p.type);
        }
        this.pickups.splice(i, 1);
        continue;
      }

      if (p.x < -30) {
        this.pickups.splice(i, 1);
      }
    }

    // 8. Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.x += part.vx;
      part.y += part.vy;
      part.alpha -= part.fade;
      if (part.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 9. Update Floating Texts
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y -= 1.2;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }

    this.updateHUD();
  }

  spawnObstacle() {
    // User requested:
    // "some is coming in the middle of the road, so he will jump"
    // "some is coming above his head, and he'll scroll down (slide)"
    const isOverhead = Math.random() < 0.42;

    if (isOverhead) {
      // OVERHEAD BLOCKER: Hanging laser warning pipe / high caution beam
      // Positioned at head level: Boy MUST SLIDE / SCROLL DOWN underneath!
      this.obstacles.push({
        type: 'overhead',
        isOverhead: true,
        x: this.width + 40,
        y: this.groundY - 96,
        w: 60,
        h: 56, // y + h = groundY - 40. Standing boy (height 70) hits! Sliding boy (height 34) passes!
        passed: false,
        cleared: false
      });
    } else {
      // ROAD BLOCKER: Middle of the road obstacle (Barricades, Crates, Dumpsters)
      // Boy MUST JUMP over!
      const kind = Math.random();
      const isDumpster = kind < 0.35;
      const isBarricade = kind >= 0.35 && kind < 0.7;

      this.obstacles.push({
        type: isDumpster ? 'dumpster' : (isBarricade ? 'barricade' : 'crates'),
        isOverhead: false,
        x: this.width + 40,
        y: isDumpster ? this.groundY - 54 : (isBarricade ? this.groundY - 44 : this.groundY - 38),
        w: isDumpster ? 52 : (isBarricade ? 44 : 36),
        h: isDumpster ? 54 : (isBarricade ? 44 : 38),
        passed: false,
        cleared: false
      });
    }

    // Chance to spawn coins & skateboard powerups along the path
    const rand = Math.random();
    if (rand < 0.65) {
      // Trail of coins
      const coinCount = 3 + Math.floor(Math.random() * 3);
      for (let c = 0; c < coinCount; c++) {
        this.pickups.push({
          type: 'coin',
          x: this.width + 120 + (c * 34),
          y: this.groundY - (isOverhead ? 22 : 90), // High coins to jump for, or low coins when sliding!
          w: 22,
          h: 22
        });
      }
    } else if (rand >= 0.65 && rand < 0.82) {
      // Skateboard pickup!
      this.pickups.push({
        type: 'skateboard',
        x: this.width + 130,
        y: this.groundY - 45,
        w: 32,
        h: 24
      });
    } else {
      // Powerup
      const pTypes = ['turbo', 'shield', 'magnet'];
      this.pickups.push({
        type: pTypes[Math.floor(Math.random() * pTypes.length)],
        x: this.width + 130,
        y: this.groundY - 65,
        w: 28,
        h: 28
      });
    }
  }

  activatePowerup(type) {
    this.sound.playPowerup();
    this.boy.turboActive = (type === 'turbo');
    this.boy.shieldActive = (type === 'shield');
    this.boy.magnetActive = (type === 'magnet');
    this.boy.powerupTimer = 320;

    const card = document.getElementById('powerup-card');
    const name = document.getElementById('powerup-name');
    if (card && name) {
      card.style.display = 'flex';
      name.textContent = type.toUpperCase();
    }
    this.addFloatingText(this.boy.x, this.boy.y - 20, `${type.toUpperCase()} POWER!`, '#facc15');
    this.createSparkle(this.boy.x + 20, this.boy.y + 30, '#06b6d4', 16);
  }

  checkCollision(a, b) {
    const pad = 5;
    return (
      a.x + pad < b.x + b.w - pad &&
      a.x + a.width - pad > b.x + pad &&
      a.y + pad < b.y + b.h - pad &&
      a.y + a.height - pad > b.y + pad
    );
  }

  addFloatingText(x, y, text, color = '#ffffff') {
    this.floatTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1.0
    });
  }

  createDust(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: -(this.speed * 0.4) + (Math.random() * 2 - 1),
        vy: -Math.random() * 2,
        size: 3 + Math.random() * 4,
        color: 'rgba(148, 163, 184, 0.6)',
        alpha: 1,
        fade: 0.05
      });
    }
  }

  createSparks(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: -(this.speed * 0.7) - Math.random() * 3,
        vy: -Math.random() * 3,
        size: 2 + Math.random() * 3,
        color: '#facc15',
        alpha: 1,
        fade: 0.08
      });
    }
  }

  createDebris(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() * 8 - 4),
        vy: -Math.random() * 6 - 2,
        size: 3 + Math.random() * 5,
        color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
        alpha: 1,
        fade: 0.04
      });
    }
  }

  createSparkle(x, y, color = '#facc15', count = 8) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() * 6 - 3),
        vy: (Math.random() * 6 - 3),
        size: 3 + Math.random() * 3,
        color,
        alpha: 1,
        fade: 0.05
      });
    }
  }

  updateHUD() {
    const distEl = document.getElementById('score-val');
    const coinsEl = document.getElementById('coins-val');
    const fillEl = document.getElementById('chase-bar-fill');
    const statusEl = document.getElementById('meter-status');

    if (distEl) distEl.textContent = `${Math.floor(this.distance)}m`;
    if (coinsEl) coinsEl.textContent = `🟡 ${this.coins}`;

    if (fillEl && statusEl) {
      const pct = Math.max(5, Math.min(100, (this.cop.gap / 260) * 100));
      fillEl.style.width = `${pct}%`;

      if (this.boy.stumbleTimer > 0) {
        statusEl.textContent = '⚠️ SLOWED DOWN! COP CLOSING IN!';
        statusEl.style.color = '#ef4444';
      } else if (pct > 60) {
        statusEl.textContent = 'Safe Distance • Speeding Up!';
        statusEl.style.color = '#10b981';
      } else if (pct > 30) {
        statusEl.textContent = 'Police In Pursuit!';
        statusEl.style.color = '#f59e0b';
      } else {
        statusEl.textContent = 'DANGER! POLICE ON YOUR HEELS!';
        statusEl.style.color = '#ef4444';
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Night City Sky
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.7, '#0b132b');
    skyGrad.addColorStop(1, '#1c2541');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Glowing Moon
    this.ctx.fillStyle = '#fef08a';
    this.ctx.shadowColor = '#fef08a';
    this.ctx.shadowBlur = 30;
    this.ctx.beginPath();
    this.ctx.arc(820, 90, 40, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    // Drifting Clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    this.clouds.forEach(c => {
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, c.w * 0.3, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.3, c.y - 10, c.w * 0.35, 0, Math.PI * 2);
      this.ctx.arc(c.x + c.w * 0.6, c.y, c.w * 0.25, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. City Skyline Buildings
    this.buildings.forEach(b => {
      this.ctx.fillStyle = b.color;
      this.ctx.fillRect(b.x, this.groundY - b.height, b.width, b.height);

      b.windows.forEach(w => {
        this.ctx.fillStyle = w.lit ? w.color : 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(b.x + w.rx, (this.groundY - b.height) + w.ry, 8, 12);
      });
    });

    // 3. Streetlights & Illumination Cones
    this.streetlights.forEach(s => {
      const coneGrad = this.ctx.createLinearGradient(s.x, this.groundY - 140, s.x, this.groundY);
      coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.16)');
      coneGrad.addColorStop(1, 'rgba(254, 240, 138, 0.0)');
      this.ctx.fillStyle = coneGrad;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x + 8, this.groundY - 130);
      this.ctx.lineTo(s.x - 45, this.groundY);
      this.ctx.lineTo(s.x + 60, this.groundY);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(s.x + 6, this.groundY - 140, 5, 140);
      this.ctx.fillStyle = '#fef08a';
      this.ctx.fillRect(s.x, this.groundY - 144, 18, 6);
    });

    // 4. Ground Road Surface
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

    // Concrete Curb
    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(0, this.groundY, this.width, 6);

    // Moving Road Dash Markings
    this.ctx.fillStyle = '#facc15';
    const dashOffset = (this.distance * 10) % 60;
    for (let rx = -dashOffset; rx < this.width; rx += 60) {
      this.ctx.fillRect(rx, this.groundY + 45, 35, 6);
    }

    // 5. Render Obstacles
    this.obstacles.forEach(obs => {
      if (obs.type === 'overhead') {
        // OVERHEAD BLOCKER: High caution cross-beam / laser pipe (Must SLIDE!)
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(obs.x, obs.y, obs.w, 16);

        // Yellow warning chevrons
        this.ctx.fillStyle = '#facc15';
        for (let i = 0; i < obs.w; i += 16) {
          this.ctx.fillRect(obs.x + i, obs.y, 8, 16);
        }

        // Hanging mount cables
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillRect(obs.x + 6, 0, 4, obs.y);
        this.ctx.fillRect(obs.x + obs.w - 10, 0, 4, obs.y);

        // "SLIDE DOWN" warning label below beam
        this.ctx.fillStyle = '#f87171';
        this.ctx.font = 'bold 10px Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('▼ SLIDE', obs.x + obs.w / 2, obs.y + 28);
      } else if (obs.type === 'barricade') {
        // ROAD BLOCKER: Construction barrier (Must JUMP!)
        this.ctx.fillStyle = '#f97316';
        this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(obs.x + 8, obs.y, 8, obs.h);
        this.ctx.fillRect(obs.x + 28, obs.y, 8, obs.h);

        // Flashing amber beacon
        this.ctx.fillStyle = Math.floor(Date.now() / 200) % 2 === 0 ? '#facc15' : '#78350f';
        this.ctx.beginPath();
        this.ctx.arc(obs.x + obs.w / 2, obs.y - 5, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // "JUMP" label
        this.ctx.fillStyle = '#fdba74';
        this.ctx.font = 'bold 10px Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('▲ JUMP', obs.x + obs.w / 2, obs.y - 12);
      } else if (obs.type === 'dumpster') {
        // ROAD BLOCKER: Street Dumpster
        this.ctx.fillStyle = '#047857';
        this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        this.ctx.fillStyle = '#065f46';
        this.ctx.fillRect(obs.x + 4, obs.y + 4, obs.w - 8, obs.h - 8);
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(obs.x + 4, obs.y + obs.h - 6, 10, 6);
        this.ctx.fillRect(obs.x + obs.w - 14, obs.y + obs.h - 6, 10, 6);
      } else if (obs.type === 'crates') {
        // ROAD BLOCKER: Wooden crates
        this.ctx.fillStyle = '#b45309';
        this.ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        this.ctx.beginPath();
        this.ctx.moveTo(obs.x, obs.y);
        this.ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
        this.ctx.stroke();
      }
    });

    // 6. Render Pickups (Coins, Skateboard, Powerups)
    this.pickups.forEach(p => {
      if (p.type === 'coin') {
        // Rotating Gold Point / Spray Can
        this.ctx.save();
        this.ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        const scaleX = Math.cos(Date.now() * 0.007);
        this.ctx.scale(scaleX, 1);
        this.ctx.fillStyle = '#facc15';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 11, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#ca8a04';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      } else if (p.type === 'skateboard') {
        // Skateboard Collectible
        this.ctx.save();
        this.ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        // Deck
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.beginPath();
        this.ctx.roundRect(-14, -4, 28, 8, 3);
        this.ctx.fill();
        // Wheels
        this.ctx.fillStyle = '#facc15';
        this.ctx.beginPath();
        this.ctx.arc(-8, 6, 4, 0, Math.PI * 2);
        this.ctx.arc(8, 6, 4, 0, Math.PI * 2);
        this.ctx.fill();
        // Icon label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 9px Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SKATE', 0, -8);
        this.ctx.restore();
      } else {
        // Power-up orb (Turbo, Shield, Magnet)
        this.ctx.save();
        this.ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        this.ctx.fillStyle = p.type === 'turbo' ? '#3b82f6' : (p.type === 'shield' ? '#10b981' : '#a855f7');
        this.ctx.shadowColor = this.ctx.fillStyle;
        this.ctx.shadowBlur = 14;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 13, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Outfit, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const icon = p.type === 'turbo' ? '⚡' : (p.type === 'shield' ? '🛡️' : '🧲');
        this.ctx.fillText(icon, 0, 1);
        this.ctx.restore();
      }
    });

    // 7. Render Particles
    this.particles.forEach(pt => {
      this.ctx.save();
      this.ctx.globalAlpha = pt.alpha;
      this.ctx.fillStyle = pt.color;
      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // 8. Render Floating Texts
    this.floatTexts.forEach(ft => {
      this.ctx.save();
      this.ctx.globalAlpha = ft.alpha;
      this.ctx.fillStyle = ft.color;
      this.ctx.font = 'bold 12px "Press Start 2P", monospace';
      this.ctx.shadowColor = '#000000';
      this.ctx.shadowBlur = 6;
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.restore();
    });

    // 9. Render Police Officer (Chaser)
    this.renderPolice();

    // 10. Render The Boy (Runner / Skater)
    this.renderBoy();
  }

  renderBoy() {
    const b = this.boy;
    this.ctx.save();
    this.ctx.translate(b.x, b.y);

    // Stumble flashing effect when hit
    if (b.stumbleTimer > 0 && Math.floor(b.stumbleTimer / 3) % 2 === 0) {
      this.ctx.globalAlpha = 0.35;
    }

    // Shield Aura
    if (b.shieldActive) {
      this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(b.width / 2, b.height / 2, b.height * 0.65, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Turbo Speed Lines
    if (b.turboActive || this.speed > 10) {
      this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const lineY = Math.random() * b.height;
        this.ctx.beginPath();
        this.ctx.moveTo(-10 - Math.random() * 25, lineY);
        this.ctx.lineTo(-5, lineY);
        this.ctx.stroke();
      }
    }

    const legSwing = Math.sin(b.runAnimFrame) * 18;

    if (b.isSliding) {
      // SLIDING / DUCKING UNDER OVERHEAD BLOCKER
      this.ctx.fillStyle = '#6366f1';
      this.ctx.fillRect(8, 8, 40, 20);
      this.ctx.fillStyle = '#fbcfe8';
      this.ctx.beginPath();
      this.ctx.arc(52, 14, 10, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(44, 4, 18, 6);
      this.ctx.fillRect(58, 8, 8, 3);
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fillRect(0, 16, 20, 12);
      this.ctx.fillStyle = '#f43f5e';
      this.ctx.fillRect(-6, 22, 12, 8);

      // If sliding while skating, skateboard under knees
      if (b.isSkating) {
        this.ctx.fillStyle = '#06b6d4';
        this.ctx.fillRect(-8, 30, 48, 6);
        this.ctx.fillStyle = '#facc15';
        this.ctx.beginPath();
        this.ctx.arc(-2, 36, 3, 0, Math.PI * 2);
        this.ctx.arc(36, 36, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (b.isSkating) {
      // SKATEBOARDING POSE
      // Skater Stance (Leaning forward on board)
      this.ctx.strokeStyle = '#1e293b';
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(18, 42);
      this.ctx.lineTo(12, 64);
      this.ctx.moveTo(28, 42);
      this.ctx.lineTo(34, 64);
      this.ctx.stroke();

      // Sneakers
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(8, 62, 10, 5);
      this.ctx.fillRect(30, 62, 10, 5);

      // Skateboard Deck
      this.ctx.fillStyle = '#3b82f6';
      this.ctx.beginPath();
      this.ctx.roundRect(0, 66, 46, 6, 2);
      this.ctx.fill();

      // Skateboard Wheels (Spinning)
      this.ctx.fillStyle = '#facc15';
      this.ctx.beginPath();
      this.ctx.arc(8, 73, 4, 0, Math.PI * 2);
      this.ctx.arc(38, 73, 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Torso
      this.ctx.fillStyle = '#6366f1';
      this.ctx.beginPath();
      this.ctx.roundRect(14, 20, 22, 26, 6);
      this.ctx.fill();

      // Backpack
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.fillRect(6, 24, 8, 16);

      // Head & Cap
      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.arc(26, 14, 10, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#06b6d4';
      this.ctx.beginPath();
      this.ctx.arc(26, 11, 10, Math.PI, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillRect(14, 11, 14, 4);

      // Arms balancing
      this.ctx.strokeStyle = '#6366f1';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(22, 24);
      this.ctx.lineTo(38, 30);
      this.ctx.stroke();
    } else {
      // REGULAR RUNNING POSE
      this.ctx.strokeStyle = '#1e293b';
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = 'round';

      // Left Leg
      this.ctx.beginPath();
      this.ctx.moveTo(16, 42);
      this.ctx.lineTo(16 - legSwing, 66);
      this.ctx.stroke();
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(12 - legSwing, 64, 12, 6);

      // Right Leg
      this.ctx.beginPath();
      this.ctx.moveTo(28, 42);
      this.ctx.lineTo(28 + legSwing, 66);
      this.ctx.stroke();
      this.ctx.fillStyle = '#06b6d4';
      this.ctx.fillRect(24 + legSwing, 64, 12, 6);

      // Torso
      this.ctx.fillStyle = '#6366f1';
      this.ctx.beginPath();
      this.ctx.roundRect(12, 20, 22, 26, 6);
      this.ctx.fill();

      // Backpack
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.fillRect(6, 24, 7, 16);

      // Head & Cap
      this.ctx.fillStyle = '#fed7aa';
      this.ctx.beginPath();
      this.ctx.arc(23, 14, 10, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#06b6d4';
      this.ctx.beginPath();
      this.ctx.arc(23, 11, 10, Math.PI, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillRect(10, 11, 14, 4);

      // Eyes
      this.ctx.fillStyle = '#0f172a';
      this.ctx.fillRect(26, 12, 3, 3);

      // Arms
      this.ctx.strokeStyle = '#6366f1';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(22, 24);
      this.ctx.lineTo(22 + legSwing * 0.8, 38);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  renderPolice() {
    const c = this.cop;
    this.ctx.save();
    this.ctx.translate(c.x, c.y);

    const legSwing = Math.sin(c.runAnimFrame) * 19;

    // Siren Light Beam (Alternating Blue & Red strobe)
    const isRed = Math.sin(c.sirenAngle) > 0;
    this.ctx.save();
    this.ctx.shadowColor = isRed ? '#ef4444' : '#3b82f6';
    this.ctx.shadowBlur = 24;
    this.ctx.fillStyle = isRed ? '#ef4444' : '#3b82f6';
    this.ctx.beginPath();
    this.ctx.arc(24, 3, 7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();

    // Uniform Pants Legs
    this.ctx.strokeStyle = '#1e3a8a';
    this.ctx.lineWidth = 7;
    this.ctx.lineCap = 'round';

    // Left Leg
    this.ctx.beginPath();
    this.ctx.moveTo(18, 44);
    this.ctx.lineTo(18 - legSwing, 70);
    this.ctx.stroke();
    this.ctx.fillStyle = '#020617';
    this.ctx.fillRect(14 - legSwing, 68, 14, 6);

    // Right Leg
    this.ctx.beginPath();
    this.ctx.moveTo(30, 44);
    this.ctx.lineTo(30 + legSwing, 70);
    this.ctx.stroke();
    this.ctx.fillStyle = '#020617';
    this.ctx.fillRect(26 + legSwing, 68, 14, 6);

    // Torso (Police Uniform)
    this.ctx.fillStyle = '#1e40af';
    this.ctx.beginPath();
    this.ctx.roundRect(14, 22, 22, 26, 5);
    this.ctx.fill();

    // Gold Badge
    this.ctx.fillStyle = '#facc15';
    this.ctx.beginPath();
    this.ctx.arc(20, 28, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Duty Belt
    this.ctx.fillStyle = '#020617';
    this.ctx.fillRect(14, 42, 22, 5);

    // Head
    this.ctx.fillStyle = '#ffedd5';
    this.ctx.beginPath();
    this.ctx.arc(25, 15, 10, 0, Math.PI * 2);
    this.ctx.fill();

    // Aviator Sunglasses
    this.ctx.fillStyle = '#020617';
    this.ctx.fillRect(26, 13, 8, 4);

    // Police Cap
    this.ctx.fillStyle = '#1e3a8a';
    this.ctx.beginPath();
    this.ctx.arc(25, 12, 11, Math.PI, Math.PI * 2);
    this.ctx.fill();
    this.ctx.fillStyle = '#020617';
    this.ctx.fillRect(23, 11, 15, 4);

    // Gold Cap Badge
    this.ctx.fillStyle = '#facc15';
    this.ctx.fillRect(24, 7, 4, 4);

    // Arm swinging Baton / Nightstick
    this.ctx.strokeStyle = '#1e40af';
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    this.ctx.moveTo(25, 26);
    this.ctx.lineTo(38, 18 - legSwing * 0.5);
    this.ctx.stroke();

    this.ctx.strokeStyle = '#020617';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(38, 18 - legSwing * 0.5);
    this.ctx.lineTo(52, 10 - legSwing * 0.5);
    this.ctx.stroke();

    this.ctx.restore();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
