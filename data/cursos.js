// Exporte/defina a variável global "cursos"
const cursos = [
  {
    title: "Curso de Cultura Geral",
    description: "Aprenda e teste seus conhecimentos gerais com perguntas explicativas.",
    materials: [
      { title: "Introdução à Cultura Geral", video: "https://www.youtube.com/embed/f9yQAT1jKjQ" },
      { title: "Curiosidades sobre o Brasil", video: "https://www.youtube.com/embed/K0qJ8H4KAE4" }
    ],
    questions: [
      {
        question: "Qual é a capital do Brasil?",
        answers: [
          { text: "São Paulo", correct: false },
          { text: "Brasília", correct: true },
          { text: "Rio de Janeiro", correct: false },
          { text: "Salvador", correct: false }
        ],
        comment: "Brasília foi inaugurada em 1960 e planejada por Lúcio Costa e Oscar Niemeyer."
      },
      {
        question: "Quem pintou a Mona Lisa?",
        answers: [
          { text: "Leonardo da Vinci", correct: true },
          { text: "Michelangelo", correct: false },
          { text: "Van Gogh", correct: false },
          { text: "Pablo Picasso", correct: false }
        ],
        comment: "Leonardo da Vinci pintou a Mona Lisa entre 1503 e 1506."
      }
    ]
  },

  // Você pode adicionar mais cursos aqui...
];


