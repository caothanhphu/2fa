import { useState, useEffect } from 'react';
import { Copy, Check, Shield } from 'lucide-react';
import { generateTOTP, getTimeRemaining } from '@/lib/totp';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface OTPDisplayProps {
  secret: string;
}

export function OTPDisplay({ secret }: OTPDisplayProps) {
  const [otp, setOtp] = useState<string>('------');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!secret) {
      setOtp('------');
      return;
    }

    const updateOTP = async () => {
      const newOtp = await generateTOTP(secret);
      setOtp(newOtp);
    };

    updateOTP();

    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining === 30) {
        updateOTP();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const copyToClipboard = async () => {
    if (otp === '------') return;
    
    try {
      await navigator.clipboard.writeText(otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const progress = (timeRemaining / 30) * 100;

  return (
    <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Your OTP Code</span>
      </div>

      {/* OTP Display */}
      <div className="flex justify-center gap-2 mb-6">
        {otp.split('').map((digit, index) => (
          <div
            key={index}
            className={cn(
              "w-12 h-16 flex items-center justify-center",
              "bg-background rounded-lg border-2 border-border",
              "font-mono text-3xl font-bold text-foreground",
              "transition-all duration-200",
              digit !== '-' && "border-primary/30 shadow-sm"
            )}
          >
            {digit}
          </div>
        ))}
      </div>

      {/* Progress Bar - decreasing from right to left */}
      <div className="mb-4">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-linear rounded-full",
              timeRemaining <= 5 ? "bg-destructive" : "bg-primary"
            )}
            style={{ 
              width: `${progress}%`,
              marginLeft: 'auto'
            }}
          />
        </div>
      </div>

      {/* Timer and Copy Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              timeRemaining <= 5 ? "bg-destructive animate-pulse" : "bg-primary"
            )}
          />
          <span className={cn(
            "text-sm font-medium",
            timeRemaining <= 5 ? "text-destructive" : "text-muted-foreground"
          )}>
            {timeRemaining}s remaining
          </span>
        </div>

        <button
          onClick={copyToClipboard}
          disabled={otp === '------'}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-primary text-primary-foreground",
            "font-medium text-sm transition-all duration-200",
            "hover:opacity-90 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            copied && "bg-chart-1"
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
