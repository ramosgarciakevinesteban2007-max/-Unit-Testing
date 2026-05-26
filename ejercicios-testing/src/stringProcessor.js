// Oculta parte del usuario del email
function maskEmail(email) {

  if (!email.includes('@')) {
    throw new Error('Email inválido');
  }

  const parts = email.split('@');

  const user = parts[0];
  const domain = parts[1];

  if (user.length === 1) {
    return email;
  }

  const masked =
    user[0] +
    '*'.repeat(user.length - 2) +
    user[user.length - 1];

  return masked + '@' + domain;
}


// Invierte el orden de las palabras
function reverseWords(sentence) {

  if (sentence.trim() === '') {
    return '';
  }

  return sentence
    .trim()
    .split(/\s+/)
    .reverse()
    .join(' ');
}


// Extrae hashtags del texto
function extractHashtags(text) {

  const hashtags = text.match(/#\w+/g);

  if (hashtags === null) {
    return [];
  }

  return hashtags;
}

module.exports = {
  maskEmail,
  reverseWords,
  extractHashtags
};