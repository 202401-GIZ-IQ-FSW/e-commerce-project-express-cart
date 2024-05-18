const passwordValidation = function (password) {
  // Regex to test for at least one uppercase letter, one lowercase letter, one special character, and a minimum length of 8 characters
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/.test(password);
};

module.exports = { passwordValidation };
