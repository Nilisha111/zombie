



const questions = [
  {
    question: "1. What if you woke up tomorrow and discovered that nobody could lie to you anymore?",
    options: [
      { text: "i will meet neesha.", monsters: ["vampire"] },
      { text: "I'd finally know who I could trust.", monsters: ["werewolf", "siren"] },
      { text: "I'd be fascinated by how the world changes.", monsters: ["witch"] },
      { text: "I'd wonder if people could still hide the truth without lying.", monsters: ["witch", "siren"] }
    ]
  },
  {
    question: "2. What if you were offered immortality, but had to give up one thing?",
    options: [
      { text: "The ability to love someone.", monsters: ["siren", "vampire"] },
      { text: "The ability to feel fear.", monsters: ["werewolf"] },
      { text: "All my memories.", monsters: ["witch", "werewolf"] },
      { text: "My freedom to make my own choices.", monsters: ["vampire", "witch"] }
    ]
  },
  {
    question: "3. What if you found out your best friend had kept a huge secret from you for years?",
    options: [
      { text: "I'd investigate before confronting them.", monsters: ["vampire", "witch"] },
      { text: "I'd confront them immediately.", monsters: ["werewolf"] },
      { text: "I'd try to understand why they hid it.", monsters: ["siren", "witch"] },
      { text: "I'd pretend I knew nothing and observe what happens.", monsters: ["vampire", "siren"] }
    ]
  },
  {
    question: "4. What if you could enter someone's dreams for one night?",
    options: [
      { text: "Discover what they're hiding.", monsters: ["vampire"] },
      { text: "Protect someone from their nightmares.", monsters: ["werewolf", "siren"] },
      { text: "Explore the strange world inside their mind.", monsters: ["witch"] },
      { text: "Leave them with a dream they'd never forget.", monsters: ["siren", "vampire"] }
    ]
  },
  {
    question: "5. What if you were the only person left in the world with supernatural powers?",
    options: [
      { text: "I'd quietly build influence.", monsters: ["vampire"] },
      { text: "I'd protect the people who mattered to me.", monsters: ["werewolf"] },
      { text: "I'd experiment and discover my limits.", monsters: ["witch"] },
      { text: "I'd make sure the world never forgot me.", monsters: ["siren", "vampire"] }
    ]
  },
  {
    question: "6. What if you discovered that one person in your friend group would betray everyone someday, but you didn't know who?",
    options: [
      { text: "I'd quietly watch everyone's behaviour.", monsters: ["vampire"] },
      { text: "I'd warn my friends and prepare for the worst.", monsters: ["werewolf"] },
      { text: "I'd try to figure out what could make someone betray us.", monsters: ["witch", "siren"] },
      { text: "I'd test everyone's loyalty without telling them why.", monsters: ["vampire", "werewolf"] }
    ]
  },
  {
    question: "7. You're trapped in a building with three strangers. You can save only one person before the building collapses. Who do you choose?",
    options: [
      { text: "The person who seems most useful for everyone's survival.", monsters: ["vampire"] },
      { text: "The person trying hardest to save the others.", monsters: ["werewolf"] },
      { text: "The person who seems to know something about the building.", monsters: ["witch"] },
      { text: "The person who makes eye contact and silently asks you for help.", monsters: ["siren", "werewolf"] }
    ]
  },
  {
    question: "8. What if someone offered to show you the exact date and cause of your death?",
    options: [
      { text: "I'd want to know. Information is power.", monsters: ["vampire"] },
      { text: "I'd refuse. I'd rather live without that fear.", monsters: ["werewolf"] },
      { text: "I'd be curious, even if I regretted it.", monsters: ["witch"] },
      { text: "I'd ask whether I could change someone else's fate instead.", monsters: ["siren", "werewolf"] }
    ]
  },
  {
    question: "9. You find a door in your house that has never existed before. It opens only once. What do you do?",
    options: [
      { text: "Study it first. There must be a reason it appeared.", monsters: ["vampire", "witch"] },
      { text: "Open it. I can't resist an adventure.", monsters: ["werewolf"] },
      { text: "Search for clues about where it leads.", monsters: ["witch"] },
      { text: "Knock first. You never know who's on the other side.", monsters: ["siren"] }
    ]
  },
  {
    question: "10. What if you could erase one memory, but also lose everything you learned from it?",
    options: [
      { text: "I'd erase a memory that makes me vulnerable.", monsters: ["vampire"] },
      { text: "I'd keep it. Pain is part of who I am.", monsters: ["werewolf"] },
      { text: "I'd need to understand what I'd lose before deciding.", monsters: ["witch"] },
      { text: "I'd erase it if it meant I could finally move on.", monsters: ["siren", "werewolf"] }
    ]
  },
  {
    question: "11. Which object would you take from a mysterious room?",
    options: [
      { text: "An antique watch", image: "images/watch.jpg", monsters: ["vampire"] },
      { text: "A strange compass", image: "images/compass.jpg", monsters: ["werewolf", "witch"] },
      { text: "A glowing vial", image: "images/vial.jpg", monsters: ["witch"] },
      { text: "An old music box", image: "images/music-box.jpg", monsters: ["siren", "vampire"] }
    ]
  },
  {
    question: "12. Which unusual place draws you in?",
    options: [
      { text: "A forgotten library", image: "images/library.jpg", monsters: ["vampire", "witch"] },
      { text: "A moonlit mountain path", image: "images/mountain.jpg", monsters: ["werewolf"] },
      { text: "An overgrown greenhouse", image: "images/greenhouse.jpg", monsters: ["witch"] },
      { text: "An abandoned seaside hotel", image: "images/seaside-hotel.jpg", monsters: ["siren"] }
    ]
  },
  {
    question: "13. Which scene feels strangely familiar?",
    options: [
      { text: "Watching a city from above", image: "images/city.jpg", monsters: ["vampire"] },
      { text: "Standing alone in a storm", image: "images/storm.jpg", monsters: ["werewolf"] },
      { text: "Walking through a strange dream", image: "images/dream.jpg", monsters: ["witch"] },
      { text: "Listening to the ocean at night", image: "images/ocean.jpg", monsters: ["siren"] }
    ]
  },
  {
    question: "14. You're accidentally made the leader of a group of chaotic people. What's your first move?",
    options: [
      { text: "Create a plan. Immediately.", monsters: ["vampire"] },
      { text: "Let everyone do their thing and somehow survive.", monsters: ["werewolf"] },
      { text: "Figure out what makes each person tick.", monsters: ["witch", "siren"] },
      { text: "Make everyone believe this was the plan all along.", monsters: ["siren", "vampire"] }
    ]
  },
  {
    question: "15. If your personality came with a warning label, what would it say?",
    options: [
      { text: "May know more than they let on.", monsters: ["vampire"] },
      { text: "Approach with caution when angry.", monsters: ["werewolf"] },
      { text: "Currently lost in seventeen different thoughts.", monsters: ["witch"] },
      { text: "Can be charming. May also be trouble.", monsters: ["siren"] }
    ]
  },
  {
    question: "16. Someone challenges you to a competition you have absolutely no experience in. What do you do?",
    options: [
      { text: "Research the rules before accepting.", monsters: ["vampire", "witch"] },
      { text: "Accept immediately. What's the worst that can happen?", monsters: ["werewolf"] },
      { text: "Find an unusual strategy nobody expects.", monsters: ["witch"] },
      { text: "Get the other person talking until you figure out their weaknesses.", monsters: ["siren", "vampire"] }
    ]
  },
  {
    question: "17. What would hurt you more?",
    options: [
      { text: "Being underestimated by everyone.", monsters: ["vampire"] },
      { text: "Failing to protect someone you love.", monsters: ["werewolf"] },
      { text: "Never discovering what you're truly capable of.", monsters: ["witch"] },
      { text: "Being completely forgotten by someone important to you.", monsters: ["siren"] }
    ]
  },
  {
    question: "18. If you could have one secret advantage in life, what would it be?",
    options: [
      { text: "Always knowing when someone is hiding something.", monsters: ["vampire", "witch"] },
      { text: "Never giving up, no matter how difficult things get.", monsters: ["werewolf"] },
      { text: "Understanding things other people cannot see.", monsters: ["witch"] },
      { text: "Being able to influence how people feel around you.", monsters: ["siren"] }
    ]
  },
  {
    question: "19. What would you do if you realised you were slowly becoming someone you once disliked?",
    options: [
      { text: "Take control before things get worse.", monsters: ["vampire"] },
      { text: "Fight against it, even if it costs me.", monsters: ["werewolf"] },
      { text: "Figure out why I'm changing.", monsters: ["witch"] },
      { text: "Hide it until I understand what is happening.", monsters: ["siren", "vampire"] }
    ]
  },
  {
    question: "20. At the end of your life, you could leave behind only one thing. What would it be?",
    options: [
      { text: "A legacy that proves I mattered.", monsters: ["vampire"] },
      { text: "People who know they were loved and protected.", monsters: ["werewolf"] },
      { text: "Something extraordinary that changes how people see the world.", monsters: ["witch"] },
      { text: "Memories that people will never be able to forget.", monsters: ["siren"] }
    ]
  }
];

const scores = {
  vampire: 0,
  werewolf: 0,
  witch: 0,
  siren: 0
};

// Call this when the player selects an answer
function calculateScore(selectedOption) {
  selectedOption.monsters.forEach(monster => {
    scores[monster]++;
  });
}

// Find the winning monster
function getResult() {
  const highestScore = Math.max(...Object.values(scores));

  const winners = Object.keys(scores).filter(monster => {
    return scores[monster] === highestScore;
  });

  return winners;
}
