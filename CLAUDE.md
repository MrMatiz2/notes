# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production with Turbopack
- `npm start` - Start production server
- `npx drizzle-kit generate` - Generate database migrations
- `npx drizzle-kit migrate` - Run database migrations
- `npx drizzle-kit studio` - Open Drizzle Studio for database inspection

## Architecture Overview

This is a Next.js 15 notes application with authentication, built using:

### Core Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Better Auth with email/password
- **Styling**: Tailwind CSS 4
- **Runtime**: Bun (see bun.lock)

### Authentication System
- Uses Better Auth with Drizzle adapter
- Authentication logic in `auth.ts`
- Client-side auth utilities in `app/lib/auth-client.ts`
- Database schema in `db/schema/auth-schema.ts` (user, session, account, verification tables)
- Middleware in `middleware.ts` protects `/dashboard` route
- Auth API routes in `app/api/auth/[...all]/route.ts`
- Sign-in/sign-up pages in `app/signin/` and `app/signup/`

### Database Structure
- Database configuration in `drizzle.config.ts`
- Database instance in `db/index.ts`
- Auth schema in `db/schema/auth-schema.ts`
- Notes schema in `db/schema/note-schema.ts` (appears to be in development)
- SQLite database file: `local.db`

### Environment
- Uses dotenv for environment variables
- Database file path configured via `DB_FILE_NAME` environment variable

## Key Files
- `auth.ts` - Better Auth configuration
- `middleware.ts` - Route protection middleware
- `db/index.ts` - Database connection
- `drizzle.config.ts` - Drizzle ORM configuration
- Database schemas in `db/schema/`
- We are using gridstack as the library to show the notes