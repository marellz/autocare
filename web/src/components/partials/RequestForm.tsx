import { useState, type FormEvent } from 'react'
import Input from '../form/Input'
import Text from '../form/Text'

const RequestForm = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('submitting form')

    console.log({
      name,
      phone,
      item,
    })
  }

  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [item, setItem] = useState<string>('')

  return (
    <div
      className="modal fade"
      id="requestFormModal"
      tabIndex={-1}
      aria-labelledby="requestFormModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="requestFormModalLabel">
                Make request
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Input
                label="Name"
                required
                defaultValue={name}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
              <Input
                label="Phone"
                prefix="254"
                required
                defaultValue={phone}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              />
              <Text
                label="Item description"
                required
                defaultValue={item}
                onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItem(e.target.value)}
              ></Text>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default RequestForm
