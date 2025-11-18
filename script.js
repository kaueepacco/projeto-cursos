document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cursoId = urlParams.get('id');
  const errorDiv = document.getElementById('quiz-error');

  if (typeof cursos === 'undefined' || !Array.isArray(cursos)) {
    if (errorDiv) errorDiv.textContent = 'Erro: dados dos cursos não encontrados.';
    console.error('Variável "cursos" indefinida.');
    return;
  }

  if (cursoId === null || typeof cursos[cursoId] === 'undefined') {
    if (errorDiv) errorDiv.textContent = 'Curso não encontrado.';
    return;
  }

  const curso = cursos[cursoId];
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const feedbackElement = document.getElementById("feedback");
  const nextButton = document.getElementById("next-btn");
  const backButton = document.getElementById("back-btn");
  const cursoTitle = document.getElementById("curso-title");
  const progressGrid = document.getElementById("progress-grid");

  // 🟢 NOVO: elementos do placar
  const acertosEl = document.getElementById("acertos");
  const errosEl = document.getElementById("erros");

  cursoTitle.textContent = curso.title || 'Curso';

  let currentQuestionIndex = 0;
  let score = 0;
  let erros = 0;

  function startQuiz() {
    backButton.classList.add('hidden');
    currentQuestionIndex = 0;
    score = 0;
    erros = 0;
    updateScoreboard();
    renderProgress();
    showQuestion();
  }

  function updateScoreboard() {
    acertosEl.textContent = score;
    errosEl.textContent = erros;
  }

  function renderProgress() {
    progressGrid.innerHTML = '';
    const total = (curso.questions && curso.questions.length) || 0;
    for (let i = 0; i < total; i++) {
      const box = document.createElement('div');
      box.className = 'progress-box';
      if (i < currentQuestionIndex) box.classList.add('done');
      if (i === currentQuestionIndex) box.classList.add('active');
      progressGrid.appendChild(box);
    }
  }

  function showQuestion() {
    resetState();
    const total = curso.questions.length;
    if (currentQuestionIndex >= total) {
      endQuiz();
      return;
    }

    const currentQuestion = curso.questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question || '';

    currentQuestion.answers.forEach(answer => {
      const button = document.createElement('button');
      button.textContent = answer.text;
      button.className = 'answer-btn';
      button.addEventListener('click', () => selectAnswer(button, answer));
      answersElement.appendChild(button);
    });

    renderProgress();
  }

  function resetState() {
    nextButton.classList.add('hidden');
    backButton.classList.add('hidden');
    feedbackElement.classList.add('hidden');
    feedbackElement.textContent = '';
    answersElement.innerHTML = '';
  }

  function selectAnswer(button, answer) {
    const currentQuestion = curso.questions[currentQuestionIndex];
    const allButtons = document.querySelectorAll(".answer-btn");
    allButtons.forEach(btn => btn.disabled = true);

    if (answer.correct) {
      button.classList.add("correct");
      feedbackElement.textContent = "✅ Correto! " + (currentQuestion.comment || '');
      score++;
    } else {
      button.classList.add("incorrect");
      const correctAnswer = currentQuestion.answers.find(a => a.correct)?.text || '—';
      feedbackElement.textContent = `❌ Errado! A resposta certa é: ${correctAnswer}. ${currentQuestion.comment || ''}`;
      erros++;
    }

    feedbackElement.classList.remove('hidden');
    nextButton.classList.remove('hidden');
    updateScoreboard();
    renderProgress();
  }

  nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < curso.questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  });

  function endQuiz() {
    questionElement.textContent = '🎓 Fim do Quiz!';
    answersElement.innerHTML = '';
    feedbackElement.textContent = `Você acertou ${score} de ${curso.questions.length} perguntas!`;
    nextButton.classList.add('hidden');
    backButton.classList.remove('hidden');
    updateScoreboard();
    renderProgress();
  }

  startQuiz();
});


