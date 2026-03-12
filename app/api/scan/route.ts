import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image, mediaType } = await req.json();

    if (!image || !mediaType) {
      return NextResponse.json({ error: "이미지 데이터가 필요해요." }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: image,
              },
            },
            {
              type: "text",
              text: `이 이미지에서 텍스트를 추출해주세요. 다음 규칙을 따라주세요:
1. 한국어 띄어쓰기를 올바르게 보정해주세요.
2. 문장 단위로 분리해주세요. (마침표, 물음표, 느낌표 기준)
3. 각 문장을 JSON 배열로 반환해주세요.
4. 페이지 번호, 머리글, 바닥글 등 본문이 아닌 요소는 제외해주세요.
5. 반드시 JSON 배열만 반환하고, 다른 텍스트는 포함하지 마세요.
6. 문장이 아닌 제목이나 챕터명도 포함해주세요.

예시 형식: ["첫 번째 문장입니다.", "두 번째 문장입니다."]`,
            },
          ],
        },
      ],
    });

    const text = response.content
      .map((item) => (item.type === "text" ? item.text : ""))
      .filter(Boolean)
      .join("");

    const cleanText = text.replace(/```json|```/g, "").trim();
    const sentences = JSON.parse(cleanText);

    if (!Array.isArray(sentences) || sentences.length === 0) {
      return NextResponse.json(
        { error: "텍스트를 인식하지 못했어요. 다시 촬영해주세요." },
        { status: 422 }
      );
    }

    return NextResponse.json({ sentences });
  } catch (err) {
    console.error("Scan API error:", err);
    return NextResponse.json(
      { error: "텍스트를 인식하지 못했어요. 다시 촬영해주세요." },
      { status: 500 }
    );
  }
}
