import bcrypt from "bcrypt";

const parola = "PAROLA_TA_NOUA"; // pune aici parola ta reală

async function generateHash() {
  const hash = await bcrypt.hash(parola, 10);
  console.log("Hash-ul generat este:");
  console.log(hash);
}

generateHash();
