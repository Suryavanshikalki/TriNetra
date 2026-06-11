// ==========================================
// TRINETRA BACKEND - Shared API Response Helpers
// Consistent response formatting across all controllers
// ==========================================

/**
 * Send a success response.
 * @param {object} res - Express response object
 * @param {object} data - Response payload
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, ...data });
};

/**
 * Send an error response.
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
export const sendError = (res, message = 'Internal Server Error', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

/**
 * Find a user by ID and return 404 if not found.
 * Returns the user document or null (after sending response).
 * @param {object} User - Mongoose User model
 * @param {string} userId - The user's ID
 * @param {object} res - Express response object
 * @returns {object|null} User document or null if not found
 */
export const findUserOrFail = async (User, userId, res) => {
  const user = await User.findById(userId);
  if (!user) {
    sendError(res, 'User not found.', 404);
    return null;
  }
  return user;
};

/**
 * Find a user by trinetraId and return 404 if not found.
 * @param {object} User - Mongoose User model
 * @param {string} trinetraId - The user's TriNetra ID
 * @param {object} res - Express response object
 * @returns {object|null} User document or null if not found
 */
export const findUserByTriNetraIdOrFail = async (User, trinetraId, res) => {
  const user = await User.findOne({ trinetraId });
  if (!user) {
    sendError(res, 'User not found.', 404);
    return null;
  }
  return user;
};
