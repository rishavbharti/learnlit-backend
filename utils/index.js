import bcrypt from 'bcrypt';

const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    return null;
  }
};
const comparePassword = function (hashedPassword, password) {
  return bcrypt.compare(hashedPassword, password);
};

const createSlug = (title) => title.toLowerCase().trim().replace(/ /g, '-');

const snakeCaseToTitle = (word) =>
  word.replaceAll('-', ' ').replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

export { hashPassword, comparePassword, createSlug, snakeCaseToTitle };
