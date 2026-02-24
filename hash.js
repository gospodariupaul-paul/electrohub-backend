import bcrypt from "bcryptjs";

const run = async () => {
  const hash = await bcrypt.hash("290372", 10);
  console.log(hash);
};

run();
