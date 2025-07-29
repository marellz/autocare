import TypTitle from '@/components/custom/typography/Title'
import { Blocks, ChartLine, ClockFading, ShipWheel } from 'lucide-react'

const WhyWorkWithUs = () => {
  const why = {
    heading: 'Built for people who hate wasting time.',
    description:
      "Whether you're a mechanic, car owner, or parts agent, we streamline your sourcing. No long calls. No running around. Just verified vendors, fast quotes, and organized responses.",
    points: [
      { icon: ClockFading, text: 'Responses usually within minutes' },
      { icon: Blocks, text: 'Simple, familiar chat interface' },
      { icon: ChartLine, text: 'Detailed follow-up tracking' },
      { icon: ShipWheel, text: 'You always stay in control' },
    ],
    quote:
      'Give us one request. We’ll do the legwork and get you 3–5 quotes in return — no extra work on your part.',
    note: 'All vendors are pre-approved and regularly rated — keeping the network trusted and reliable.',
  }
  return (
    <div className="space-y-8 px-2 md:px-10 lg:pl-20 pb-10 lg:pb-20">
      <div className="space-y-1 lg:max-w-1/2">
        <TypTitle>{why.heading}</TypTitle>
        <p className="text-muted-foreground mt-4">{why.description}</p>
      </div>
      <div>
        <div className="flex justify-center ">
          <div className="w-full max-w-xl space-y-4">
            {why.points.map((point, i) => (
              <div key={i} className="border rounded-lg p-4 flex space-x-2">
                <point.icon className="flex-none" />
                <p className="font-medium">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhyWorkWithUs
