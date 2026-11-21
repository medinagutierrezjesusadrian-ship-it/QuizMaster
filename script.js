
const questions = [
  {c:"Cultura general",d:"easy",q:"¿Cuál es el océano más grande?",a:["Atlántico","Pacífico","Índico","Ártico"],r:1},
  {c:"Cultura general",d:"easy",q:"¿Cuántos días tiene una semana?",a:["5","6","7","8"],r:2},
  {c:"Cultura general",d:"medium",q:"¿Cuál es el idioma con más hablantes nativos?",a:["Inglés","Español","Chino mandarín","Francés"],r:2},
  {c:"Cultura general",d:"hard",q:"¿En qué año llegó el hombre a la Luna?",a:["1965","1969","1972","1980"],r:1},

  {c:"Ciencia",d:"easy",q:"¿Qué planeta es conocido como el planeta rojo?",a:["Venus","Marte","Júpiter","Saturno"],r:1},
  {c:"Ciencia",d:"easy",q:"¿Qué órgano bombea la sangre?",a:["Pulmón","Cerebro","Corazón","Estómago"],r:2},
  {c:"Ciencia",d:"medium",q:"¿Cuál es el símbolo químico del oro?",a:["Ag","Au","Fe","O"],r:1},
  {c:"Ciencia",d:"hard",q:"¿Cuál es la velocidad aproximada de la luz?",a:["300 km/s","3.000 km/s","300.000 km/s","30.000 km/s"],r:2},

  {c:"Historia",d:"easy",q:"¿Quién fue el primer hombre en pisar la Luna?",a:["Yuri Gagarin","Neil Armstrong","Einstein","Buzz Aldrin"],r:1},
  {c:"Historia",d:"easy",q:"¿Dónde están las pirámides de Guiza?",a:["México","Grecia","Egipto","Italia"],r:2},
  {c:"Historia",d:"medium",q:"¿En qué año comenzó la Segunda Guerra Mundial?",a:["1914","1939","1945","1929"],r:1},
  {c:"Historia",d:"hard",q:"¿En qué año cayó el Imperio romano de Occidente?",a:["476","1492","800","395"],r:0},

  {c:"Deportes",d:"easy",q:"¿Cuántos jugadores tiene un equipo de fútbol en el campo?",a:["9","10","11","12"],r:2},
  {c:"Deportes",d:"easy",q:"¿Cada cuántos años se celebra el Mundial de fútbol?",a:["2","3","4","5"],r:2},
  {c:"Deportes",d:"medium",q:"¿En qué deporte se utiliza una raqueta?",a:["Natación","Tenis","Atletismo","Boxeo"],r:1},
  {c:"Deportes",d:"hard",q:"¿Dónde se celebraron los primeros Juegos Olímpicos modernos?",a:["París","Roma","Atenas","Londres"],r:2},

  {c:"Geografía",d:"easy",q:"¿Cuál es la capital de Colombia?",a:["Medellín","Bogotá","Cali","Cartagena"],r:1},
  {c:"Geografía",d:"easy",q:"¿En qué continente está Brasil?",a:["Asia","Europa","América del Sur","África"],r:2},
  {c:"Geografía",d:"medium",q:"¿Cuál es el país más grande del mundo?",a:["China","Canadá","Rusia","Brasil"],r:2},
  {c:"Geografía",d:"hard",q:"¿Cuál es la capital de Mongolia?",a:["Taskent","Ulán Bator","Katmandú","Daca"],r:1},

  {c:"Matemáticas",d:"easy",q:"¿Cuánto es 8 × 7?",a:["54","56","64","48"],r:1},
  {c:"Matemáticas",d:"easy",q:"¿Cuánto es 100 ÷ 4?",a:["20","25","30","40"],r:1},
  {c:"Matemáticas",d:"medium",q:"¿Cuál es la raíz cuadrada de 144?",a:["10","11","12","14"],r:2},
  {c:"Matemáticas",d:"hard",q:"¿Cuánto es el 15% de 200?",a:["20","25","30","35"],r:2},

  {c:"Retos",d:"easy",q:"¿Qué número sigue? 2, 4, 6, 8...",a:["9","10","12","14"],r:1},
  {c:"Retos",d:"easy",q:"¿Qué pesa más: un kilo de hierro o uno de algodón?",a:["Hierro","Algodón","Pesan igual","Depende"],r:2},
  {c:"Retos",d:"medium",q:"Si tienes 3 manzanas y te regalan 2, ¿cuántas tienes?",a:["3","4","5","6"],r:2},
  {c:"Retos",d:"hard",q:"¿Qué número falta? 1, 1, 2, 3, 5, 8...",a:["10","11","13","15"],r:2}
];

const categories = [
  ["🌎","Cultura general"],
  ["🔬","Ciencia"],
  ["📜","Historia"],
  ["⚽","Deportes"],
  ["🌍","Geografía"],
  ["🧮","Matemáticas"],
  ["🧠","Retos"]
];

const $ = id => document.getElementById(id);

let category = "Cultura general";
let difficulty = "easy";
let mode = "normal";
let currentQuestions = [];
let current = 0;
let points = 0;
let correctAnswers = 0;
let answered = false;


let storage = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.log("Almacenamiento no disponible");
    }
  }
};

let saved = JSON.parse(storage.get("qmData") || "{}");


saved.score = saved.score || 0;
saved.level = saved.level || 1;
saved.played = saved.played || 0;
saved.correct = saved.correct || 0;
saved.ranking = saved.ranking || [];

