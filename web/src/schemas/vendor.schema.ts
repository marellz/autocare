import z from 'zod'

const vendorFormSchema = z.object({
  name: z.string().min(2, { message: 'Vendor needs a name' }),
  phone: z
    .string()
    .length(12, { message: 'Not a valid phone number' })
    .startsWith('254', { message: "Phone number must start with '254'" })
    .regex(/^[0-9]+$/, { message: 'Phone number must only contain digits' }),

  location: z.string().optional(),
  brands: z.array(z.string()).min(1, { message: 'Please select at least one brand' }),
})

export type VendorFormSchema = z.infer<typeof vendorFormSchema>

export default vendorFormSchema
