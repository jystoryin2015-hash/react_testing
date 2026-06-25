export async function onRequestPost(context: PagesFunctionRequest) {
  try {
    const { text, sourceLang, targetLang } = await context.request.json();

    if (!text || !sourceLang || !targetLang) {
      return new Response(JSON.stringify({ error: 'Missing text, sourceLang, or targetLang' }), {
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Role:
Expert translator for restaurant menus.

Task:
Translate food descriptions from ${sourceLang} into ${targetLang}.

Rules:
1. Target Audience: Translate for native speakers of ${targetLang}, not for language learners.
2. Natural Phrasing: Rewrite naturally rather than translating literally.
3. Menu Style: Use wording and phrasing commonly found on professional restaurant menus in ${targetLang}.
4. Content Integrity: Preserve dish names, key ingredients, and core selling points.
5. Tone: Maintain a premium, appetizing, and professional restaurant tone.
6. Output Format: Output ONLY the translated text. Do not include the original text, explanations, or any commentary.`,
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
