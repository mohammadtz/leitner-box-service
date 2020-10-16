import { compare, genSalt, hash } from "bcryptjs";
import { Router } from "express";
import { sign } from "jsonwebtoken";
import User from "../models/User";
import { loginValidation, registerValidation } from "../validation";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  registerValidation(req, res);

  // check email, username and mobile not in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).send({ message: "Email already exists" });

  const userExist = await User.findOne({ user_name: req.body.user_name });
  if (userExist)
    return res.status(400).send({ message: "User already exists" });
  if (req.body.mobile) {
    const mobileExist = await User.findOne({ mobile: req.body.mobile });
    if (mobileExist)
      return res.status(400).send({ message: "Mobile already exists" });
  }

  // Hash password
  const slat = await genSalt(10);
  const hashedPassword = await hash(req.body.password, slat);

  const user = new User({
    user_name: req.body.user_name,
    email: req.body.email,
    password: hashedPassword,
    mobile: req.body.mobile,
  });

  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
    throw error;
  }
});

authRouter.post("/login", async (req, res) => {
  loginValidation(req, res);

  // check email, username and mobile not in the database
  const user =
    (await User.findOne({ user_name: req.body.user_name })) ||
    (await User.findOne({ email: req.body.user_name }));

  if (!user)
    return res.status(400).send({ message: "username or email not found" });

  const validPass = await compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send({ message: "Invalid Password" });

  // create and assign token
  const token = sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send({
    token,
    user: { _id: user._id, user_name: user.user_name, email: user.email },
  });
});
