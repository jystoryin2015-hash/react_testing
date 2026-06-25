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
            content: `You are a professional food translator and culinary expert. 
            Your goal is to translate the provided food description into ${targetLang}. 

            CRITICAL INSTRUCTIONS:
            1. Return ONLY the translated text. Do not include the original text, explanations, or any other commentary.
            2. Capture local expressions and nuances: Do not provide a literal, word-for-word translation.
            3. Cultural Context: Use terms and phrasing that a native speaker of ${targetLang} would naturally use when describing food.
            4. Appetite Appeal: Ensure the tone remains appetizing and evokes the sensory experience of the food.
            5. Local Authenticity: If there are specific cultural ways to describe this food in ${targetLang}, use them.`,
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
