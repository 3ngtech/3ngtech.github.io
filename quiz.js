const quizData = [
    {
      question: "1 - ¿Cuál es la mejor manera de estructurar un prompt efectivo?",
      options: ["Pedirle que se curta", "Dar contexto y ejemplos", "Usar jerga innecesaria", "Pedir por favor"],
      answer: 1
    },
    {
      question: "2 - Pedirle que 'actúe' como algo en el prompt (un profesional de un área específica) no afecta realmente al desempeño de la IA.",
      options: ["Verdadero", "Falso"],
      answer: 1
    },
    {
      question: "3NG - ¿Qué se le debe agregar al prompt para que la IA evite malentendidos?",
      options: ["Decoración navideña", "Amenazas", "Cuestiones personales", "Advertencias sobre desinformación"],
      answer: 3
    },
    {
      question: "4 - ¿Cuáles son los principales componentes de un buen prompt?",
      options: ["Meta, formato, advertencias y contexto", "Modales, tecnisismos, requisitos y paciencia", "Tres de carne, dos de choclo, tres de choclo", "Descripciones, elementos, redundancias y objetivos"],
      answer: 0
    },
    {
      question: "5 - ChatGPT jamás inventaría información falsa.",
      options: ["Verdadero", "Falso"],
      answer: 1
    },
    {
      question: "Bonus - ¿Cuál te pareció el mejor stand del evento?",
      options: ["3NG", "La primera opción", "La primera dije", "Dale loco"],
      answer: 0
    },
    {
      question: "Bonus 2 - ¿A qué charla voy a ir a las 17?",
      options: ["A la del goat Lucas Flores Lucero", "Habían charlas?", "Vine por la birra", "Y la birra?"],
      answer: 0
    },
    {
      question: "Bonus 3NG - ¿A qué charla voy a ir a las 18:45?",
      options: ["A la del gigachad Lucas Trubiano", "Pensé que había terminado", "Por favor que no hayan más preguntas", "Birra"],
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
      <!-- Aquí mostramos el mensaje -->
      <button onclick="submitAnswer()">Siguiente</button>
      <div id="feedback" class="feedback"></div> 
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

  const isCorrect = parseInt(sel.value) === quizData[currentQuestion].answer;
  if (isCorrect) correctAnswers++;

  const feedbackDiv = document.getElementById("feedback");
  
  feedbackDiv.className = 'feedback';
  feedbackDiv.textContent = '';

  
  feedbackDiv.textContent = isCorrect ? "Correcto ✅" : "Incorrecto ❌";
  feedbackDiv.classList.add(isCorrect ? "correct" : "incorrect");

  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      updateProgress();
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
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

  if (correctAnswers <= 3) {
    html += `<p>Bueno... De todas formas participas del sorteo! 😎</p>`
  } else {
    html += `<p>¡Felicidades! Ya estás participando para el sorteo 😎</p>`;
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