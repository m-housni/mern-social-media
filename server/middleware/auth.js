// Description: This file contains the middleware for authentication

// jsonwebtoken is a library that allows us to create and verify tokens
import jwt from "jsonwebtoken";

// verifyToken is a function that helps us to verify the token of the user
export const verifyToken = async (req, res, next) => {
  try {
    // req.header() is a function that helps us to get the value of a header from the request
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // token.startsWith() is a function that helps us to check if the token starts with a specific string
    if (token.startsWith("Bearer ")) {
      // token.slice() is a function that helps us to get a part of the token
      // trimLeft() is a function that helps us to remove the spaces from the left side of the token
      token = token.slice(7, token.length).trimLeft();
    }

    // jwt.verify() is a function that helps us to verify the token of the user and get the user id from it
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // req.user is a variable that contains the user id
    req.user = verified;

    // next() is a function that helps us to move to the next middleware
    next();
  } catch (err) {
    // res.status() is a function that helps us to set the status of the response
    res.status(500).json({ error: err.message });
  }
};
