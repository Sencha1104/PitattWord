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
  // ○表示
  document.getElementById("blank").textContent = "○".repeat(current.word.length);
  // ヒント表示
  document.getElementById("hints").innerHTML = current.parts
    .map(p => `${p.start}-${p.end}: ${p.genre}`)
    .join("<br>");
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
