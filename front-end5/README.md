Getting Started

Prerequisites:
- Node.js (v16.0.0 or higher)
- pnpm (v8.0.0 or higher)

Installation:
1. Install dependencies:
   pnpm install

2. Start the development server:
   pnpm dev

Using shadcn/ui Components:

To add a component:
pnpm dlx shadcn-ui@latest add <component-name>

Example:
pnpm dlx shadcn-ui@latest add button

Common components:
- button
- card
- dialog
- dropdown-menu
- input
- form

To use a component in your code:
1. Import it from @/components/ui
2. Use it in your JSX

Example:
import { Button } from "@/components/ui/button"

Available Scripts:
pnpm dev - Start development server
pnpm build - Build for production
pnpm start - Start production server
pnpm lint - Run ESLint
