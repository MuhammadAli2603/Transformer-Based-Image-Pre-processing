# Clerk Authentication Setup Guide

This guide explains how Clerk authentication has been integrated into the Image Quality System.

## Current Status

Clerk authentication has been successfully integrated into the Next.js frontend using the **App Router** approach. The integration is complete and ready to use once you add your Clerk API keys.

## What's Been Implemented

### 1. Package Installation
- `@clerk/nextjs` (v6.35.4) is installed and ready to use

### 2. Environment Variables
Your `.env.local` file has been set up with placeholders:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

# Clerk URLs (customize if needed)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Middleware Configuration
`frontend/middleware.ts` has been created with the correct `clerkMiddleware()` implementation:
- Public routes: `/`, `/sign-in/*`, `/sign-up/*`
- All other routes are protected and require authentication
- Uses the official matcher pattern for optimal performance

### 4. ClerkProvider Wrapper
`frontend/app/layout.tsx` wraps the entire application with `<ClerkProvider>`, enabling Clerk features throughout the app.

### 5. Authentication Pages
Clerk-powered sign-in and sign-up pages are implemented at:
- `/sign-in/[[...sign-in]]/page.tsx` - Uses Clerk's `<SignIn>` component
- `/sign-up/[[...sign-up]]/page.tsx` - Uses Clerk's `<SignUp>` component

Both pages include custom styling to match your app's dark theme with gradient effects.

### 6. Protected Routes
`frontend/components/auth/ProtectedRoute.tsx` has been updated to use Clerk's `useAuth()` hook:
- Shows loading state while checking authentication
- Redirects to `/sign-in` if user is not authenticated
- Works seamlessly with the middleware for double protection

### 7. Navigation Components
`frontend/components/landing/Header.tsx` includes Clerk components:
- `<SignInButton>` and `<SignUpButton>` for unauthenticated users
- `<UserButton>` for authenticated users (shows avatar and account menu)
- `<SignedIn>` and `<SignedOut>` wrapper components for conditional rendering
- Dashboard link appears when user is signed in
- Works in both desktop and mobile views

## How to Complete the Setup

### Step 1: Get Your Clerk API Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Navigate to **API Keys** in the sidebar
4. Copy your **Publishable Key** and **Secret Key**

### Step 2: Update Environment Variables

Open `frontend/.env.local` and replace the placeholders with your actual keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx...
CLERK_SECRET_KEY=sk_test_xxxxx...
```

**IMPORTANT**: Never commit your actual API keys to version control. The `.gitignore` file already excludes `.env*.local` files.

### Step 3: Configure Clerk Dashboard (Optional)

In your Clerk Dashboard, you can configure:

1. **Authentication Options**:
   - Enable/disable email & password
   - Enable social providers (Google, GitHub, etc.)
   - Configure multi-factor authentication

2. **Appearance**:
   - The app already includes custom styling, but you can further customize in the dashboard

3. **User & Organization Settings**:
   - Configure required user fields
   - Set up organizations if needed

### Step 4: Test the Integration

1. Start your development servers:
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\activate
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Click "Get Started" or "Sign In" in the header
4. Create a test account or sign in
5. Verify you're redirected to the dashboard at `/dashboard`
6. Test the protected routes (`/dashboard`, `/upload`)

### Step 5: Clean Up Old Auth System (Optional)

The following files are from the old custom authentication system and can be removed once Clerk is fully tested:

- `frontend/lib/auth-context.tsx` - Old custom auth context
- `frontend/lib/validations.ts` - Old form validation schemas (if only used for auth)
- `frontend/app/auth/signin/page.tsx` - Old sign-in page
- `frontend/app/auth/signup/page.tsx` - Old sign-up page

**Before removing these files**, ensure:
1. No other parts of the app are importing from them
2. Clerk authentication is working correctly
3. You have a backup or version control

## Architecture Overview

### Authentication Flow

1. **Unauthenticated User**:
   - Visits landing page `/` (public)
   - Clicks "Sign In" or "Get Started"
   - Taken to Clerk's hosted auth pages (`/sign-in`, `/sign-up`)
   - After successful auth, redirected to `/dashboard`

2. **Authenticated User**:
   - Middleware validates authentication on every request
   - Can access protected routes (`/dashboard`, `/upload`)
   - Sees `<UserButton>` in header with account options
   - Clicking "Sign Out" in UserButton ends session

3. **Protected Route Access**:
   - User tries to access `/dashboard` or `/upload`
   - Middleware checks authentication first
   - If not authenticated, redirects to `/sign-in`
   - ProtectedRoute component provides additional client-side check
   - Shows loading state while verifying

### Component-Level Authentication

You can use Clerk's hooks and components anywhere in your app:

```typescript
import { useAuth, useUser } from '@clerk/nextjs';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

function MyComponent() {
  const { isLoaded, userId, sessionId } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <SignedOut>
        <p>Please sign in</p>
      </SignedOut>
      <SignedIn>
        <p>Welcome {user?.firstName}!</p>
        <UserButton />
      </SignedIn>
    </>
  );
}
```

## Security Notes

1. **Environment Variables**: Real API keys should only exist in `.env.local` (already in `.gitignore`)
2. **Middleware Protection**: All non-public routes are automatically protected
3. **Client + Server**: The app uses both middleware (server) and ProtectedRoute (client) for defense in depth
4. **Session Management**: Handled entirely by Clerk - no manual token management needed

## Troubleshooting

### Issue: "Clerk: Missing publishableKey"
**Solution**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local` and restart the dev server

### Issue: "Clerk: Invalid publishableKey"
**Solution**: Double-check you copied the correct key from the Clerk Dashboard. Publishable keys start with `pk_test_` or `pk_live_`

### Issue: Redirect loop on protected pages
**Solution**: Verify your middleware matcher is correct and that `/sign-in` and `/sign-up` are in the public routes list

### Issue: CORS errors between frontend and backend
**Solution**: This is unrelated to Clerk. Ensure your backend CORS settings allow requests from `http://localhost:3000`

## Additional Resources

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk App Router Guide](https://clerk.com/docs/references/nextjs/overview)
- [Clerk Component Reference](https://clerk.com/docs/components/overview)
- [Clerk Authentication Hooks](https://clerk.com/docs/references/react/use-auth)

## Migration Notes

The app previously used a custom authentication context with mock authentication. The migration to Clerk provides:

- **Real Authentication**: Actual user accounts instead of localStorage mock
- **Security**: Industry-standard JWT sessions, secure by default
- **Features**: Password reset, email verification, social login, MFA
- **User Management**: Built-in user dashboard and admin panel
- **Compliance**: SOC 2, GDPR, and CCPA compliant

All protected pages and components have been updated to use Clerk's authentication hooks.