function save() {
  storage.set("qmData", JSON.stringify(saved));
  updateStats();
}

function updateStats() {
  $("score").textContent = saved.score;
  $("level").textContent = saved.level;
  $("played").textContent = saved.played;
}

function show(section) {
  ["home","game","result","ranking","statistics"].forEach(id => {
    $(id).hidden = id !== section;
  });
}

function createCategories() {
  $("categories").innerHTML = categories.map(([emoji,name]) =>
    `<button class="category ${name === category ? "selected" : ""}" data-cat="${name}">
      <span>${emoji}</span>${name}
    </button>`
  ).join("");

  document.querySelectorAll(".category").forEach(btn => {
    btn.onclick = () => {
      category = btn.dataset.cat;
      createCategories();
    };
  });
}

document.querySelectorAll(".modes button").forEach(btn => {
  btn.onclick = () => {
    mode = btn.dataset.mode;
    document.querySelectorAll(".modes button").forEach(b =>
      b.classList.toggle("selected", b === btn)
    );
  };
});

$("difficulty").onchange = e => {
  difficulty = e.target.value;
};

$("startBtn").onclick = startGame;


function startGame() {
  currentQuestions = questions.filter(q =>
    q.c === category && q.d === difficulty
  );

  if (!currentQuestions.length) {
    alert("No hay preguntas disponibles.");
    return;
  }

  currentQuestions = [...currentQuestions].sort(
    () => Math.random() - 0.5
  );

  current = 0;
  points = 0;
  correctAnswers = 0;

  if (mode === "normal") {
    currentQuestions = currentQuestions.slice(0, 5);
  }

  show("game");
  displayQuestion();
}


function displayQuestion() {
  answered = false;

  const q = currentQuestions[current];

  $("questionCount").textContent =
    `Pregunta ${current + 1} de ${currentQuestions.length}`;

  $("progressBar").style.width =
    `${(current / currentQuestions.length) * 100}%`;

  $("categoryLabel").textContent = q.c;
  $("question").textContent = q.q;
  $("feedback").textContent = "";
  $("nextBtn").hidden = true;

  $("answers").innerHTML = q.a.map((answer,i) =>
    `<button class="answer" data-index="${i}">${answer}</button>`
  ).join("");

  document.querySelectorAll(".answer").forEach(btn => {
    btn.onclick = () => checkAnswer(Number(btn.dataset.index));
  });
}

function checkAnswer(index) {
  if (answered) return;

  answered = true;

  const q = currentQuestions[current];

  document.querySelectorAll(".answer").forEach((btn,i) => {
    btn.disabled = true;

    if (i === q.r) btn.classList.add("correct");
    if (i === index && i !== q.r) btn.classList.add("wrong");
  });

  if (index === q.r) {
    points += difficulty === "easy" ? 10 :
              difficulty === "medium" ? 20 : 30;

    correctAnswers++;

    $("feedback").textContent = "¡Respuesta correcta! 🎉";
    $("feedback").style.color = "#27ae60";
  } else {
    $("feedback").textContent = "Respuesta incorrecta. ¡Sigue aprendiendo!";
    $("feedback").style.color = "#e45c5c";
  }

  $("nextBtn").hidden = false;
}


$("nextBtn").onclick = () => {
  current++;

  if (current >= currentQuestions.length) {
    if (mode === "infinite") {
      current = 0;

      currentQuestions.sort(
        () => Math.random() - 0.5
      );
    } else {
      finishGame();
      return;
    }
  }

  displayQuestion();
};


function finishGame() {
  saved.score += points;
  saved.played++;
  saved.correct += correctAnswers;

  if (mode === "normal") {
    saved.level = Math.min(100, saved.level + 1);
  }

  saved.ranking.push({
    score: points,
    date: new Date().toLocaleDateString()
  });

  saved.ranking.sort((a,b) => b.score - a.score);
  saved.ranking = saved.ranking.slice(0,10);

  save();

  $("finalScore").textContent = points;
  $("resultText").textContent =
    `Acertaste ${correctAnswers} de ${currentQuestions.length} preguntas.`;

  $("progressBar").style.width = "100%";

  show("result");
}

$("againBtn").onclick = startGame;
$("homeBtn").onclick = () => show("home");
$("backBtn").onclick = () => show("home");

$("rankingBtn").onclick = () => {
  $("rankingList").innerHTML = saved.ranking.length
    ? saved.ranking.map((r,i) =>
      `<div><strong>${i+1}. 🏆 ${r.score} puntos</strong><br><small>${r.date}</small></div>`
    ).join("")
    : "<p>Aún no tienes partidas registradas.</p>";

  show("ranking");
};

$("statsBtn").onclick = () => {
  $("statisticsData").innerHTML = `
    <div>⭐ Puntos acumulados: <strong>${saved.score}</strong></div>
    <div>🎮 Partidas jugadas: <strong>${saved.played}</strong></div>
    <div>🧠 Respuestas correctas: <strong>${saved.correct}</strong></div>
    <div>🏆 Nivel actual: <strong>${saved.level}</strong></div>
  `;

  show("statistics");
};

document.querySelectorAll(".returnBtn").forEach(btn => {
  btn.onclick = () => show("home");
});

$("themeBtn").onclick = () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  $("themeBtn").textContent = dark ? "☀️" : "🌙";

  storage.set("qmTheme", dark ? "dark" : "light");
};

if (storage.get("qmTheme") === "dark") {
  document.body.classList.add("dark");
  $("themeBtn").textContent = "☀️";
}

createCategories();
updateStats();
show("home");
