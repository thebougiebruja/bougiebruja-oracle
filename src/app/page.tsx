<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bougie Bruja Oracle – iMac G3 Edition</title>
  <style>
    body {
      margin: 0;
      background-color: #111;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .imac-g3 {
      background: linear-gradient(145deg, #9bd3e1, #7eb8d4);
      border-radius: 30px 30px 20px 20px;
      width: 360px;
      height: 420px;
      position: relative;
      box-shadow: 0 0 60px #2e94b9aa;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 25px;
      border: 6px solid #aee0f0;
    }

    .logo {
      font-size: 16px;
      font-weight: bold;
      color: #003344;
      margin-bottom: 10px;
    }

    .screen {
      background-color: #000;
      color: #ff00ff;
      border-radius: 16px;
      width: 260px;
      height: 190px;
      padding: 12px;
      box-sizing: border-box;
      font-size: 13px;
      overflow-y: auto;
      box-shadow: inset 0 0 10px #222;
    }

    .terminal-text::after {
      content: '_';
      animation: blink 1s infinite;
    }

    .bottom-curve {
      width: 100%;
      height: 60px;
      background: radial-gradient(circle at center, #b6ebff, #7eb8d4);
      border-radius: 0 0 30px 30px;
      margin-top: auto;
    }

    .keyboard {
      background-color: #d4f3fc;
      margin-top: 20px;
      padding: 12px 18px;
      border-radius: 12px;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 6px;
      width: 400px;
      box-shadow: 0 0 25px #7eb8d4cc;
      border: 3px solid #aee0f0;
    }

    .key {
      background-color: #eefcff;
      border: 1px solid #a2c7d9;
      border-radius: 4px;
      text-align: center;
      padding: 6px 0;
      font-size: 11px;
      box-shadow: inset -1px -1px 0 #cceaf5;
      color: #003344;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  </style>
</head>
<body>
  <div class="imac-g3">
    <div class="logo">🌙 Bougie Bruja Oracle</div>
    <div class="screen">
      <div class="terminal-text">
        > Welcome to the Oracle.<br>
        > Initializing G3 vibes...<br>
        > Tuning to cosmic frequency... DONE.<br><br>
        > Type HELP to divine your path.
      </div>
    </div>
    <div class="bottom-curve"></div>
  </div>

  <div class="keyboard">
    <div class="key">ESC</div>
    <div class="key">1</div>
    <div class="key">2</div>
    <div class="key">3</div>
    <div class="key">4</div>
    <div class="key">5</div>
    <div class="key">6</div>
    <div class="key">7</div>
    <div class="key">8</div>
    <div class="key">9</div>
    <div class="key">0</div>
    <div class="key">⌫</div>
    <div class="key">TAB</div>
    <div class="key">Q</div>
    <div class="key">W</div>
    <div class="key">E</div>
    <div class="key">R</div>
    <div class="key">T</div>
    <div class="key">Y</div>
    <div class="key">U</div>
    <div class="key">I</div>
    <div class="key">O</div>
    <div class="key">P</div>
    <div class="key">\</div>
    <div class="key">CAPS</div>
    <div class="key">A</div>
    <div class="key">S</div>
    <div class="key">D</div>
    <div class="key">F</div>
    <div class="key">G</div>
    <div class="key">H</div>
    <div class="key">J</div>
    <div class="key">K</div>
    <div class="key">L</div>
    <div class="key">ENTER</div>
    <div class="key">SHIFT</div>
    <div class="key">Z</div>
    <div class="key">X</div>
    <div class="key">C</div>
    <div class="key">V</div>
    <div class="key">B</div>
    <div class="key">N</div>
    <div class="key">M</div>
    <div class="key">,</div>
    <div class="key">.</div>
    <div class="key">/</div>
    <div class="key">SHIFT</div>
    <div class="key" style="grid-column: span 3">SPACE</div>
    <div class="key">CMD</div>
    <div class="key">CTRL</div>
  </div>
</body>
</html>
