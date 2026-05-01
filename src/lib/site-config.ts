export const siteConfig = {
  herName: "Sweety",
  eventTitle: "Sweety Birthday Surprise",
  birthdayDate: "2026-05-03T00:00:00",
  passcode: "chotey",
  revealMessage: "Hey Sweety... its finally your day <3",
  revealSubmessage: "Tonight is the beginning of your surprises.",
  hint: "Your first surprise is waiting outside...",
  backgroundImage: "", // Set this to your image URL
  backgroundBlur: 8, // Blur amount in pixels
  music: {
    title: "Our Song",
    url: "",
  },
  siteUrl: "",
  sections: [
    { id: "countdown", label: "Countdown", path: "/countdown" },
    { id: "game", label: "Mini Game", path: "/game" },
    { id: "wish-jar", label: "Wish Jar", path: "/wish-jar" },
    { id: "videos", label: "Video Wall", path: "/videos" },
  ],
  game: {
    gridSize: 4,
    loveNotes: [
      "You make me smile.",
      "I am lucky to have you.",
      "Every day with you is my favorite.",
      "Your laugh is my favorite sound.",
      "You are my calm and my spark.",
      "You are my home.",
      "With you, I found my forever.",
      "You are my greatest adventure.",
    ],
    winMessage: "You scored 100%... just like my love for you.",
  },
  wishCategories: [
    { id: "friend", label: "Friend", tone: "rose" },
    { id: "family", label: "Family", tone: "peach" },
    { id: "you", label: "You", tone: "amber" },
  ],
};
