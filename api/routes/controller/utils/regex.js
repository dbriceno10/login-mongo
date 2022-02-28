const emailValidation = (email) => {
  const regex = new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  );
  return regex.test(email);
};

module.exports = {
  emailValidation,
};
