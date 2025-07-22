import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const Faqs = () => {
  const items = [
    {
      q: 'Do I have to install anything?',
      a: 'Nope. You can use it straight from WhatsApp or your browser. No app install required.',
    },
    {
      q: 'Who can see my request?',
      a: 'Only verified vendors we trust — handpicked and rated frequently.',
    },
    {
      q: 'Who can see my request?',
      a: 'Only verified vendors we trust — handpicked and rated frequently.',
    },
    {
      q: 'Is this free to use?',
      a: 'For clients, yes. We charge vendors a small fee for the platform. You get it free.',
    },
    {
      q: 'What if I don’t get a response?',
      a: 'If no vendors reply in 10 minutes, we’ll ping a second batch. You can also resend manually.',
    },
    {
      q: 'Can I use both WhatsApp and the Web?',
      a: 'Absolutely. The system works seamlessly across both platforms.',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="flex flex-end">
        <div className="px-20">
          <h1 className="text-4xl font-bold">Got questions?</h1>
          <p className="text-muted-foreground">
            If you cannot found what you're looking for,
            <Link to="/contact" className="underline">
              reach out
            </Link>
          </p>
        </div>
      </div>
      <div>
        <div className="space-y-4" id="faqs">
          {items.map(({ q, a }, i) => (
            <Collapsible key={i}>
              <CollapsibleTrigger asChild>
                <div className="border-b pb-4">
                  <Button variant="ghost" className="w-full text-left py-4 flex">
                    <p className="flex-auto">{q}</p>
                    <ChevronsUpDown />
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{a}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faqs
