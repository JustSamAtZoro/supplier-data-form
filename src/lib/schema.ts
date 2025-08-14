import { z } from 'zod'
import { Attribute, CORE, SHARED_DIM_PACK, TAXONOMY } from './taxonomy'

const urlSchema = z.string().url('Enter a valid URL')
const gtinSchema = z.string().regex(/^\d{8,14}$/, 'GTIN/UPC must be 8–14 digits')

export function schemaFor(categoryKey: string, subcategoryKey: string) {
  const subcat = TAXONOMY[categoryKey]?.subcategories?.[subcategoryKey]
  if (!subcat) throw new Error('Invalid category/subcategory')
  
  const attrs: Attribute[] = [...CORE, ...subcat.attributes, ...SHARED_DIM_PACK]
  if (subcat.compliance) {
    attrs.push(...subcat.compliance)
  }
  
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const a of attrs) {
    let s: z.ZodTypeAny
    switch (a.type) {
      case 'text':
      case 'textarea': 
        s = z.string().min(1, 'This field is required').optional()
        break
      case 'number': 
        s = z.number({ invalid_type_error: 'Must be a number' }).optional()
        break
      case 'select': 
        s = z.string().min(1, 'This field is required').optional()
        break
      case 'multiselect': 
        s = z.array(z.string()).optional()
        break
      case 'boolean': 
        s = z.boolean().optional()
        break
      case 'url': 
        s = urlSchema.optional()
        break
      case 'file': 
        s = z.any().optional()
        break
      default: 
        s = z.any().optional()
    }
    
    if (a.required) {
      s = s.refine(v => v !== undefined && v !== '' && v !== null, { message: 'This field is required' })
    }
    
    if (a.key === 'gtin') s = gtinSchema
    if (a.key === 'shortDescription') s = z.string().max(200, 'Max 200 characters')
    
    shape[a.key] = s
  }

  return z.object(shape)
}

export type FormData = z.infer<ReturnType<typeof schemaFor>>
