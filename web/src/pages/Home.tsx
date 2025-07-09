import Faqs from '@/components/partials/home/Faqs'
import HowItWorks from '@/components/partials/home/HowItWorks'
import MainHero from '@/components/partials/home/MainHero'
import WhyWorkWithUs from '@/components/partials/home/WhyWorkWithUs'

const Home = () => {
  return (
    <div className="container mx-auto space-y-20 pb-20">
      <div className="bg-gradient-to-b to-transparent from-red-500/10 min-h-[75vh] border rounded-4xl flex flex-col justify-end pb-20">
        <MainHero />
      </div>
      <div className="border rounded-4xl">
        <HowItWorks />
      </div>
      <div className="py-20">
        <WhyWorkWithUs />
      </div>
      <div className="bg-gradient-to-t to-transparent from-red-500/10 py-20 border rounded-4xl flex flex-col justify-center">
        <Faqs />
      </div>
    </div>
  )
}

export default Home
