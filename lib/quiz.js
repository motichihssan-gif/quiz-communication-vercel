export const QUESTIONS = [
  {
    id: 1,
    question: "Dans l'approche conventionnelle, comment l'organisation est-elle vue ?",
    options: [
      "Comme un ensemble de conversations sans structure",
      "Comme une structure déjà établie dans laquelle la communication circule",
      "Comme un phénomène uniquement individuel",
      "Comme un réseau sans règles ni objectifs"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "Dans la conception informationnelle, un problème de communication est principalement :",
    options: [
      "Un manque de bâtiments adaptés",
      "Une absence totale de hiérarchie",
      "Une difficulté à transmettre correctement une information",
      "Un désaccord sur la structure juridique"
    ],
    correct: 2
  },
  {
    id: 3,
    question: "Lequel de ces exemples illustre la forme matérielle de l'organisation ?",
    options: [
      "Les bureaux, les équipements et les locaux",
      "Les discussions informelles entre collègues",
      "Les interprétations personnelles d'un message",
      "Les relations symboliques entre les membres"
    ],
    correct: 0
  },
  {
    id: 4,
    question: "Quel paradoxe montre les limites de l'approche conventionnelle ?",
    options: [
      "Une organisation ne possède jamais de règles",
      "La communication n'a aucun effet sur le travail",
      "Les salariés refusent toujours de communiquer",
      "La communication est censée soutenir l'organisation, alors qu'elle contribue aussi à la construire"
    ],
    correct: 3
  },
  {
    id: 5,
    question: "Dans la conception constitutive, la communication est :",
    options: [
      "Un simple outil utilisé après la création de l'organisation",
      "Un processus qui participe à créer et maintenir l'organisation",
      "Une activité secondaire sans influence",
      "Uniquement un échange d'informations écrites"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "Selon l'approche constitutive, d'où viennent les organisations ?",
    options: [
      "Des interactions et des pratiques de communication",
      "Uniquement des bâtiments et des équipements",
      "Seulement des décisions administratives",
      "De la technologie utilisée par les salariés"
    ],
    correct: 0
  },
  {
    id: 7,
    question: "À propos d'un licenciement, que montre la perspective constitutive ?",
    options: [
      "Qu'il s'agit uniquement d'une décision financière",
      "Que la communication intervient seulement après la décision",
      "Que les mots n'ont aucun effet sur les relations de travail",
      "Que les échanges et les discours participent à produire la réalité organisationnelle"
    ],
    correct: 3
  },
  {
    id: 8,
    question: "Que représente l'analogie de la Terre plate ?",
    options: [
      "Une méthode pour organiser les équipes",
      "Une preuve scientifique sur la communication",
      "Une manière de montrer qu'une vision habituelle peut sembler évidente tout en étant limitée",
      "Une comparaison entre les entreprises et la géographie"
    ],
    correct: 2
  },
  {
    id: 9,
    question: "Laquelle de ces situations dépasse la simple transmission d'information ?",
    options: [
      "Envoyer une date par e-mail",
      "Négocier collectivement les règles et les rôles d'une équipe",
      "Afficher un numéro de téléphone",
      "Transmettre un document sans échange"
    ],
    correct: 1
  },
  {
    id: 10,
    question: "Selon la conclusion, pourquoi la communication est-elle « organisationnelle » ?",
    options: [
      "Parce qu'elle utilise toujours des outils numériques",
      "Parce qu'elle est réservée aux responsables",
      "Parce qu'elle participe à faire exister et évoluer l'organisation",
      "Parce qu'elle remplace toutes les règles écrites"
    ],
    correct: 2
  }
];

export const PUBLIC_QUESTIONS = QUESTIONS.map(({ correct, ...question }) => question);
export const QUESTION_DURATION_MS = 10_000;
export const BASE_POINTS = 1;
export const SPEED_BONUS = 1;
