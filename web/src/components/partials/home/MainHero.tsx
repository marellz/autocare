import { Badge } from '@/components/ui/badge'
import RequestForm from '../RequestForm'
import { Button } from '@/components/ui/button'
import { ArrowRight, Bot, Globe, MailCheck, UserLock } from 'lucide-react'
import illustration from '@/assets/images/illustation.svg'
import TypTitle from '@/components/custom/typography/Title'
const MainHero = () => {
  const items = [
    {
      icon: MailCheck,
      title: 'One message, multiple quotes',
      description: 'No need to call or text multiple vendors. We handle that for you, instantly.',
    },
    {
      icon: Bot,
      title: 'Smart request matching',
      description:
        "Our AI reads your message and figures out exactly what parts you're asking for.",
    },
    {
      icon: UserLock,
      title: 'Trusted vendors only',
      description: 'We forward your request to a vetted list of vendors. No spam, no time-wasters.',
    },
    {
      icon: Globe,
      title: 'WhatsApp + Web access',
      description: 'Manage requests however you prefer — chat-based or desktop browser.',
    },
  ]
  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row items-center md:items-start md:justify-between">
        <div className="lg:w-1/2 flex-none px-5 md:px-10 lg:pl-20 space-y-4">
          <Badge variant="outline">10K+ requests</Badge>
          <TypTitle>
            Find car parts faster. With <i className="font-light">Zero</i> guesswork.
          </TypTitle>
          <p className="text-lg text-muted-foreground">
            Send one message. Get multiple vendor quotes — instantly. No chasing, no stress. Just
            clear responses, via WhatsApp or Web.
          </p>
          <div className="flex w-full space-y-4 md:space-x-4 md:space-y-0 flex-col md:flex-row md:items-center">
            <RequestForm />
            <Button variant="outline">
              <span>Read our client stories</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="pl-5 md:pl-10 lg:pl-0 max-w-[70%] md:max-w-sm flex-none mb-10">
          <img className="w-full max-w-full" src={illustration} alt="" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-5 md:px-10 lg:pl-20 mt-16 md:mt-24 lg:mt-40">
        {items.map((item, i) => (
          <div key={i} className="border rounded-lg p-4 flex space-x-2">
            <item.icon className="flex-none" />
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainHero
