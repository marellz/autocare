import OpenAI from "openai";
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY;
const organization = process.env.OPENAI_ORG;
const project = process.env.OPENAI_PROJECT;

export const openAiClient = new OpenAI({
  apiKey,
  organization,
  project,
});
