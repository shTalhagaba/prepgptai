import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    // ✅ Safely parse body
    const body = await request.json();

    const { type, role, level, techstack, amount, userid } = body;

    // ✅ Validate required fields
    if (!type || !role || !level || !techstack || !amount) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("VAPI BODY:", body);

    // ✅ Generate questions
    const { text } = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: `
Prepare interview questions.

Role: ${role}
Level: ${level}
Tech stack: ${techstack}
Focus: ${type}
Number of questions: ${amount}

Return ONLY valid JSON array like:
["Question 1", "Question 2"]
No markdown. No explanation.
`
    });
    console.log("RAW AI RESPONSE ↓↓↓");
    console.log(text);
    console.log("RAW AI RESPONSE ↑↑↑");
    let questions: string[] = [];

    try {
      questions = JSON.parse(text);
    } catch (err) {
      console.error("JSON PARSE FAILED:", text);
      return Response.json(
        { success: false, error: "Invalid AI response format" },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions,
      userId: userid ?? null,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString()
    };

    await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, questionsCount: questions.length },
      { status: 200 }
    );

  } catch (error) {
    console.error("API CRASH:", error);
    return Response.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "API is alive" });
}
