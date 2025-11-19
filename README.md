# Stock Screener Hub

A comprehensive financial platform for screening stocks, tracking earnings, and analyzing market data.

## Features

- 📊 **Stock Screener** - Filter and discover stocks based on various criteria
- 📈 **Earnings Calendar** - Track upcoming earnings reports and company announcements
- 💰 **Market Analysis** - Analyze trends and make informed investment decisions
- 🔐 **Secure Authentication** - User accounts powered by Clerk
- 💾 **Data Storage** - Persistent data management with Supabase

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Authentication:** Clerk
- **Database:** Supabase
- **Styling:** TailwindCSS
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Clerk account ([sign up here](https://clerk.com))
- Supabase project ([create one here](https://supabase.com))

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── utils/
│   └── supabase/          # Supabase client utilities
│       ├── client.ts      # Client-side queries
│       └── server.ts      # Server-side queries
└── middleware.ts          # Clerk authentication middleware
```

## Database Queries

### Client-Side (Client Components)

```typescript
'use client';
import { useSupabaseClient } from '@/utils/supabase/client';

export default function MyComponent() {
  const supabase = useSupabaseClient();
  // Use supabase for queries
}
```

### Server-Side (Server Components, API Routes)

```typescript
import { createSupabaseClient } from '@/utils/supabase/server';

export default async function MyServerComponent() {
  const supabase = await createSupabaseClient();
  // Use supabase for queries
}
```

## Contributing

This is a personal project, but suggestions and feedback are welcome.

## License

MIT
