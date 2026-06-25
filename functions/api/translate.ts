export async function onRequestPost(context: PagesFunctionRequest) {
  try {
    const { text, sourceLang, targetLang } = await context.request.json();

    if (!text || !sourceLang || !targetLang) {
      return new Response(JSON.stringify({ error: 'Missing text, sourceLang, or targetLang' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // OpenAI API 호출 (gpt-4o 사용)
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
            content: `You are an elite culinary expert and a native-level translator specializing in food culture.
            Your mission is to translate food descriptions from ${sourceLang} to ${targetLang} with extreme precision and sensory richness.

            STRICT GUIDELINES:
            1. SENSORY DETAIL: Do not just translate words. Capture the texture (crunchy, silky, tender), aroma (fragrant, smoky), and complex flavor profiles (savory, umami, tangy) in the target language.
            2. CULINARY AUTHENTICITY: Use authentic culinary terminology that a local food critic or chef would use. Avoid "dictionary-style" translations.
            3. CULTURAL NUANCE: Adapt the tone to suit local food culture. (e.g., if translating to Japanese, use appropriate polite or appetizing descriptors).
            4. OUTPUT FORMAT: Return ONLY the final translated text. 
            5. NO EXTRA TEXT: Absolutely no original text, no "Here is the translation:", no explanations, and no commentary.

            EXAMPLES:
            User: "Crispy, golden-brown fried chicken with a spicy kick" (Source: English, Target: Japanese)
            Assistant: "外はカリッと、中はジューシーで、ピリ辛な味わいの黄金色フライドチキン"

            User: "Velvety smooth chocolate mousse with a hint of sea salt" (Source: English, Target: French)
            Assistant: "Mousse au chocolat d'une texture veloutée, relevée d'une pointe de fleur de sel"`,
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
