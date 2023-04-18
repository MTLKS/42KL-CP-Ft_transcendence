const awesomeSynonyms: string[] = [
  "incredible",
  "fantastic",
  "outstanding",
  "remarkable",
  "splendid",
  "magnificent",
  "exceptional",
  "phenomenal",
  "superb",
  "amazing",
  "admirable",
  "brilliant",
  "dazzling",
  "extraordinary",
  "fabulous",
  "grand",
  "impressive",
  "majestic",
  "spectacular",
  "wondrous",
]

const iceBreakingQuestions: string[] = [
  "What's your favorite useless fact?",
  "Tell us, how do you feel about clowns?",
  "What's the best animal sound you can make?",
  "What's the smelliest food to cook in the office microwave?",
  "What emoji represents you today?",
  "What are you really terrible at?",
  "What is the oldest thing you own?",
  "What's a current trend you think is stupid?",
  "What's the story behind your name?",
]

export const getAwesomeSynonym = () => awesomeSynonyms[Math.floor(Math.random() * awesomeSynonyms.length)];

export const getRandomIceBreakingQuestion = () => iceBreakingQuestions[Math.floor(Math.random() * iceBreakingQuestions.length)];