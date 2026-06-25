export async function onRequestPost(context: PagesFunctionRequest) {
  try {
    const { text, targetLang } = await context.request.json();

    if (!text || !targetLang) {
      return new Response(JSON.stringify({ error: 'Missing text or targetLang' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // 또는 'gpt-4'
        messages: [
          {
            role: 'system',
            content: `You are a professional food translator. 
            Your task is to translate the provided food description into the target language.

            RULES:
            - Output ONLY the translated text.
            - NEVER include the original text.
            - NEVER include any explanations, intros, or remarks.
            - Use natural, appetizing, and culturally authentic phrasing.

            EXAMPLES:
            User: "Delicious spicy kimchi stew" (Target: Japanese)
            Assistant: "美味しい辛口のキムチチゲ"

            User: "Sweet and creamy vanilla ice cream" (Target: French)
            Assistant: "Glace à la vanille douce et crémeuse"

            User: "Pasta with tomato sauce" (Target: English)
            Assistant: "Pasta with tomato sauce"`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return new Response(JSON.stringify({ error: 'OpenAI API request failed' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ translatedText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Server Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
