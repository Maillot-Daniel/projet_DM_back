import bcrypt from "bcrypt";

// le salt permet d'avoir toujours un resultat
// different pour un meme mot de passe
// plus le nbr de tours est elevé, plus l'operation est longue
const saltRounds = 10;

export const hashPass = async (pass) => {
  let error = null;
  let hashed = null;

  try {
    hashed = await bcrypt.hash(pass, saltRounds);
  } catch (e) {
    error = e.message;
  } finally {
    return { error, hashed };
  }
};

export const compareHash = async (passNotHashed, passHashed) => {
  let isSame = false;

  try {
    isSame = await bcrypt.compare(passNotHashed, passHashed);
  } catch (e) {
    console.error(e.message);
  } finally {
    return isSame;
  }
};
