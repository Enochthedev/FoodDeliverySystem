import jwt from "jsonwebtoken";

const authmiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "User not Authorize Please Login Again!",
    });
  }
  try {
    const decodejwt = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userid = decodejwt.id;
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Error!" });
  }
};

export default authmiddleware;
