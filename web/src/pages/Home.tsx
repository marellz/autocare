import Faqs from '@/components/partials/home/Faqs'
import HowItWorks from '@/components/partials/home/HowItWorks'
import MainHero from '@/components/partials/home/MainHero'
import WhyWorkWithUs from '@/components/partials/home/WhyWorkWithUs'

const Home = () => {
  return (
    <div className="space-y-5 lg:space-y-20 pb-20">
      <div className="bg-gradient-to-b to-transparent from-red-500/10 min-h-[75vh] lg:border rounded-xl lg:rounded-2xl xl:rounded-4xl flex flex-col lg:justify-end pt-20 pb-10 lg:pb-20">
        <MainHero />
      </div>
      <div className="lg:border rounded-xl lg:rounded-2xl xl:rounded-4xl">
        <HowItWorks />
      </div>
      <div className="">
        <WhyWorkWithUs />
      </div>
      <div className="bg-gradient-to-t to-transparent from-red-500/10 md:py-10 lg:py-20 lg:border rounded-xl lg:rounded-2xl xl:rounded-4xl flex flex-col justify-center">
        <Faqs />
      </div>
    </div>
  )
}

export default Home
