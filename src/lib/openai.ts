const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export interface AINote {
  heading: string;
  body: string;
  code?: string;
  tip?: string;
  keyPoints?: string[];
}

export interface AIQuiz {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface AIModuleContent {
  notes: AINote[];
  quiz: AIQuiz[];
}

const chat = async (prompt: string): Promise<string> => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
};

export const generateModuleContent = async (moduleTitle: string, courseTitle: string): Promise<AIModuleContent> => {
  const prompt = `You are an expert programming instructor. Generate detailed study notes and a quiz for a module titled "${moduleTitle}" from the course "${courseTitle}".

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "notes": [
    {
      "heading": "1. Section Title",
      "body": "3-5 sentences of detailed explanation with real-world context",
      "code": "// relevant code example with comments\\nconst example = 'value';",
      "tip": "A practical tip or common mistake to avoid",
      "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"]
    }
  ],
  "quiz": [
    {
      "q": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Requirements:
- Generate exactly 5 detailed note sections covering the module topic in depth
- Each section should have: heading, body (3-5 sentences), code example (relevant JS/Python/HTML/CSS code with comments), tip, and 4 keyPoints
- Generate exactly 4 quiz questions testing understanding of the module
- Code examples should be practical and well-commented
- Content should be beginner-friendly but thorough
- Focus specifically on "${moduleTitle}" — not generic content`;

  const raw = await chat(prompt);

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned) as AIModuleContent;
};

export interface WeeklyQuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export const generateWeeklyQuiz = async (topic: string, count = 5): Promise<WeeklyQuizQuestion[]> => {
  // Add timestamp and random element to ensure variety
  const timestamp = Date.now();
  const randomSeed = Math.floor(Math.random() * 1000);
  
  const prompt = `Generate ${count} UNIQUE multiple-choice quiz questions about "${topic}" for a software learning platform.

IMPORTANT: Generate DIFFERENT questions each time. Vary the difficulty, focus areas, and question types.
Random seed: ${randomSeed} | Timestamp: ${timestamp}

Return ONLY valid JSON array (no markdown):
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_index": 0,
    "explanation": "Why this answer is correct"
  }
]

Requirements:
- Questions MUST be different from typical/common questions on this topic
- Test practical understanding, not just definitions
- Mix easy (30%), medium (50%), and hard (20%) questions
- Cover different aspects of the topic (syntax, concepts, best practices, real-world usage)
- Options should be plausible (no obviously wrong answers)
- Explanations should be educational and concise
- Avoid repetitive question patterns`;

  const raw = await chat(prompt);
  const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned);
};

export const askAIAssistant = async (
  question: string,
  history: { role: string; content: string }[]
): Promise<string> => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert programming tutor for AI LearnBoard, an online learning platform. 
Help students understand programming concepts clearly and concisely. 
Focus on: HTML, CSS, JavaScript, React, Node.js, Python, DSA, and general software development.
Keep responses clear, practical, and encouraging. Use code examples when helpful.
Format code with proper indentation. Keep responses under 200 words unless a detailed explanation is needed.`,
        },
        ...history,
        { role: "user", content: question },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
};
