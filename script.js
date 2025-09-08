let problems = [];
let current = null;

async function loadProblems() {
  const res = await fetch("problems.txt");
  const text = await res.text();
  problems = text.trim().split("\n").map(line => {
    const [word, parts] = line.split("|");
    const parsedParts = parts.split(",").map(p => {
      const [range, genre] = p.split(":");
      const [start, end] = range.split("-").map(Number);
      return { start, end, genre };
    });
    return { word, parts: parsedParts };
  });
  nextProblem();
}

function nextProblem() {
  document.getElementById("result").textContent = "";
  document.getElementById("answer").value = "";
  current = problems[Math.floor(Math.random() * problems.length)];

  const blank = document.getElementById("blank");
  blank.innerHTML = "";

  // ○を文字ごとに表示
  for (let i = 0; i < current.word.length; i++) {
    const span = document.createElement("span");
    span.textContent = "○";
    span.className = "char";
    span.id = `char-${i + 1}`; // 1始まり
    blank.appendChild(span);
  }

  // 矢印を描画
  const arrowsDiv = document.getElementById("arrows");
  arrowsDiv.innerHTML = "";

  current.parts.forEach((p, idx) => {
    const startEl = document.getElementById(`char-${p.start}`);
    if (!startEl) return;

    const rect = startEl.getBoundingClientRect();
    const parentRect = blank.getBoundingClientRect();

    // 矢印 + ラベル
    const arrow = document.createElement("div");
    arrow.className = "arrow";
    arrow.innerHTML = `└─→<div class="label">${p.genre}</div>`;

    // 左端の位置に配置
    const left = rect.left - parentRect.left;
    const top = rect.bottom - parentRect.top + (idx * 40) + 10;

    arrow.style.left = left + "px";
    arrow.style.top = top + "px";

    arrowsDiv.appendChild(arrow);
  });
}

function checkAnswer() {
  const ans = document.getElementById("answer").value.trim();
  const result = document.getElementById("result");
  if (ans === current.word) {
    result.textContent = "✅ ピタッと！";
    result.style.color = "green";
  } else {
    result.textContent = "❌ 残念！";
    result.style.color = "red";
  }
}

loadProblems();
