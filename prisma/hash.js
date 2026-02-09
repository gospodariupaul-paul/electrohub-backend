const bcrypt = require("bcryptjs");

bcrypt.hash("290372", 10).then(hash => {
  console.log("HASH GENERAT:", hash);
});
