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
      className: "row-start-2 col-start-3",
      action: 'They Respond with Quotes:',
      text: 'Price, condition, availability — all returned back to you.',
    },
    {
      step: 5,
      className:"row-start-2 col-start-2",
      action: 'You Pick & Proceed:',
      text: 'Choose your vendor, follow up directly or through us. All logged.',
    },
  ]

  return (
    <div className="pl-20 pr-10 space-y-8 py-10">
      <h1 className="text-4xl font-bold">How it works</h1>
      <div className="grid grid-cols-3 gap-4">
        {steps.map((step,i) => (
          <div key={i} className={clsx('border rounded-lg p-4 flex space-x-4', step.className)}>
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
