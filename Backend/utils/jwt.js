import { sign } from "jsonwebtoken";

const jwtToken = (userID, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    secure: isProduction,
  });

  return token;
};

export default jwtToken;