// ==========================================
// TRINETRA FRONTEND - Shared Escalation Utility
// Auto-Escalation trigger via AWS GraphQL
// ==========================================
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

/**
 * Trigger the TriNetra Justice Engine escalation for a post/reel.
 *
 * @param {string} postId - The ID of the post or reel to escalate
 * @param {string} userId - The current user's trinetraId
 * @param {function} t - i18n translation function
 * @returns {Promise<boolean>} Whether the escalation was triggered
 */
export const triggerEscalation = async (postId, userId, t) => {
  const confirmed = window.confirm(
    t('Escalate this issue to the Chain of Command (Local -> MLA -> CM -> Supreme Court)?')
  );
  if (!confirmed) return false;

  try {
    await client.graphql({
      query: `mutation TriggerEscalation($postId: ID!, $userId: ID!) {
        triggerTriNetraEscalation(postId: $postId, userId: $userId) { status level }
      }`,
      variables: { postId, userId }
    });
    alert(t('Escalation Active. Case tracked by TriNetra Justice Engine.'));
    return true;
  } catch (err) {
    console.error('Escalation failed:', err);
    alert(t('Escalation server connection failed.'));
    return false;
  }
};
