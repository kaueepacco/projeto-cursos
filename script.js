document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cursoId = urlParams.get('id');
  const errorDiv = document.getElementById('quiz-error');

  if (!cursos || !Array.isArray(cursos)) {
    if (errorDiv) errorDiv.textContent = 'Erro: dados dos cursos não encontrados.';
    console.error('Variável "cursos" indefinida ou inválida.');
    return;
  }

  if (!cursoId || typeof cursos[cursoId] === 'undefined') {
    if (errorDiv) errorDiv.textContent = 'Curso não encontrado.';
    console.error('cursoId inválido:', cursoId);
    return;
  }

  const curso = cursos[cursoId];
  const STORAGE_KEY = `quiz_progress_${cursoId}`;

  // elementos
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const feedbackElement = document.getElementById("feedback");
  const nextButton = document.getElementById("next-btn");
  const backButton = document.getElementById("back-btn");
  const cursoTitle = document.getElementById("curso-title");
  const progressGrid = document.getElementById("progress-grid");
  const acertosEl = document.getElementById("acertos");
  const errosEl = document.getElementById("erros");
  const retryBtn = document.getElementById("retry-btn");
  const finishBtn = document.getElementById("finish-btn");

  if (!curso.questions || !curso.questions.length) {
    if (errorDiv) errorDiv.textContent = 'Este curso não possui perguntas.';
    console.error('Sem perguntas no curso:', curso);
    return;
  }

  // estado
  let state = {
    currentQuestionIndex: 0,
    score: 0,
    erros: 0,
    answered: {},
    selected: {}
  };

  // carregar salvo
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      Object.assign(state, JSON.parse(saved));
    } catch (e) {
      console.warn("Falha ao ler estado salvo:", e);
    }
  }

  const totalQuestions = curso.questions.length;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function resetQuizState() {
    localStorage.removeItem(STORAGE_KEY);
    state = {
      currentQuestionIndex: 0,
      score: 0,
      erros: 0,
      answered: {},
      selected: {}
    };
    saveState();
  }

  function updateScoreboard() {
    acertosEl.textContent = state.score;
    errosEl.textContent = state.erros;
  }

  function renderProgress() {
    progressGrid.innerHTML = '';
    for (let i = 0; i < totalQuestions; i++) {
      const box = document.createElement('div');
      box.className = 'progress-box';
      if (i === state.currentQuestionIndex) box.classList.add('active');
      if (state.answered[i]) box.classList.add('done');
      progressGrid.appendChild(box);
    }
  }

  function resetUI() {
    answersElement.innerHTML = '';
    feedbackElement.innerHTML = '';
    feedbackElement.classList.add('hidden');
    nextButton.classList.add('hidden');
    retryBtn.classList.add('hidden');
  }

  function showQuestion() {
    resetUI();
    updateScoreboard();

    const current = curso.questions[state.currentQuestionIndex];
    questionElement.textContent = current.question;

    current.answers.forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = a.text;

      btn.addEventListener('click', () => selectAnswer(btn, a));

      answersElement.appendChild(btn);
    });

    renderProgress();

    if (state.answered[state.currentQuestionIndex]) applyAnsweredState();
  }

  function applyAnsweredState() {
    const idx = state.currentQuestionIndex;
    const current = curso.questions[idx];
    const selectedText = state.selected[idx];

    const correctText = current.answers.find(a => a.correct).text;

    document.querySelectorAll(".answer-btn").forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === correctText) btn.classList.add("correct");
      if (btn.textContent === selectedText && selectedText !== correctText)
        btn.classList.add("incorrect");
    });

    feedbackElement.innerHTML = current.comment;
    feedbackElement.classList.remove("hidden");
    nextButton.classList.remove("hidden");
  }

  function selectAnswer(button, answer) {
    if (state.answered[state.currentQuestionIndex]) return;

    const current = curso.questions[state.currentQuestionIndex];
    const correctText = current.answers.find(a => a.correct).text;

    document.querySelectorAll(".answer-btn").forEach(b => (b.disabled = true));

    state.selected[state.currentQuestionIndex] = answer.text;

    if (answer.correct) {
      button.classList.add("correct");
      feedbackElement.textContent = "✅ Correto! " + current.comment;
      state.score++;
    } else {
      button.classList.add("incorrect");
      feedbackElement.textContent =
        `❌ Errado! A resposta correta é: ${correctText}. ` + current.comment;
      state.erros++;
    }

    state.answered[state.currentQuestionIndex] = true;

    feedbackElement.classList.remove("hidden");
    nextButton.classList.remove("hidden");

    updateScoreboard();
    saveState();
    renderProgress();
  }

  nextButton.addEventListener("click", () => {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex >= totalQuestions) {
      endQuiz();
      return;
    }
    saveState();
    showQuestion();
  });

  function endQuiz() {
    const total = totalQuestions;
    const metade = total / 2;

    questionElement.textContent = "🎓 Fim do Quiz!";
    answersElement.innerHTML = "";

    let message = `Você acertou ${state.score} de ${total} perguntas!`;

    let desempenhoMsg = "";
    if (state.score >= metade) {
      desempenhoMsg = "👏 Excelente! Você acertou mais da metade das perguntas.";
    } else {
      desempenhoMsg =
        "⚠️ Você acertou menos da metade. Recomendamos revisar o conteúdo e tentar novamente.";
    }

    feedbackElement.innerHTML = `
      <p>${message}</p>
      <p style="margin-top:10px;font-weight:bold;">${desempenhoMsg}</p>
    `;
    feedbackElement.classList.remove("hidden");

    nextButton.classList.add("hidden");

    // botão refazer aparece apenas se errou maioria
    if (state.score < metade) {
      retryBtn.classList.remove("hidden");
    }

    if (state.score >= metade) {
      finishBtn.classList.remove("hidden");
    }

    updateScoreboard();
    renderProgress();
  }

  retryBtn.addEventListener("click", () => {
    resetQuizState();
    window.location.href = `curso.html?id=${cursoId}`;
  });

  finishBtn.addEventListener("click", () => {
    resetQuizState();
    window.location.href = `curso.html?id=${cursoId}`;
  });

  // inicialização
  updateScoreboard();
  renderProgress();
  showQuestion();
});






