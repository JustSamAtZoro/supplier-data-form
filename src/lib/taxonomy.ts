export type FieldType = 'text'|'textarea'|'number'|'select'|'multiselect'|'boolean'|'url'|'file'
export type ShowIf = { key: string; equals: string | string[] }
export type Attribute = {
  key: string
  label: string
  type: FieldType
  required?: boolean
  unit?: string
  options?: string[]
  showIf?: ShowIf
  helpText?: string
}
export type Subcategory = { name: string; attributes: Attribute[]; compliance?: Attribute[] }
export type Category = { name: string; subcategories: Record<string, Subcategory> }
export type Taxonomy = Record<string, Category>

export const CORE: Attribute[] = [
  { key: 'brand', label: 'Brand', type: 'text', required: true, helpText: 'Manufacturer or brand name' },
  { key: 'mpn', label: 'Manufacturer Part Number (MPN)', type: 'text', required: true, helpText: 'Unique identifier from manufacturer' },
  { key: 'name', label: 'Product Name', type: 'text', required: true, helpText: 'Descriptive product name' },
  { key: 'shortDescription', label: 'Short Description', type: 'textarea', required: true, helpText: 'Brief product description (max 200 characters)' },
  { key: 'longDescription', label: 'Long Description', type: 'textarea', required: true, helpText: 'Detailed product description' },
  { key: 'gtin', label: 'GTIN/UPC', type: 'text', required: true, helpText: '8-14 digit product identifier' },
  { key: 'countryOfOrigin', label: 'Country of Origin', type: 'text', required: true, helpText: 'Country where product is manufactured' },
  { key: 'unspsc', label: 'UNSPSC', type: 'text', helpText: 'United Nations Standard Products and Services Code' },
  { key: 'keywords', label: 'Keywords/Meta', type: 'textarea', helpText: 'Search terms and metadata' },
  { key: 'lifecycle', label: 'Lifecycle Status', type: 'select', options: ['Active', 'Obsolete'] },
  { key: 'warranty', label: 'Warranty', type: 'textarea', helpText: 'Warranty terms and conditions' },
  { key: 'hazmat', label: 'Hazmat', type: 'boolean', helpText: 'Is this a hazardous material?' },
  { key: 'shipsAlone', label: 'Ships Alone', type: 'boolean', helpText: 'Can this item ship without other items?' },
  { key: 'assemblyRequired', label: 'Assembly Required', type: 'boolean', helpText: 'Does this item require assembly?' },
]

export const SHARED_DIM_PACK: Attribute[] = [
  { key: 'uom', label: 'Unit of Measure', type: 'select', options: ['EA', 'PR', 'BX', 'CS'] },
  { key: 'height', label: 'Item Height', type: 'number', unit: 'in' },
  { key: 'width', label: 'Item Width', type: 'number', unit: 'in' },
  { key: 'depth', label: 'Item Depth', type: 'number', unit: 'in' },
  { key: 'weight', label: 'Item Weight', type: 'number', unit: 'lb' },
  { key: 'casePack', label: 'Case Pack', type: 'number' },
  { key: 'caseWeight', label: 'Case Weight', type: 'number', unit: 'lb' },
  { key: 'palletQty', label: 'Pallet Qty', type: 'number' },
]

export const TAXONOMY: Taxonomy = {
  Safety: {
    name: 'Safety (PPE)',
    subcategories: {
      Gloves: {
        name: 'Hand Protection (Gloves)',
        attributes: [
          { key: 'gloveType', label: 'Glove Type', type: 'select', required: true, options: ['Disposable', 'General Purpose', 'Cut-Resistant', 'Chemical-Resistant', 'Heat-Resistant'] },
          { key: 'material', label: 'Material', type: 'select', options: ['Nitrile', 'Latex', 'Neoprene', 'HPPE', 'Leather', 'Cotton'] },
          { key: 'coating', label: 'Coating', type: 'select', options: ['None', 'Nitrile', 'Polyurethane', 'Latex'] },
          { key: 'cuff', label: 'Cuff Style', type: 'text' },
          { key: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] },
          { key: 'color', label: 'Color', type: 'text' },
          { key: 'length', label: 'Length', type: 'number', unit: 'in' },
          { key: 'thickness', label: 'Thickness', type: 'number', unit: 'mil', showIf: { key: 'gloveType', equals: 'Disposable' } },
          { key: 'ansiCut', label: 'ANSI Cut Level', type: 'select', options: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'], showIf: { key: 'gloveType', equals: 'Cut-Resistant' } },
          { key: 'en388', label: 'EN388', type: 'text' },
          { key: 'powdered', label: 'Powdered', type: 'boolean' },
          { key: 'boxQty', label: 'Box/Case Qty', type: 'number' },
        ],
        compliance: [
          { key: 'meets', label: 'Meets Standards', type: 'multiselect', options: ['ANSI/ISEA 105', 'EN 388'] },
          { key: 'certs', label: 'Certifications', type: 'textarea' },
        ],
      },
    },
  },
  'Janitorial & Cleaning': {
    name: 'Janitorial & Cleaning',
    subcategories: {
      Disinfectants: {
        name: 'Disinfectants',
        attributes: [
          { key: 'form', label: 'Form', type: 'select', options: ['Concentrate', 'Ready-to-Use', 'Wipe'], required: true },
          { key: 'active', label: 'Active Ingredient(s)', type: 'text' },
          { key: 'dilution', label: 'Dilution Ratio', type: 'text', showIf: { key: 'form', equals: 'Concentrate' } },
          { key: 'scent', label: 'Scent', type: 'text' },
          { key: 'ph', label: 'pH', type: 'number' },
          { key: 'surface', label: 'Surface Compatibility', type: 'text' },
          { key: 'containerType', label: 'Container Type', type: 'select', options: ['Bottle', 'Jug', 'Drum', 'Wipes Canister'] },
          { key: 'containerSize', label: 'Container Size', type: 'text' },
          { key: 'casePack', label: 'Case Pack', type: 'number' },
          { key: 'contactTime', label: 'Contact Time', type: 'number', unit: 'min' },
        ],
        compliance: [
          { key: 'epa', label: 'EPA Registration Number', type: 'text', required: true },
          { key: 'meets', label: 'Meets Standards', type: 'multiselect', options: ['EPA List N', 'VOC-compliant'] },
          { key: 'sds', label: 'SDS URL', type: 'url' },
        ],
      },
    },
  },
}

// Helper function to get subcategory options for a category
export function getSubcategoryOptions(categoryKey: string): string[] {
  const category = TAXONOMY[categoryKey]
  if (!category) return []
  return Object.keys(category.subcategories)
}