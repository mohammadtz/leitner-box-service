import * as Joi from "@hapi/joi";
import { Request, Response } from "express";

//valdation
export const registerValidation = (req: Request, res: Response) => {
  const userSchema = Joi.object({
    user_name: Joi.string().required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    mobile: Joi.string().optional().min(9).max(13),
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    throw res.status(400).send({ message: error.details[0].message });
  }
};

export const loginValidation = (req: Request, res: Response) => {
  const userSchema = Joi.object({
    user_name: Joi.string().optional(),
    email: Joi.string().min(6).optional().email(),
    password: Joi.string().min(6).required(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    throw res.status(400).send({ message: error.details[0].message });
  }
};

export const cardValidation = (req: Request, res: Response) => {
  const cardSchema = Joi.object({
    front: Joi.string().max(255).required(),
    back: Joi.string().max(255).required(),
  });
  const { error } = cardSchema.validate(req.body);
  if (error) {
    throw res.status(400).send({ message: error.details[0].message });
  }
};
