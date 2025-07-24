import TypTitle from "@/components/custom/typography/Title"
import clsx from "clsx"

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      className:"",
      action: 'You Send a Message:',
      text: 'Just say what you need — via WhatsApp, SMS, or our web app.',
    },
    {
      step: 2,
      className:"",
      action: 'We Decode It with AI:',
      text: 'We parse the message to understand your request and match it to vendors.',
    },
    {
      step: 3,
      className:"",
      action: 'Trusted Vendors Are Notified:',
      text: 'Only verified vendors with matching stock are contacted.',
    },
    {
      step: 4,
      className: "lg:row-start-2 lg:col-start-3",
      action: 'They Respond with Quotes:',
      text: 'Price, condition, availability — all returned back to you.',
    },
    {
      step: 5,
      className:"lg:row-start-2 lg:col-start-2",
      action: 'You Pick & Proceed:',
      text: 'Choose your vendor, follow up directly or through us. All logged.',
    },
  ]

  return (
    <div className=" px-2 py-5 md:px-5 lg:p-10 lg:pl-20 space-y-4 md:space-y-8">
      <TypTitle>How it works</TypTitle>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, i) => (
          <div key={i} className={clsx('border rounded-lg p-4 flex flex-col space-y-4 md:space-y-0 md:space-x-4', step.className)}>
            <span className="flex-none text-primary bg-primary-foreground rounded-full h-12 w-12 inline-flex justify-center items-center font-bold text-lg">
              {step.step}
            </span>
            <div>
              <h3 className="font-bold">{step.action}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks
