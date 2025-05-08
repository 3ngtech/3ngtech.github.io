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
  
  function startQuiz() {
    userName = document.getElementById("name").value.trim();
    userEmail = document.getElementById("email").value.trim();
    if (!userName || !userEmail) {
      alert("Por favor completa tu nombre y correo.");
      return;
    }

    document.getElementById("user-form").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    showQuestion();
  }
  
  function showQuestion() {
    const quizDiv = document.getElementById("quiz");
    const q = quizData[currentQuestion];
    let html = `<div class="question"><h2>${q.question}</h2><div class="options">`;
    q.options.forEach((opt, idx) => {
      html += `<label><input type="radio" name="q${currentQuestion}" value="${idx}" /> ${opt}</label>`;
    });
    html += `</div><button onclick="submitAnswer()">Siguiente</button></div>`;
    quizDiv.innerHTML = html;
  }
  
  function submitAnswer() {
    const radios = document.getElementsByName(`q${currentQuestion}`);
    let selected = null;
    for (const r of radios) {
      if (r.checked) selected = parseInt(r.value);
    }
    if (selected === null) {
      alert("Selecciona una opción antes de continuar.");
      return;
    }
    if (selected === quizData[currentQuestion].answer) correctAnswers++;
  
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      showResult();
    }
  }
  
  function showResult() {
    document.getElementById("quiz").style.display = "none";
    const resultDiv = document.getElementById("result");
    let message = `<h2>¡Gracias por participar, ${userName}!</h2>`;
    message += `<p>Respuestas correctas: ${correctAnswers} de ${quizData.length}</p>`;
    if (correctAnswers >= 4) {
      const ticket = Math.floor(Math.random() * 100);
      message += `<p>¡Felicidades! Ganaste un número para el sorteo de 3NG: <strong>${ticket}</strong></p>`;
    } else {
      message += `<p>No alcanzaste el mínimo para el sorteo :( ¡Intenta de nuevo!</p>`;
    }
    resultDiv.innerHTML = message;
    resultDiv.style.display = "block";
    enviarDatosAGoogleSheets(userName, userEmail);
  }  

  function enviarDatosAGoogleSheets(nombre, email) {
    fetch("https://script.google.com/macros/s/AKfycbzgDZy-7PU6zimcEPLmfKz4BdI8vrk_98TaSxV5xZ3gTHPwrLkagC6HC1qyZkIWsvnSCg/exec", {
      method: "POST",
      body: JSON.stringify({
        nombre,
        email,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => res.text())
    .then(data => console.log("Enviado a Sheets:", data))
    .catch(err => console.error("Error al enviar:", err));
  }
  