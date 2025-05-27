import { GoogleGenerativeAI } from "@google/generative-ai";

// 🎯 ELITE PROMPT ENGINEERING - Laser-focused system instructions
const ELITE_SYSTEM_PROMPT = `🎯 ROLE: ParlayProz Virtual Assistant Expert

📋 RESPONSE RULES (CRITICAL):
- MAX 2-3 sentences per response
- NO fluff, NO repetition, NO unnecessary details
- Direct answers ONLY
- Use emojis sparingly (max 1-2 per response)
- If asked for "more info" then provide detailed explanation

🏆 PARLAYPROZ KNOWLEDGE BASE:

💰 PRICING & MEMBERSHIP:
- Subscription: $100 USD/month
- Affiliate Commission: $40 USD/month per referral
- Payment: Cards, USDT (TRC20), Crypto, Bank Transfer (T&T)
- Cancellation: Anytime before next billing cycle
- NO free trial available

🔥 CORE FEATURES:
- Scanner Tool: Analyzes odds vs player/team stats across multiple sportsbooks
- Real-time data updates multiple times daily
- Color-coded confidence levels (Green=High, Yellow=Moderate, Red=Risky)
- Works with ALL major sportsbooks (Bet365, DraftKings, FanDuel, etc.)
- Mobile browser compatible, dedicated app coming soon

📱 ACCESS & SUPPORT:
- Login: www.parlayproz.com
- Support: Live chat, WhatsApp, Email
- Community: Private WhatsApp group
- Training: Video tutorials + live Zoom sessions

🎯 BETTING STRATEGY:
- Focus: High-confidence straight bets or 2-4 leg parlays
- Pre-game analysis only (no live bets currently)
- Data-driven approach, removes emotion from betting
- Bankroll management emphasized

🚀 AFFILIATE PROGRAM:
- Earn $40/month per active referral
- Paid twice monthly via bank transfer or USDT
- Must maintain active membership to earn
- Unique tracking codes provided

⚡ RESPONSE EXAMPLES:
Q: "How much does it cost?"
A: "ParlayProz membership is $100 USD per month with full access to our scanner, WhatsApp community, and affiliate program. No free trial, but we offer live demos."

Q: "What is the scanner?"
A: "Our scanner analyzes odds across multiple sportsbooks and compares them with player/team stats to identify high-value betting opportunities. Updates multiple times daily with color-coded confidence levels."

Q: "How do I sign up?"
A: "Visit www.parlayproz.com to subscribe for $100/month. Pay with cards, USDT, crypto, or bank transfer, then get login credentials via email."

🛡️ IMPORTANT DISCLAIMERS:
- ParlayProz provides analytics, NOT betting tips
- We are NOT a sportsbook, don't accept bets
- Betting involves risk, no guarantees
- Past performance doesn't guarantee future results
- Bet responsibly

🎯 CONVERSATION STYLE:
- Professional but friendly
- Confident in product knowledge
- Always end with helpful next step or question
- If user seems interested, guide toward signup or demo`;

// 🧠 ADVANCED CONVERSATION CONTEXT ANALYZER
function analyzeConversationContext(convHistory) {
  const recentMessages = convHistory.slice(-6); // Last 3 exchanges
  const userInterest = {
    pricing: recentMessages.some(
      (msg) =>
        msg.toLowerCase().includes("cost") ||
        msg.toLowerCase().includes("price") ||
        msg.toLowerCase().includes("$")
    ),
    features: recentMessages.some(
      (msg) =>
        msg.toLowerCase().includes("scanner") ||
        msg.toLowerCase().includes("feature") ||
        msg.toLowerCase().includes("how")
    ),
    signup: recentMessages.some(
      (msg) =>
        msg.toLowerCase().includes("sign") ||
        msg.toLowerCase().includes("join") ||
        msg.toLowerCase().includes("register")
    ),
    affiliate: recentMessages.some(
      (msg) =>
        msg.toLowerCase().includes("affiliate") ||
        msg.toLowerCase().includes("refer") ||
        msg.toLowerCase().includes("earn")
    ),
  };

  return userInterest;
}

// 🎯 DYNAMIC PROMPT ENHANCER
function enhancePromptWithContext(baseQuestion, context, conversationHistory) {
  let enhancedPrompt = baseQuestion;

  // Add context-aware instructions
  if (context.pricing) {
    enhancedPrompt +=
      "\n[CONTEXT: User interested in pricing - be clear about value proposition]";
  }

  if (context.features) {
    enhancedPrompt +=
      "\n[CONTEXT: User exploring features - focus on scanner benefits]";
  }

  if (context.signup) {
    enhancedPrompt +=
      "\n[CONTEXT: User ready to signup - provide clear next steps]";
  }

  if (context.affiliate) {
    enhancedPrompt +=
      "\n[CONTEXT: User interested in earning - highlight affiliate benefits]";
  }

  // If conversation is getting long, remind to be concise
  if (conversationHistory.length > 8) {
    enhancedPrompt +=
      "\n[INSTRUCTION: Keep response under 30 words - user has been chatting a while]";
  }

  return enhancedPrompt;
}

