import ContactForm from '@/components/partials/contact/ContactForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, ExternalLink, Mail, MessageCircle, Phone, Send, Siren } from 'lucide-react'

const Contact = () => {
  const phone = '254 7XX XXX XXX'
  const email = 'support@ourdomain.com'

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-2 gap-10">
      <div className="col-span-2">
        <h1 className="font-bold text-4xl">Contact us</h1>
        <p className="text-muted-foreground">We’re here to help.</p>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="inline-flex space-x-2 items-center">
              <MessageCircle size={16} />
              <CardTitle>Whatsapp</CardTitle>
            </div>
            <CardDescription>
              Our fastest support channel. Send us a message anytime:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm inline-flex space-x-4">
              <a
                className="inline-flex items-center space-x-2"
                href={`tel:+${phone.replace(' ', '')}`}
              >
                <Phone size={16} /> <span> + {phone}</span>
              </a>
              <a href={`https://wa.me/${phone.replace(' ', '')}`}>
                <ExternalLink size={16} />
              </a>
            </p>

            <p className="text-sm mt-5">(Available Mon - Sat, 9AM - 6PM EAT)</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <div className="inline-flex space-x-2 items-center">
              <Send size={16} />
              <CardTitle>Email support</CardTitle>
            </div>
            <CardDescription>Prefer email? We're happy to help.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm inline-flex space-x-4">
              <a className="inline-flex items-center space-x-2" href={email}>
                <Mail size={16} /> <span> {email}</span>
              </a>
            </p>

            <p className="text-sm mt-5">(Response within 24 &amp; 48 hours)</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <div className="inline-flex space-x-2 items-center">
              <Building size="16" />
              <CardTitle>Business details</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p className="font-medium">Alex Autocare</p>
              <p>Nairobi, Kenya</p>
              <p>Business Hours: Monday &amp; Saturday, 9AM &amp; 6PM</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <div className="inline-flex space-x-2 items-center">
              <Siren size={16} />
              <CardTitle>Need to reach a vendor?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm ">
              We only connect you with <b>verified vendors</b>. For issues related to a specific
              quote or vendor, contact us directly and we’ll follow up on your behalf.
            </p>
          </CardContent>
        </Card>
      </div>
      <hr className="col-span-2" />
      <div className="col-span-2">
        <ContactForm />
      </div>
    </div>
  )
}

export default Contact
