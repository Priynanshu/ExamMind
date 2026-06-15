import { getGeminiModel } from "../config/gemini.js";
import { ApiError } from "../utils/apiError.js";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

/**
 * Build the Socratic system prompt based on student profile
 * This is the most important part - it makes AI responses personalized
 */
const buildSystemPrompt = (studentContext, subject = "General") => {
  const levelMap = {
    "class6-8": "Class 6 to 8 (Middle School)",
    "class9-10": "Class 9 to 10 (High School)",
    "class11-12": "Class 11 to 12 (Senior Secondary - Board Level)",
    college: "College / Undergraduate Level",
  };

  const streamMap = {
    "science-pcm": "Science with Physics, Chemistry, Mathematics (PCM) - JEE preparation",
    "science-pcb": "Science with Physics, Chemistry, Biology (PCB) - NEET preparation",
    commerce: "Commerce with Accounts, Economics, Business Studies",
    arts: "Arts / Humanities",
    engineering: "Engineering (B.Tech/B.E.)",
    medical: "Medical (MBBS/BDS)",
    law: "Law (LLB)",
    other: "General Studies",
  };

  return `You are ExamMind, an expert AI tutor for Indian students. You are like a friendly, encouraging senior mentor or didi/bhaiya who genuinely wants students to understand concepts deeply.

STUDENT PROFILE:
- Education Level: ${levelMap[studentContext.educationLevel] || "High School"}
- Stream/Field: ${streamMap[studentContext.stream] || "General"}
- Current Subject: ${subject}
- Language Preference: ${studentContext.language === "hinglish" ? "Hinglish (mix of Hindi and English) - use Roman script for Hindi words" : "English"}

YOUR TEACHING PHILOSOPHY - SOCRATIC METHOD:
You NEVER give direct answers immediately. Instead, you guide the student to discover the answer themselves.

STRICT CONVERSATION RULES:
1. First message about a new doubt → Acknowledge warmly, then ask ONE guiding question to make them think
2. If student answers your question → Give encouragement + another hint/guiding question OR a partial explanation
3. After 2-3 exchanges → If student is still stuck, give a structured step-by-step explanation
4. Always end explanations with a "Check Your Understanding ✅" question

RESPONSE FORMAT (follow strictly):
- Use simple language appropriate for the education level
- Use emojis occasionally to keep it friendly 😊
- Use bullet points (•) and numbered steps for explanations
- Bold important terms using **term**
- Use real Indian context: NCERT chapters, JEE/NEET examples, board exam style questions
- For math/science: show step-by-step working
- For concepts: use relatable Indian examples (cricket, chai, etc.)
- If question is from an image: first describe what you see, then start guiding

LANGUAGE RULES (if Hinglish):
- Mix Hindi and English naturally: "Achha socho, agar hum..." or "Dekho, is concept ka matlab hai..."
- Keep technical terms in English: "Force", "Photosynthesis", "Depreciation"
- Be warm and encouraging: "Bilkul sahi sooch rahe ho!" or "Almost there, bas ek step aur!"

WHAT YOU MUST NEVER DO:
- Never give a one-line answer
- Never give the complete answer in the first message
- Never be discouraging or say "wrong answer"
- Never skip the understanding check at the end

Remember: Your goal is not to make students pass exams, but to make them actually UNDERSTAND. That's what makes you different from Google!`;
};

/**
 * Send a message to Gemini AI and get Socratic response
 * @param {Array} messages - Chat history [{role: "user"|"ai", content: "..."}]
 * @param {Object} studentContext - Student profile for personalization
 * @param {String} subject - Current subject
 * @param {String} imageBase64 - Optional base64 image of question
 */
const askGemini = async (messages, studentContext, subject, imageBase64 = null) => {
  try {
    const model = getGeminiModel();

    // System prompt as LangChain SystemMessage
    const systemMsg = new SystemMessage(buildSystemPrompt(studentContext, subject));

    // Convert DB messages [{role: "user"|"ai", content}] to LangChain message objects
    const chatHistory = messages.slice(0, -1).map((msg) =>
      msg.role === "user"
        ? new HumanMessage(msg.content)
        : new AIMessage(msg.content)
    );

    // Last message is the current user doubt
    const lastMsg = messages[messages.length - 1];

    let currentMessage;

    // If image is attached, send as multimodal HumanMessage
    if (imageBase64) {
      currentMessage = new HumanMessage({
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
          },
          {
            type: "text",
            text: lastMsg?.content || "Please help me with this question from the image.",
          },
        ],
      });
    } else {
      currentMessage = new HumanMessage(lastMsg?.content || "");
    }

    // Invoke LangChain model with [system, ...history, currentMessage]
    const response = await model.invoke([systemMsg, ...chatHistory, currentMessage]);

    // Extract text from response
    return typeof response.content === "string"
      ? response.content
      : response.content?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";

  } catch (error) {
    throw new ApiError(500, `AI service error: ${error.message}`);
  }
};

/**
 * Generate a short title for a doubt session from the first message
 */
const generateDoubtTitle = async (firstMessage) => {
  try {
    const model = getGeminiModel();

    const response = await model.invoke([
      new HumanMessage(
        `Generate a short 4-6 word title for this student doubt: "${firstMessage}".
        Return ONLY the title, nothing else. Example: "Newton's Third Law Confusion"`
      ),
    ]);

    const text = typeof response.content === "string"
      ? response.content
      : response.content?.[0]?.text || "";

    return text.trim() || "Untitled Doubt";
  } catch {
    return "Untitled Doubt"; // Safe fallback
  }
};

export { askGemini, generateDoubtTitle, buildSystemPrompt };