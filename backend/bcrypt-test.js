import bcrypt from "bcryptjs";

const hash = "$2b$10$ZSUmaQaoQbVDKw/tTVnu0.CiYlytItbL4/Pz4JJtwjmNz.w22wVTO"; // from MongoDB
const plain = "123456"; // your login password

bcrypt.compare(plain, hash).then(result => console.log("Match:", result));
