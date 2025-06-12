import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const accountSid = process.env["TWILIO_SID"];
const authToken = process.env["TWILIO_AUTH_TOKEN"];
// const twillioWhatsappNumber = process.env["TWILIO_WHATSAPP_NUMBER"];

export const client = twilio(accountSid, authToken);

export const sendWhatsapp = async ({
  to,
  body,
}: {
  to: string;
  body: string;
}) => {
  if (!to.includes("whatsapp:+")) to = `whatsapp:+${to}`;

  console.log(`Message sent to ${to},"${body}"`);
  /*
  todo: disable in development, enable in prod

  const from = `whatsapp:${twillioWhatsappNumber}`;
  client.messages
    .create({
      from,
      to,
      body,
    })
    .then((message) => console.log(`Message sent!`, message.sid))
    .catch((err) => console.error(`Error sending: ${err}`));

    */
};