// 🚀 MAIN API HANDLER - ENGINEERED FOR PERFECTION
export async function POST(request) {
  try {
    const { question, convHistory = [] } = await request.json();

    // 🔍 Validate input
    if (!question || question.trim().length === 0) {
      return Response.json(
        { error: "Question cannot be empty" },
        { status: 400 }
      );
    }

    // 🔑 API Key validation with detailed logging
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      console.error(
        "❌ CRITICAL: Google AI API key is missing from environment variables"
      );
      return Response.json(
        { error: "Service temporarily unavailable. Please contact support." },
        { status: 500 }
      );
    }

    // 🤖 Initialize Gemini with fallback strategy
    const genAI = new GoogleGenerativeAI(apiKey);
    let model;

    const modelPriority = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of modelPriority) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        console.log(`✅ Successfully initialized model: ${modelName}`);
        break;
      } catch (error) {
        console.warn(`⚠️ Failed to initialize ${modelName}:`, error.message);
        continue;
      }
    }

    if (!model) {
      console.error("❌ CRITICAL: No Gemini models available");
      return Response.json(
        { error: "AI service unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // 🧠 Analyze conversation context for smarter responses
    const conversationContext = analyzeConversationContext(convHistory);

    // 🎯 Enhance prompt with contextual intelligence
    const enhancedQuestion = enhancePromptWithContext(
      question,
      conversationContext,
      convHistory
    );

    // 📝 Format conversation history intelligently
    const formattedHistory = convHistory
      .slice(-10) // Keep only last 10 messages for efficiency
      .map((msg, index) => `${index % 2 === 0 ? "User" : "Assistant"}: ${msg}`)
      .join("\n");

    // 🚀 Construct the ultimate prompt
    const masterPrompt = `${ELITE_SYSTEM_PROMPT}

📊 CONVERSATION CONTEXT:
${formattedHistory}

🎯 CURRENT USER QUESTION: ${enhancedQuestion}

🤖 ASSISTANT RESPONSE (Remember: MAX 2-3 sentences, be helpful and direct):`;

    // ⚡ Generate response with optimized settings
    console.log("🚀 Generating AI response...");
    const startTime = Date.now();

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: masterPrompt }] }],
      generationConfig: {
        maxOutputTokens: 150, // Limit response length
        temperature: 0.7, // Balanced creativity
        topP: 0.8, // Focused responses
        topK: 40, // Diverse but relevant
      },
    });

    const response = await result.response;
    const aiResponse = response.text().trim();

    const responseTime = Date.now() - startTime;
    console.log(`✅ Response generated in ${responseTime}ms`);

    // 🛡️ Response validation and cleanup
    if (!aiResponse || aiResponse.length === 0) {
      return Response.json(
        {
          response:
            "I'm here to help with ParlayProz questions! What would you like to know about our platform?",
        },
        { status: 200 }
      );
    }

    // 📊 Log successful interaction for analytics
    console.log(
      `📊 Successful interaction - Question length: ${question.length}, Response length: ${aiResponse.length}`
    );

    return Response.json({
      response: aiResponse,
      metadata: {
        responseTime: responseTime,
        model: model.model || "gemini",
        contextDetected: Object.keys(conversationContext).filter(
          (key) => conversationContext[key]
        ),
      },
    });
  } catch (error) {
    // 🚨 Advanced error handling with categorization
    console.error("❌ API Error Details:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Categorize error types for better user experience
    let userMessage =
      "I'm experiencing technical difficulties. Please try again in a moment.";
    let statusCode = 500;

    if (error.message.includes("API key")) {
      userMessage = "Service configuration issue. Please contact support.";
      statusCode = 503;
    } else if (
      error.message.includes("quota") ||
      error.message.includes("rate limit")
    ) {
      userMessage = "High demand right now. Please try again in a few seconds.";
      statusCode = 429;
    } else if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      userMessage =
        "Connection issue. Please check your internet and try again.";
      statusCode = 502;
    }

    return Response.json(
      {
        error: userMessage,
        fallback:
          "For immediate assistance, contact us via WhatsApp or email support.",
      },
      { status: statusCode }
    );
  }
}
