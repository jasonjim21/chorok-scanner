import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { image, mediaType } = await req.json();

    if (!image || !mediaType) {
      return NextResponse.json({ error: "이미지 데이터가 필요해요." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generationConfig: {
        responseMimeType: "application/json",
      } as any,
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mediaType,
          data: image,
        },
      },
      `이미지의 본문 텍스트를 추출하세요. 띄어쓰기를 보정하고 문장 단위로 분리해서 JSON 배열로만 반환하세요.`,
    ]);

    const rawText = result.response.text();

    let sentences: string[] | null = null;
    try {
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sentences = parsed;
      }
    } catch {
      const match = rawText.replace(/```json\s*/g, "").replace(/```/g, "").trim().match(/\[[\s\S]*\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) sentences = parsed;
        } catch { /* ignore */ }
      }
    }

    if (!sentences) {
      console.error("JSON 파싱 실패. 원문:", rawText);
      return NextResponse.json(
        { error: "텍스트를 인식하지 못했어요. 다시 촬영해주세요." },
        { status: 422 }
      );
    }

    return NextResponse.json({ sentences });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Scan API error:", message);
    return NextResponse.json(
      { error: "텍스트를 인식하지 못했어요. 다시 촬영해주세요.", detail: message },
      { status: 500 }
    );
  }
}
