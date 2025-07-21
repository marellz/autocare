const Terms = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Terms</h1>
        <p className="text-muted-foreground">
          Last updated <span>21/07/2025</span>
        </p>
      </div>
      <p>By using our platform, you agree to the following terms : </p>
      <ol role="list" className="space-y-2 font-light">
        <li>
          <span className="font-medium">Use of Service: </span>
          You may use the platform to request car parts and view vendor responses. Abuse, spamming,
          or misuse will result in removal from the service.
        </li>
        <li>
          <span className="font-medium">Vendor Communication:</span> We connect you with vendors but
          are not responsible for the quality, pricing, or delivery of parts.
        </li>
        <li>
          <span className="font-medium">Accuracy: </span> While we strive for accurate matches, we
          do not guarantee availability or compatibility of requested parts.
        </li>
        <li>
          <span className="font-medium">Privacy & Security: </span> Your phone number and request
          details are used solely to serve your inquiry. We do not sell or share your data without
          consent.
        </li>
        <li>
          <span className="font-medium">Changes: </span> We may update these terms at any time.
          Continued use implies acceptance.
        </li>
      </ol>
    </div>
  )
}

export default Terms
