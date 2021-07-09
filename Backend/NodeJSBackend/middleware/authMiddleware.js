const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.get("Authentication");
  console.log(authHeader);
  if (!authHeader) {
    res.status(401);
    throw new Error("Not authenticated");
  }
  const token = req.get("Authentication").split(" ")[1];
  const secretString = process.env.SECRET;
  console.log(secretString);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, secretString);
  } catch (error) {
    throw new Error(error);
  }
  if (!decodedToken) {
    res.status(401);
    throw new Error("Not authenticated");
  }
  next();
};
