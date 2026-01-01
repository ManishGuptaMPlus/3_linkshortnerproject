# UI Components Guidelines

## 📋 Overview

This project uses **shadcn/ui** exclusively for all UI components. shadcn/ui is not a component library - it's a collection of re-usable components that you can copy and paste into your apps.

## 🚨 Critical Rules

### ❌ DO NOT:
- Create custom UI components from scratch
- Build buttons, inputs, dialogs, cards, or any UI primitives manually
- Use other UI libraries (Material-UI, Ant Design, etc.)
- Create custom modal/dialog implementations
- Build form components without shadcn/ui

### ✅ ALWAYS:
- Use shadcn/ui components for ALL UI elements
- Check [shadcn/ui components](https://ui.shadcn.com/docs/components) before creating anything
- Add new shadcn components using: `npx shadcn@latest add [component-name]`
- Compose complex UIs by combining shadcn components
- Use the `cn()` utility from `@/lib/utils` for conditional styling

## 📦 Available Components

Components are installed on-demand. Common components include:

- **Layout**: Card, Separator, Aspect Ratio
- **Forms**: Input, Button, Label, Checkbox, Radio Group, Select, Textarea
- **Overlays**: Dialog, Sheet, Popover, Tooltip, Alert Dialog
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Data Display**: Table, Badge, Avatar, Calendar
- **Navigation**: Tabs, Dropdown Menu, Navigation Menu

## 🔧 Adding New Components

To add a shadcn component to the project:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

Components will be added to the `components/ui/` directory and can be imported directly.

## 💡 Usage Patterns

### Basic Import and Usage
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Styling with Tailwind
```tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Use variants provided by shadcn
<Button variant="outline" size="lg">Click</Button>

// Add custom Tailwind classes
<Button className="mt-4 w-full">Submit</Button>

// Conditional styling with cn()
<Button className={cn("w-full", isLoading && "opacity-50")}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### Forms with React Hook Form
```tsx
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const form = useForm()

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="Enter username" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

### Dialogs and Modals
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>
```

## 🎨 Customization

### Modifying Component Styles
shadcn components are copied into your project, so you can modify them directly:

1. Components are in `components/ui/`
2. Edit the component file to change default styles
3. Modify variants in the component's `cva()` configuration
4. Changes apply project-wide

### Theme Configuration
Theme colors and styles are configured in:
- `app/globals.css` - CSS variables for colors
- `tailwind.config.ts` - Tailwind theme extensions
- `components.json` - shadcn configuration

## 🔍 Finding the Right Component

Before building any UI:

1. **Check shadcn/ui docs**: Visit [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)
2. **Search for similar functionality**: Look through existing shadcn components
3. **Compose components**: Combine multiple shadcn components for complex UIs
4. **Install if missing**: Use `npx shadcn@latest add [component]`

## 📚 Common Component Combinations

### Form with Validation
- Form + Input + Label + Button
- FormField + FormControl + FormMessage

### Modal with Form
- Dialog + DialogContent + Form + Input + Button

### Data Display Card
- Card + CardHeader + CardTitle + CardContent + Badge

### Navigation
- NavigationMenu + NavigationMenuItem + Button

## 🔗 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/examples)
- [Theming Guide](https://ui.shadcn.com/docs/theming)

---

**Remember**: When in doubt, check shadcn/ui documentation first. There's likely a component that already does what you need.
