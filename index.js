const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const PI = Math.PI;
const px = screenWidth / 2; // 中心点x
const py = 260; // 中心点y
const r = 60; // 球半径
const aw = 10; // 箭头宽
const ah = 50; // 箭头长
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

canvas.width = screenWidth;
canvas.height = screenHeight;

const Arrow = {
  id: null,
  canvas: null,
  ctx: null,
  level: 1,
  lx: screenWidth / 2,
  ly: 120,
  ldeg: 0,
  speed: 2,
  outArrow: [],
  inArrow: [],
  shooting: false,
  init() {
    this.shooting = false;
    this.gameOver = false;
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = screenWidth;
    this.canvas.height = screenHeight;
    const top = 180 + py + r + ah;
    for (let i = 0; i < this.level + 3; i++) {
      this.outArrow.push({
        top,
      });
    }
    this.inArrow = [];
    this.bind();
  },
  run() {
    this.id = requestAnimationFrame(this.draw.bind(this));
  },
  draw() {
    this.ctx.clearRect(0, 0, screenWidth, screenHeight);
    this.drawPie();
    this.drawLine();
    this.drawOutArrow();
    this.drawInArrow();
    this.drawNumber();
    this.id = requestAnimationFrame(this.draw.bind(this));
    if (this.gameOver) {
      cancelAnimationFrame(this.id);
    }
  },
  drawPie() {
    // 画圆
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000'
    this.ctx.arc(px, py, r, PI * 2, false);
    this.ctx.stroke();
  },
  drawLine() {
    // 画圆心的线
    this.ctx.beginPath();
    this.ctx.moveTo(px, py);
    this.ctx.lineTo(this.lx, this.ly);
    this.ctx.stroke();
    
    // this.ly = Math.sqrt(80 * 80 - this.lx * this.lx);
    this.ldeg += this.speed;
    if (this.ldeg >= 360) {
      this.ldeg = 0;
    }
    if (this.ldeg >= 270) { // 第四象限
      this.ly = py - Math.sin((this.ldeg - 270) / 180 * PI) * r;
      this.lx = px - Math.cos((this.ldeg - 270) / 180 * PI) * r;
    } else if (this.ldeg >= 180) { // 第三象限
      this.ly = py + Math.cos((this.ldeg - 180) / 180 * PI) * r;
      this.lx = px - Math.sin((this.ldeg - 180) / 180 * PI) * r;
    } else if (this.ldeg >= 90) { // 第二象限
      this.ly = py + Math.sin((this.ldeg - 90) / 180 * PI) * r;
      this.lx = px + Math.cos((this.ldeg - 90) / 180 * PI) * r;
    } else { // 第一象限
      this.ly = py - Math.cos(this.ldeg / 180 * PI) * r;
      this.lx = px + Math.sin(this.ldeg / 180 * PI) * r;
    }
  },
  drawOutArrow() {
    const arrow = this.outArrow[0];
    if (!arrow) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.fillRect(px, this.outArrow[0].top, aw, ah);
    this.ctx.stroke();

    if (this.shooting) {
      this.outArrow[0].top -= 24;
    }
    
    if (this.outArrow[0].top <= (py + r)) {
      this.outArrow.shift();
      this.shooting = false;
      let res = false;

      // 检查碰撞
      for (let i = 0; i < this.inArrow.length; i++) {
        if (Math.abs(this.inArrow[i].deg - 180) <= 6) {
          res = true;
        }
      }
      // console.log(JSON.parse(JSON.stringify(this.inArrow)));
      if (res) {
        this.gameOver = true;
        console.log('游戏结束');
      } else {
        this.inArrow.push({ deg: 180 });
        if (this.outArrow.length === 0) {
          console.log('下一关');
          this.level++;
          this.speed++;
          this.init();
        }
      }
    }
  },
  drawInArrow() {
    for (let i = 0; i < this.inArrow.length; i++) {
      let deg = this.inArrow[i].deg;
      if (deg >= 360) {
        this.inArrow[i].deg = 0;
        deg = 0;
      }
      let x;
      let y;
      if (deg >= 270) { // 第四象限
        const d = (deg - 270) / 180 * PI;
        y = py - Math.sin(d) * r;
        x = px - Math.cos(d) * r;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - Math.cos(d) * ah, y - Math.sin(d) * ah);
        this.ctx.lineTo(x - Math.cos(d) * ah + Math.sin(d) * aw, y - Math.sin(d) * ah - Math.cos(d) * aw);
        this.ctx.lineTo(x + Math.sin(d) * aw, y - Math.cos(d) * aw);
      } else if (deg >= 180) { // 第三象限
        const d = (deg - 180) / 180 * PI
        y = py + Math.cos(d) * r;
        x = px - Math.sin(d) * r;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - Math.sin(d) * ah, y + Math.cos(d) * ah);
        this.ctx.lineTo(x - Math.sin(d) * ah - Math.cos(d) * aw, y + Math.cos(d) * ah - Math.sin(d) * aw);
        this.ctx.lineTo(x - Math.cos(d) * aw, y - Math.sin(d) * aw);
      } else if (deg >= 90) { // 第二象限
        const d = (deg - 90) / 180 * PI
        y = py + Math.sin(d) * r;
        x = px + Math.cos(d) * r;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + Math.cos(d) * ah, y + Math.sin(d) * ah);
        this.ctx.lineTo(x + Math.cos(d) * ah - Math.sin(d) * aw, y + Math.sin(d) * ah + Math.cos(d) * aw);
        this.ctx.lineTo(x - Math.sin(d) * aw, y + Math.cos(d) * aw);
      } else { // 第一象限
        const d = deg / 180 * PI;
        y = py - Math.cos(d) * r;
        x = px + Math.sin(d) * r;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + Math.sin(d) * ah, y - Math.cos(d) * ah);
        this.ctx.lineTo(x + Math.sin(d) * ah + Math.cos(d) * aw, y - Math.cos(d) * ah + Math.sin(d) * aw);
        this.ctx.lineTo(x + Math.cos(d) * aw, y + Math.sin(d) * aw);
        this.ctx.lineTo(x, y);
      }
      this.ctx.fill();
      this.inArrow[i].deg += this.speed;
    }
  },
  drawNumber() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#000';
    this.ctx.font = '24px STheiti, SimHei';
    this.ctx.fillText(`x ${this.outArrow.length}`, px + 60, 180 + py + r + 2 * ah);
    // this.ctx.fillText(`1111`, 0, 0)
    this.ctx.fillText(`第 ${this.level} 关`, px + 60, 180 + py + r +  ah);

  },
  bind() {
    this.canvas.addEventListener('touchstart', () => {
      if (this.shooting) {
        return;
      }
      this.shooting = true;
    });
  }
}

Arrow.init();
Arrow.run();