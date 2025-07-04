import { Loader as LoaderIcon } from "lucide-react"

const Loader = () => {
  return <div className="py-4 text-center">
    <LoaderIcon className="inline transform animate-spin"/>
  </div>
}

export default Loader