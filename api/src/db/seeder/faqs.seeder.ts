import { type NewFAQ } from "../models/faq.model";
import { FAQModel } from "../sequelize";
export default async () => {
  console.log("Seeding FAQs");
  const faqs: NewFAQ[] = [
    {
      title: "Do I have to install anything?",
      content: "Nope. You can use it straight from WhatsApp or your browser. No app install required.",
    },
    {
      title: "Who can see my request?",
      content: "Only verified vendors we trust — handpicked and rated frequently.",
    },
    {
      title: "Who can see my request?",
      content: "Only verified vendors we trust — handpicked and rated frequently.",
    },
    {
      title: "Is this free to use?",
      content: "For clients, yes. We charge vendors a small fee for the platform. You get it free.",
    },
    {
      title: "What if I don’t get a response?",
      content: "If no vendors reply in 10 minutes, we’ll ping a second batch. You can also resend manually.",
    },
    {
      title: "Can I use both WhatsApp and the Web?",
      content: "Absolutely. The system works seamlessly across both platforms.",
    },
  ];

  await FAQModel.bulkCreate(faqs);
};
