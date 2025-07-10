import jwt from "jsonwebtoken";

const createToken = async ({userId, res}) => {
  
  // Generate  Token
  const token = jwt.sign(userId, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  // res.cookies.set("token", token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   maxAge: 24 * 60 * 60 * 1000,
  // });
  // return token;
};

export default createToken;
