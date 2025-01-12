/**
 * Check if body contains all fields
 * @param {Object} body {firstname:"john", lastname:"doe"}
 * @param {Array} keys ["firstname", "lastname"]
 * @returns {Boolean}
 * @author Ousmane
 * @since 2025-01-12
 */
function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (!body[field] || body[field] === "") {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };
