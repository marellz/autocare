import { SendMailOptions } from "nodemailer";
import transporter from "../../config/mail";

// Extend the default type
interface TemplatedMailOptions extends SendMailOptions {
  template: string;
  context?: Record<string, any>;
}

export const sendMail = async ({
  to,
  template,
  subject,
  text,
  context = {},
}: TemplatedMailOptions) => {
  const options: TemplatedMailOptions = {
    from: '"Autocare" <no-reply@autocare.com>',
    to,
    template: `${template}.template`,
    text,
    subject,
    context,
  };

  console.log({options})
  const response = await transporter.sendMail(options);

  console.log(response);
};
