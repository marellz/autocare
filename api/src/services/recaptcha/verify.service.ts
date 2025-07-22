import ky from "ky";
import dotenv from "dotenv";
dotenv.config();
const verifyToken = async (token: string) => {
  const secret = process.env.CF_TURNSTILE_SECRET_KEY;
  try {
    const response = await ky.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        json: {
          secret,
          response: token,
        },
      },
    );

    if (!response.ok) throw new Error("HTTP error: " + response.statusText);

    const { success, errorCodes } = await response.json<{
      success: boolean;
      errorCodes: string[];
    }>();

    if (!success) {
      throw new Error(
        "Recaptcha verification failed. " + errorCodes.join(", "),
      );
    }

    return { success, message: null };
  } catch (error) {
    console.log("Error verifying token:", error);
    return {
      success: false,
      message: error as string,
    };
  }
};

export default verifyToken;
