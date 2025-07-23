import { Badge } from '@/components/ui/badge'
import RequestForm from '../RequestForm'
import { Button } from '@/components/ui/button'
import { ArrowRight,Bot,Globe,MailCheck,UserLock } from 'lucide-react'
import illustration from '@/assets/images/illustation.svg'
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
        description:
          'We forward your request to a vetted list of vendors. No spam, no time-wasters.',
      },
      {
        icon: Globe,
        title: 'WhatsApp + Web access',
        description: 'Manage requests however you prefer — chat-based or desktop browser.',
      },
    ]
  return (
    <div>
      <div className="flex justify-between">
        <div className="w-1/2 flex-none pl-20 pr-10 space-y-4">
          <Badge variant="outline">10K+ requests</Badge>
          <h1 className="text-4xl font-bold">
            Find car parts faster. With <i className="font-light">Zero</i> guesswork.
          </h1>
          <p className="text-lg text-muted-foreground">
            Send one message. Get multiple vendor quotes — instantly. No chasing, no stress. Just
            clear responses, via WhatsApp or Web.
          </p>
          <div className="flex space-x-4 items-center">
            <RequestForm />
            <Button variant="outline">
              <span>Read our client stories</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="w-1/3 flex-none">
        <img className='w-full max-w-full' src={illustration} alt="" />
        </div>
      </div>
      <div className='grid grid-cols-4 gap-8 pl-20 pr-10 mt-40'>
        {items.map((item, i)=>(
            <div key={i} className='border rounded-lg p-4 flex space-x-2'>
                <item.icon  className='flex-none'/>
                <div>
                    <h3 className='font-medium'>{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
            </div>
        ))}
        
      </div>
    </div>
  )
}

export default MainHero
