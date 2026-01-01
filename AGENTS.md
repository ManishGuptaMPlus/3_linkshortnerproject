# Agent Instructions for Link Shortener Project

This file serves as the master index for all AI agent instructions when working on this project. These guidelines ensure consistency, maintainability, and adherence to project standards.

## 📋 Overview

This is a **Link Shortener** application built with Next.js 16, featuring:
- Modern React Server Components architecture
- PostgreSQL database with Drizzle ORM
- Authentication via Clerk
- Tailwind CSS with shadcn/ui components
- TypeScript for type safety

## ⚠️ CRITICAL: Read Before Coding

**🚨 ALWAYS read the relevant instruction file from `/docs` directory BEFORE generating ANY code! 🚨**

Do NOT skip this step. The documentation contains essential patterns, standards, and implementation details that must be followed.

## 📚 Detailed Agent Instructions

All agent instructions are organized in the `/docs` directory:

- **[Authentication Guidelines](docs/authentication.md)** - Clerk authentication, protected routes, and modal-based sign-in/sign-up
- **[UI Components Guidelines](docs/ui-components.md)** - shadcn/ui usage, component patterns, and styling standards

> **⚠️ MANDATORY REQUIREMENT:**  
> **ALWAYS read and consult the relevant .md file from the list above BEFORE generating any code.**  
> Failure to do so will result in inconsistent implementations that don't follow project standards.


## 🎯 Quick Reference

### Essential Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx drizzle-kit push # Push database schema changes
npx drizzle-kit studio # Open Drizzle Studio
```

### Key Principles
- **TypeScript First**: Use strict TypeScript with proper typing
- **Server Components by Default**: Use Client Components only when necessary
- **Database Schema**: Define all schemas in `db/schema.ts`
- **Component Library**: Use shadcn/ui for UI components
- **Path Aliases**: Use `@/` for imports from project root
- **Styling**: Use Tailwind CSS utility classes with `cn()` helper

## 🚀 Getting Started as an Agent

1. **🚨 FIRST: Read the relevant `/docs/*.md` file** - This is MANDATORY before writing any code
2. **Read the tech stack documentation** to understand the technologies
3. **Review coding standards** before making any code changes
4. **Check project structure** to understand where files should be placed
5. **Consult feature-specific guides** when working on database or UI components
6. **Always maintain consistency** with existing code patterns

## ⚠️ Important Notes

- This project uses **Next.js 16** with the App Router
- **React 19** is used, be aware of breaking changes from React 18
- **Tailwind CSS v4** is configured, check for breaking changes
- All components should be **Server Components** unless client interactivity is required
- Use **Clerk** for all authentication and user management
- Database queries should use **Drizzle ORM** - never write raw SQL directly

## 📝 Contributing Guidelines for Agents

When making changes:
1. ✅ Follow TypeScript strict mode requirements
2. ✅ Use existing patterns and conventions
3. ✅ Add proper error handling
4. ✅ Include JSDoc comments for complex functions
5. ✅ Test locally before committing
6. ✅ Maintain consistent formatting (ESLint rules)

## 🔗 External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: January 1, 2026
**Project Version**: 0.1.0
