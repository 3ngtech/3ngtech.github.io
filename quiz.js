const quizData = [
    {
      question: "1 - ¿Cuál es la mejor manera de estructurar un prompt efectivo?",
      options: ["Pedirle que se curta", "Dar contexto y ejemplos", "Usar jerga innecesaria", "Pedir por favor"],
      answer: 1
    },
    {
      question: "2 - Pedirle que 'actúe' como algo en el prompt (un profesional de algo) no afecta realmente al desempeño de la IA.",
      options: ["Verdadero", "Falso"],
      answer: 1
    },
    {
      question: "3NG - ¿Qué se le debe agregar al prompt para que la IA evite malentendidos?",
      options: ["Ornamentos de navidad", "Amenazas", "Especificaciones técnicas", "Advertencias sobre desinformación"],
      answer: 3
    },
    {
      question: "4 - ¿Cuáles son los principales componentes de un buen prompt?",
      options: ["Meta, formato, advertencias y contexto", "Modales, tecnisismos, requisitos y paciencia", "Pan, carne, queso y pan", "Descripciones, elementos, redundancias y objetivos"],
      answer: 0
    },
    {
      question: "5 - ChatGPT jamás inventaría información falsa.",
      options: ["Verdadero", "Falso"],
      answer: 1
    },
    {
      question: "Bonus - ¿Cuál te pareció el mejor stand del evento?",
      options: ["3NG", "La primer opción", "Estás flasheando", "Volvé a la primera"],
      answer: 0
    }
  ];
  
  let currentQuestion = 0;
  let correctAnswers = 0;
  let userName = "";
  let userEmail = "";
  
  const startBtn  = document.getElementById("start-btn");
  const quizDiv   = document.getElementById("quiz");
  const resultDiv = document.getElementById("result");
  const progress  = document.getElementById("progress");
  const bar       = document.getElementById("progress-bar");

startBtn.addEventListener("click", startQuiz);

function startQuiz() {
  userName  = document.getElementById("name").value.trim();
  userEmail = document.getElementById("email").value.trim();
  if (!userName || !userEmail) {
    alert("Por favor completa tu nombre y correo.");
    return;
  }
  document.getElementById("user-form").style.display = "none";
  progress.style.display = "block";
  updateProgress();
  showQuestion();
}

function showQuestion() {
  const q = quizData[currentQuestion];
  let html = `
    <!-- logo arriba de cada pregunta -->
    <img src="logo.svg" alt="Logo 3NG" class="logo" />
    <div class="question slide-in">
      <h2>${q.question}</h2>
      <div class="options">
  `;
  q.options.forEach((opt, idx) => {
    html += `
      <input type="radio" id="opt${idx}" name="q${currentQuestion}" value="${idx}" />
      <label for="opt${idx}">${opt}</label>
    `;
  });
  html += `
      </div>
      <button onclick="submitAnswer()">Siguiente</button>
    </div>
  `;
  quizDiv.innerHTML = html;


  setTimeout(() => {
    const qEl = quizDiv.querySelector(".slide-in");
    if (qEl) qEl.classList.remove("slide-in");
  }, parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--slide-duration')) * 1000);


  document.querySelector("main").scrollIntoView({ behavior: "smooth" });
}

function submitAnswer() {
  const radios = document.getElementsByName(`q${currentQuestion}`);
  const sel = Array.from(radios).find(r => r.checked);
  if (!sel) {
    alert("Selecciona una opción antes de continuar.");
    return;
  }
  if (parseInt(sel.value) === quizData[currentQuestion].answer) {
    correctAnswers++;
  }
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    updateProgress();
    showQuestion();
  } else {
    showResult();
  }
}

function updateProgress() {
  const pct = (currentQuestion / quizData.length) * 100;
  bar.style.width = pct + "%";
}

function showResult() {

  progress.style.display = "none";
  quizDiv.style.display = "none";


  let html = `
    <img src="logo.svg" alt="Logo 3NG" class="logo" />
    <div class="result-content">
      <h2>¡Gracias por participar, ${userName}!</h2>
      <p>Respuestas correctas: ${correctAnswers} de ${quizData.length}</p>
  `;

  if (correctAnswers >= 4) {
    const ticket = Math.floor(Math.random() * 100);
    html += `<p>¡Felicidades! Ganaste un número para el sorteo: <strong>${ticket}</strong></p>`;
  } else {
    html += `<p>No alcanzaste el mínimo para el sorteo :( ¡Intenta de nuevo!</p>`;
  }


  html += `
    </div>
    <div class="linktree">
      <p>¡Seguinos en nuestras redes para no perderte novedades!</p>
      <a href="https://linktr.ee/3ng.tech" target="_blank" rel="noopener">3NG Tech - Intelligent Solutions</a>
    </div>
  `;


  resultDiv.innerHTML = html;
  resultDiv.style.display = "block";


  enviarDatosAGoogleForms(userName, userEmail);
}

function enviarDatosAGoogleForms(nombre, email) {
  const formData = new FormData();
  formData.append("entry.1928113339", nombre);
  formData.append("entry.1167454035", email);
  fetch("https://docs.google.com/forms/d/e/1FAIpQLSdYtH5gcZQ-w3Hdp2_Dz7OLYW6kAeEZktNoNM6vfsdhEMI-Ug/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });
}