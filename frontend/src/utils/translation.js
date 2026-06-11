// ==========================================
// TRINETRA FRONTEND - Shared Translation Utility
// AI-powered translation via AWS GraphQL (Point 12)
// ==========================================
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

/**
 * Translate text to a target language using the TriNetra AI engine.
 *
 * @param {string} text - The text to translate
 * @param {string} targetLang - The target language code (e.g., 'hi', 'es')
 * @returns {Promise<string|null>} The translated text, or null on failure
 */
export const translateText = async (text, targetLang) => {
  if (!text || !targetLang || targetLang === 'en') return text;

  try {
    const res = await client.graphql({
      query: `mutation Translate($text: String!, $targetLang: String!) {
        translateText(text: $text, targetLang: $targetLang) { translatedText }
      }`,
      variables: { text, targetLang }
    });
    return res.data.translateText.translatedText;
  } catch (err) {
    console.error('Translation failed:', err);
    return null;
  }
};
