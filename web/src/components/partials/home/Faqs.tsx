import Loader from '@/components/custom/Loader'
import TypTitle from '@/components/custom/typography/Title'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import useFAQStore from '@/stores/useFAQStore'
import { AlertCircle, ChevronsUpDown } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface WrapperProps {
  children: ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-10 px-2 md:px-5 lg:px-20">
      <div className="flex flex-end">
        <div>
          <TypTitle>Got questions?</TypTitle>
          <p className="text-muted-foreground mt-2">
            If you cannot found what you're looking for,{' '}
            <Link to="/contact" className="underline">
              reach out.
            </Link>
          </p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}
const Faqs = () => {
  const { loading, error, faqs, getAll } = useFAQStore()

  useEffect(() => {
    getAll()
  }, [])

  const reloadFAQs = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    getAll()
  }

  if (loading)
    return (
      <Wrapper>
        <div className="py-5">
          <Loader />
        </div>
      </Wrapper>
    )

  if (error)
    return (
      <Wrapper>
        <Alert className="border-destructive bg-transparent" variant="destructive">
          <AlertCircle></AlertCircle>
          <AlertTitle>An error occurred</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Wrapper>
    )

  if (!faqs.length)
    return (
      <Wrapper>
        <div>
          <h5 className="text-lg font-medium">Empty.</h5>
          <p className='text-sm'>
            No FAQs created or loaded.{' '}
            <a href="#load-faqs" className='text-muted-foreground underline' onClick={reloadFAQs}>
              Retry.
            </a>
          </p>
        </div>
      </Wrapper>
    )

  return (
    <Wrapper>
      <div className="space-y-2 lg:space-y-4" id="faqs">
        {faqs.map(({ id, title, content }) => (
          <Collapsible key={id} className="group/faqs">
            <CollapsibleTrigger
              asChild
              className="border-b group-last/faqs:border-b-0 pb-2 lg:pb-4"
            >
              <div className="flex items-center justify-between p-2">
                <p className="flex-auto text-sm">{title}</p>
                <span className="p-2 rounded-full bg-white/10">
                  <ChevronsUpDown size={16} />
                </span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-2">
                <p className="text-sm text-muted-foreground">{content}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </Wrapper>
  )
}

export default Faqs
