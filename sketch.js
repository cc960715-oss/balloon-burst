let circles = []; // 用來存放圓的屬性
let particles = []; // 爆破粒子
let popSound; // 爆破音效
let score = 0; // 分數

// 【新增變數開始】
let startTime; // 遊戲開始的時間點 (毫秒)
let elapsedTime = 0; // 已經過的時間 (秒)
let gameStarted = false; // 遊戲是否已經開始 (第一個氣球被點擊或移動時算開始)
let gameEnded = false; // 遊戲是否已經結束
// 【新增變數結束】

function setup() { 
  createCanvas(windowWidth, windowHeight);
  popSound = loadSound('balloonpop-83760'); 
  // 初始化 20 個圓
  for (let i = 0; i < 20; i++) { 
    let x = random(width); 
    let y = random(height); 
    let alpha = random(50, 255); 
    let dx = 0; 
    let dy = -0.5 * random(0.5, 1.5); 
    let r = random(100, 255); 
    let g = random(100, 255); 
    let b = random(100, 255); 
    let sz = random(50, 150); 
    circles.push({x, y, dx, dy, alpha, r, g, b, sz}); 
  }
}

function mousePressed() {
    // 【新增邏輯：在第一次點擊時記錄遊戲開始時間】
    if (!gameStarted) {
        startTime = millis(); // 記錄當前的毫秒數作為開始時間
        gameStarted = true;
    }
    // 【結束新增邏輯】

  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    let d = dist(mouseX, mouseY, c.x, c.y);
    if (d < c.sz / 2) {
      // 點到圓，產生爆破粒子
      for (let j = 0; j < 20; j++) {
        let angle = random(TWO_PI);
        let speed = random(2, 6);
        particles.push({
          x: c.x,
          y: c.y,
          dx: cos(angle) * speed,
          dy: sin(angle) * speed,
          r: c.r,
          g: c.g,
          b: c.b,
          alpha: 255,
          sz: random(5, 15)
        });
      }
      circles.splice(i, 1); // 移除被點擊的圓
      score++; // 分數加一
      break; // 一次只爆一個圓
    }
  }
}

function draw() {
  background("#a2d2ff");

  // 【新增邏輯：如果遊戲開始但未結束，則計算用時】
  if (gameStarted && !gameEnded) {
    // 計算經過的總毫秒數，並轉換成秒
    elapsedTime = (millis() - startTime) / 1000;
  }
  // 【結束新增邏輯】

  // 左上角加上白色文字
  fill(255);
  textSize(15);
  text('414730035', 10, 25);
  textSize(30);
  text('分數: ' + score, 10, 50);
  // 【新增顯示：顯示計時時間】
  // toFixed(2) 用於保留兩位小數，讓時間顯示更為整潔
  text('用時: ' + elapsedTime.toFixed(2) + ' 秒', 10, 85);
  // 【結束新增顯示】

  // 畫雲朵，中下面三個雲朵
  drawCloud(width*0.3, height*0.5, 150);
  drawCloud(width*0.6, height*0.55, 100);
  drawCloud(width*0.8, height*0.45, 130);
  // 上面三個雲朵
  drawCloud(width*0.2, height*0.2, 80);
  drawCloud(width*0.5, height*0.15, 120);
  drawCloud(width*0.75, height*0.25, 100);
  noStroke();

// 雲朵函式
function drawCloud(x, y, size) {
  noStroke();
  fill(255, 255, 255, 220);
  ellipse(x, y, size, size*0.6);
  ellipse(x-size*0.3, y+size*0.1, size*0.6, size*0.4);
  ellipse(x+size*0.3, y+size*0.1, size*0.7, size*0.5);
  ellipse(x, y+size*0.2, size*0.8, size*0.5);
}

  // 畫圓與小方塊
  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];
    fill(c.r, c.g, c.b, c.alpha);
    ellipse(c.x, c.y, c.sz, c.sz);

    // 在圓內右上角1/4處畫一個有圓角的小方塊
    let smallSquareSize = c.sz / 6;
    let offsetX = c.sz / 4;
    let offsetY = -c.sz / 4;
    fill(255, 255, 255, c.alpha);
    rect(
      c.x + offsetX,
      c.y + offsetY,
      smallSquareSize,
      smallSquareSize,
      smallSquareSize * 0.3
    );

    // 如果遊戲結束，氣球停止移動
    if (!gameEnded) {
        // 更新位置，速度很慢
        c.x += c.dx; 
        c.y += c.dy;
        // 如果飄到上方邊界，則回到下方
        if (c.y < 0) { 
            c.y = height;
            // 回到下方時，重新隨機速度
            c.dy = -0.5 * random(0.5, 1.5);
        }
    }
  }

  // 爆破粒子效果
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(p.r, p.g, p.b, p.alpha);
    ellipse(p.x, p.y, p.sz, p.sz);
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 8;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  // 全部圓都點擊完時顯示通關訊息
  if (circles.length === 0) {
    // 【新增邏輯：遊戲結束時停止計時】
    gameEnded = true; 
    // 【結束新增邏輯】
    
    fill(255, 0, 0); 
    textSize(50);
    textAlign(CENTER, CENTER);
    text('恭喜通關！', width / 2, height / 2);
    // 【顯示最終用時】
    textSize(30);
    text('總用時：' + elapsedTime.toFixed(2) + ' 秒', width / 2, height / 2 + 60);
    // 【結束顯示最終用時】

    textAlign(LEFT, BASELINE); // 恢復預設
  }
}


function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
}