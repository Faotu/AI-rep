import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi, ChatCompletionRequestMessage } from "openai";
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not resistered or Token broken" });
    // grab chats from the user for contextual
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as ChatCompletionRequestMessage[];
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });
    // send all chats with new one to api
    const config = configureOpenAI();
    const openai = new OpenAIApi(config);
    //   Get latest response
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chats,
    });
    user.chats.push(chatResponse.data.choices[0].message);
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not resistered or Token broken");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Token didn't match");
    }

    return res.status(200).json({ message: "Ok", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not resistered or Token broken");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Token didn't match");
    }
    // @ts-ignore
    user.chats = [];
    await user.save();

    return res.status(200).json({ message: "Ok" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "Error", cause: error.message });
  }
};
