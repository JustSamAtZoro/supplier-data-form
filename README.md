# Zoro Supplier Product Data Form

A Vue 3 + TypeScript + Vite + Tailwind CSS application for collecting supplier product data using a dynamic taxonomy-driven form system.

## Overview

This application provides a supplier-facing form for submitting product information to Zoro's merchandising team. The form dynamically renders fields based on product category and subcategory selections, ensuring that suppliers provide the right information for each type of product.

## Features

- **Dynamic Form Generation**: Fields are generated based on product taxonomy
- **Conditional Logic**: Fields show/hide based on other field values
- **Real-time Validation**: Form validation with error messages
- **Auto-save**: Form data persists in localStorage
- **Export Options**: JSON and CSV export functionality
- **Multi-SKU Support**: Option to submit multiple product variants
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Zod** for schema validation

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/JustSamAtZoro/supplier-data-form.git
cd supplier-data-form

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
pnpm build
```

## Customization

### Adding New Categories/Subcategories

Edit `/src/lib/taxonomy.ts` to add new product categories or subcategories:

```typescript
export const TAXONOMY: Taxonomy = {
  'New Category': {
    name: 'New Category Display Name',
    subcategories: {
      'NewSubcategory': {
        name: 'New Subcategory Display Name',
        attributes: [
          {
            key: 'newField',
            label: 'New Field Label',
            type: 'text',
            required: true,
            helpText: 'Help text for the field'
          }
        ],
        compliance: [
          // Optional compliance fields
        ]
      }
    }
  }
}
```

### Field Types

Supported field types:
- `text` - Single line text input
- `textarea` - Multi-line text input
- `number` - Numeric input with optional units
- `select` - Dropdown selection
- `multiselect` - Multiple checkbox selections
- `boolean` - Yes/No radio buttons
- `url` - URL input with validation
- `file` - File upload (planned)

### Conditional Fields

Use the `showIf` property to show fields conditionally:

```typescript
{
  key: 'conditionalField',
  label: 'Conditional Field',
  type: 'text',
  showIf: { key: 'triggerField', equals: 'triggerValue' }
}
```

### Brand Colors

The application uses a strict color palette defined in `tailwind.config.ts`:

- `primary`: #0B485B (Zoro Blue)
- `secondary`: #092B34 (Dark Blue)
- `accent`: #D24600 (Orange)
- `accentDark`: #471503 (Dark Orange)
- `white`: #FFFFFF
- `grayLight`: #F3F3F3
- `black`: #000000

### Logo Replacement

Replace `/src/assets/logo.svg` with your company logo. The header component will automatically use the new logo.

## Data Export

The application supports two export formats:

### JSON Export
Exports the complete form data as a JSON file with all field values and metadata.

### CSV Export
Exports form data as a CSV file with headers matching the field keys. Suitable for importing into spreadsheet applications or databases.

## Multi-SKU Mode

Enable Multi-SKU mode to collect data for multiple product variants in a single session. Each SKU maintains its own form data and validation state.

## Deployment

The application builds to static files and can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

## Repository

Push to GitHub repository:
```bash
git remote add origin https://github.com/JustSamAtZoro/supplier-data-form.git
git branch -M main
git push -u origin main
```

## Testing

Run tests with:
```bash
npm run test
# or
pnpm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

© 2024 Zoro Tools, Inc. All rights reserved.
