import { Shield, Lock } from 'lucide-react';
import { OTPDisplay } from '@/components/OTPDisplay';
import { SecretInput } from '@/components/SecretInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Index = () => {
  const [secret, setSecret] = useLocalStorage<string>('2fa-secret', '');

  const handleClear = () => {
    setSecret('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-foreground">2FA OTP Manager</h1>
            <p className="text-sm text-muted-foreground">Secure one-time password generator</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* OTP Display */}
        <OTPDisplay secret={secret} />

        {/* Secret Input */}
        <SecretInput 
          value={secret} 
          onChange={setSecret} 
          onClear={handleClear}
        />

        {/* Info Card */}
        <div className="bg-accent/50 rounded-xl p-6 border border-accent">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-accent rounded-lg">
              <Lock className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Your data stays private</h3>
              <p className="text-sm text-muted-foreground">
                Your secret key is stored locally in your browser and never sent to any server. 
                All OTP generation happens entirely on your device.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Time-based One-Time Password (TOTP) • RFC 6238 compliant
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
