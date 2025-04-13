/**
 * Check if date format is valid
 * @param {String} dateString 2024-12-20
 * @returns {Boolean}
 * @author Ousmane
 * @since 2025-01-12
 */
function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  return true;
}

/**
 * Check if email format is valid
 * @param {String} email monemail@domaine.com
 * @returns {Boolean}
 * @author Ousmane
 * @since 2025-01-12
 */
const isValidEmail = (email) => {
  const emailRegexValidation = /^\S+@\S+\.\S+$/;
  if (!emailRegexValidation.test(email)) {
    return false;
  }
  return true;
};

/**
 * Check if password format is valid according to one of rgpd rules
 * @param {String} password Mypassword123?
 * @returns {Boolean}
 * @author Ousmane
 * @since 2025-01-12
 * @see addUser
 */
const isValidPassword = (password) => {

  // At least 12 characters one uppercase letter, one lowercase letter, one number and one special character
  const passwordRegexValidationTwelve =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

  // At least 14 characters with one uppercase letter, one lowercase letter and one number
  const passwordRegexValidationFourteen =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{14,}$/;


  // At least 7 words with one space between them
  const passwordRegexValidationSeven = /^(?:\S+\s+){6,}\S+$/;

  if (!passwordRegexValidationTwelve.test(password) && !passwordRegexValidationFourteen.test(password) && !passwordRegexValidationSeven.test(password)) {
    return false;
  }
  return true;
};

module.exports = { isValidDateFormat, isValidEmail, isValidPassword };
