import TypTitle from '@/components/custom/typography/Title'
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
    <div className="grid md:grid-cols-2 gap-10 px-2 md:px-5 lg:px-20">
      <div className="flex flex-end">
        <div>
          <TypTitle>Got questions?</TypTitle>
          <p className="text-muted-foreground mt-2">
            If you cannot found what you're looking for, {' '}
             <Link to="/contact" className="underline">
              reach out.
            </Link>
          </p>
        </div>
      </div>
      <div>
        <div className="space-y-2 lg:space-y-4" id="faqs">
          {items.map(({ q, a }, i) => (
            <Collapsible key={i} className='group/faqs'>
              <CollapsibleTrigger asChild className="border-b group-last/faqs:border-b-0 pb-2 lg:pb-4">
                <div className="flex items-center justify-between p-2">
                  <p className="flex-auto text-sm">{q}</p>
                  <span className="p-2 rounded-full bg-white/10">
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-2">
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
