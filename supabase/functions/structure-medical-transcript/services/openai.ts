
import { getSystemPrompt } from "../utils/template.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

/**
 * Calls OpenAI API to structure medical text
 */
export async function structureWithOpenAI(text: string, role: string, template?: { sections: string[] }): Promise<any> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  
  const systemPrompt = getSystemPrompt(role, template);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("OpenAI API error:", errorData);
    throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  console.log("Received response from OpenAI");
  
  return data.choices[0].message.content;
}
