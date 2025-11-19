// Exporte/defina a variável global "cursos"
const cursos = [
  {
    title: "Curso de Cultura Geral",
    description: "Aprenda e teste seus conhecimentos gerais com perguntas explicativas.",
    materials: [
      { title: "Introdução à Cultura Geral", video: "/materiais/video1.mp4" },
      { title: "Curiosidades sobre o Brasil", video: "/materiais/video2.mp4" }
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


