export interface PersonalityType {
  id: string
  name: string
  description: string
  traits: string[]
  keywords: string[]
  imageUrl: string
  color: string
}

export const personalityTypes: PersonalityType[] = [
  {
    id: "adventurer",
    name: "The Adventurer",
    description:
      "You are an enthusiastic and spontaneous individual, always ready for new experiences and challenges. Your adventurous spirit and love for exploration make you a dynamic and engaging person.",
    traits: ["Spontaneous", "Curious", "Energetic", "Open-minded"],
    keywords: [
      "adventure",
      "travel",
      "explore",
      "new",
      "challenge",
      "experience",
      "outdoor",
      "risk",
      "spontaneous",
      "freedom",
    ],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwGcQOJZ7GRDc7dC4VR0btrE-R-3D0c2AOl5NRYiy1Wf5C9c1T2XIM41yJ9sQEigR_X3yO-gc0WK0xqrKSTTFPAZW-xvAdBut5G34aaEXYdwXZv-ey6NYfAvb9oMJ8RhUF0C28tf1r_QvdrMuvXEHndRK_4QXetjdnigWauivZiBHjfqhAxwiTJ9_VPRt6mPkvWnbliHSBuCHRReZnmjf4gK6CixG4u3XjR5J8pLRVf4r2mw9flcF1hQgORx5-TuZPflen39IfqiX9",
    color: "#FF6B35",
  },
  {
    id: "nurturer",
    name: "The Nurturer",
    description:
      "You are a caring and empathetic person who finds joy in helping others. Your natural ability to understand and support people makes you a pillar of strength in your community.",
    traits: ["Empathetic", "Caring", "Supportive", "Intuitive"],
    keywords: [
      "help",
      "care",
      "family",
      "friends",
      "support",
      "listen",
      "empathy",
      "kind",
      "nurture",
      "community",
      "volunteer",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#4ECDC4",
  },
  {
    id: "innovator",
    name: "The Innovator",
    description:
      "You are a creative problem-solver with a passion for technology and innovation. Your analytical mind and forward-thinking approach help you find unique solutions to complex challenges.",
    traits: ["Creative", "Analytical", "Tech-savvy", "Forward-thinking"],
    keywords: [
      "technology",
      "innovation",
      "create",
      "build",
      "solve",
      "code",
      "design",
      "future",
      "ideas",
      "invention",
      "startup",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#6C5CE7",
  },
  {
    id: "leader",
    name: "The Leader",
    description:
      "You are a natural-born leader with strong communication skills and the ability to inspire others. Your confidence and vision help you guide teams toward success.",
    traits: ["Confident", "Charismatic", "Decisive", "Inspiring"],
    keywords: [
      "lead",
      "manage",
      "team",
      "project",
      "organize",
      "motivate",
      "inspire",
      "goal",
      "success",
      "responsibility",
      "decision",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#E17055",
  },
  {
    id: "artist",
    name: "The Artist",
    description:
      "You are a creative soul with a deep appreciation for beauty and self-expression. Your artistic nature and unique perspective bring color and meaning to the world around you.",
    traits: ["Creative", "Expressive", "Intuitive", "Passionate"],
    keywords: [
      "art",
      "creative",
      "paint",
      "music",
      "write",
      "express",
      "beauty",
      "aesthetic",
      "design",
      "imagination",
      "inspire",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#FD79A8",
  },
  {
    id: "scholar",
    name: "The Scholar",
    description:
      "You are an intellectual with an insatiable curiosity for knowledge and learning. Your analytical mind and love for research make you a natural problem-solver and educator.",
    traits: ["Intellectual", "Curious", "Analytical", "Methodical"],
    keywords: [
      "learn",
      "study",
      "research",
      "knowledge",
      "book",
      "education",
      "analyze",
      "think",
      "philosophy",
      "science",
      "academic",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#0984E3",
  },
  {
    id: "connector",
    name: "The Connector",
    description:
      "You are a social butterfly who thrives on building relationships and bringing people together. Your networking skills and genuine interest in others make you a natural community builder.",
    traits: ["Social", "Outgoing", "Networking", "Collaborative"],
    keywords: [
      "social",
      "people",
      "network",
      "connect",
      "party",
      "event",
      "collaborate",
      "communicate",
      "relationship",
      "community",
      "extrovert",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#00B894",
  },
  {
    id: "guardian",
    name: "The Guardian",
    description:
      "You are a reliable and responsible individual who values stability and tradition. Your strong sense of duty and commitment makes you someone others can always count on.",
    traits: ["Reliable", "Responsible", "Traditional", "Loyal"],
    keywords: [
      "reliable",
      "responsible",
      "duty",
      "tradition",
      "stable",
      "loyal",
      "commitment",
      "family",
      "values",
      "security",
      "protect",
    ],
    imageUrl: "/placeholder.svg?height=300&width=400",
    color: "#A29BFE",
  },
]
