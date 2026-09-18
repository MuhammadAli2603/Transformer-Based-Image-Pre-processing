import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-accent p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white',
              card: 'bg-dark-card shadow-xl border border-dark-border',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton:
                'bg-dark-secondary border border-dark-border text-white hover:bg-dark-accent',
              formFieldLabel: 'text-gray-300',
              formFieldInput:
                'bg-dark-secondary border border-dark-border text-white focus:border-brand-primary',
              footerActionLink: 'text-brand-primary hover:text-brand-secondary',
              dividerLine: 'bg-dark-border',
              dividerText: 'text-gray-400',
            },
          }}
        />
      </div>
    </div>
  );
}
