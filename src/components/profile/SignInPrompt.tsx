import { GoogleIcon } from '@/components/ui';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

interface SignInPromptProps {
  onSignIn: (idToken: string) => Promise<void>;
}

export function SignInPrompt({ onSignIn }: SignInPromptProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-4 mb-4">
        <GoogleIcon className="w-6 h-6" />
        <div>
          <p className="text-white font-medium">Continue with Google</p>
          <p className="text-white/50 text-sm">
            Securely save your projects and preferences.
          </p>
        </div>
      </div>
      <GoogleSignInButton
        onSuccess={onSignIn}
        variant="outline"
        className="!py-3"
      />
    </div>
  );
}







