# Authentication Guidelines

## Overview

This application uses **Clerk** exclusively for all authentication and user management. No other authentication methods should be implemented.

## Core Principles

### ✅ Always Use Clerk
- All authentication is handled through Clerk
- Never implement custom auth logic (JWT, sessions, passwords, etc.)
- Use Clerk's built-in components and hooks

### 🚫 Never Use
- Custom authentication systems
- Manual JWT handling
- Direct password management
- Third-party auth libraries (NextAuth, Passport, etc.)

## Protected Routes

### Dashboard Route
- Path: `/dashboard`
- **MUST** require authentication
- Redirect unauthenticated users to sign-in

### Home Page Redirect
- Path: `/`
- **IF** user is logged in → redirect to `/dashboard`
- **IF** user is NOT logged in → show landing page

## Authentication UI

### Modal-Based Authentication
- Sign in and sign up **MUST ALWAYS** launch as modals
- Never use full-page authentication flows
- Use Clerk's modal components: `<SignIn />` and `<SignUp />`

### Implementation Example
```tsx
import { SignIn, SignUp } from "@clerk/nextjs";

// Trigger as modal with routing
<SignIn routing="modal" />
<SignUp routing="modal" />
```

## Implementation Checklist

When implementing auth features:
- [ ] Use Clerk components for all auth UI
- [ ] Protect `/dashboard` route with auth check
- [ ] Implement redirect from `/` to `/dashboard` for logged-in users
- [ ] Configure modals for sign-in/sign-up
- [ ] Use Clerk hooks for user state (`useUser()`, `useAuth()`)
- [ ] Never bypass Clerk for authentication logic

## Common Patterns

### Server Component (Route Protection)
```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Protected content
}
```

### Client Component (User State)
```tsx
"use client";
import { useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { isSignedIn, user } = useUser();
  
  if (!isSignedIn) return null;
  
  return <div>Hello {user.firstName}</div>;
}
```

### Middleware (Route Protection)
```tsx
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
```

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Component Reference](https://clerk.com/docs/components/overview)

---

**Last Updated**: January 1, 2026
