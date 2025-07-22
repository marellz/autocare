const Privacy = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Privacy</h1>
        <p className="text-muted-foreground">Your Privacy Matters.</p>
      </div>
      <p>We respect and protect your privacy. Here’s how we handle your data : </p>
      <ol role="list" className="space-y-2 font-light">
        <li>
          <span className="font-medium">What We Collect : </span>
          Your phone number and part request details. Optionally, your name and location if you
          provide them.
        </li>
        <li>
          <span className="font-medium">Why We Collect It : </span>
          To help match your request with the most suitable vendors and notify you of responses.
        </li>
        <li>
          <span className="font-medium">Who Sees It : </span>
          Only our internal team and the trusted vendors relevant to your request. No third-party
          marketing or spam.
        </li>
        <li>
          <span className="font-medium">Data Retention : </span>
          We store request history temporarily for service quality and response tracking. You may
          request deletion anytime.
        </li>
        <li>
          <span className="font-medium">Security : </span>
          We use modern security practices to keep your data safe.
        </li>
      </ol>
      <p>
        Questions? Email us at <span className="text-primary underline">support@ourdomain.com</span>.
      </p>
    </div>
  )
}

export default Privacy
