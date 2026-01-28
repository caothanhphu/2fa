import { useState } from 'react';
import { Eye, EyeOff, Key, Save, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isValidBase32 } from '@/lib/totp';

interface SecretInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SecretInput({ value, onChange, onClear }: SecretInputProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, '');
    setInputValue(newValue);
    // Update OTP immediately when input is valid
    if (isValidBase32(newValue)) {
      onChange(newValue);
    }
  };

  const handleSave = () => {
    if (inputValue && isValidBase32(inputValue)) {
      onChange(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
  };

  const isValid = inputValue.length === 0 || isValidBase32(inputValue);
  const hasChanges = inputValue !== value;
  const canSave = inputValue && isValidBase32(inputValue) && hasChanges;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-foreground">2FA Secret Key</span>
      </div>

      <div className="relative mb-4">
        <input
          type={showSecret ? 'text' : 'password'}
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter your 2FA secret key..."
          className={cn(
            "w-full px-4 py-3 pr-12 rounded-lg",
            "bg-background border-2 border-input",
            "font-mono text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary",
            "transition-all duration-200",
            !isValid && "border-destructive focus:border-destructive focus:ring-destructive"
          )}
        />
        <button
          onClick={() => setShowSecret(!showSecret)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {!isValid && (
        <p className="text-sm text-destructive mb-4">
          Please enter a valid Base32 secret key (at least 16 characters, A-Z and 2-7 only)
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
            "bg-primary text-primary-foreground",
            "font-medium text-sm transition-all duration-200",
            "hover:opacity-90 active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Save className="w-4 h-4" />
          Save Key
        </button>

        <button
          onClick={handleClear}
          disabled={!value && !inputValue}
          className={cn(
            "flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
            "bg-secondary text-secondary-foreground",
            "font-medium text-sm transition-all duration-200",
            "hover:opacity-90 active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {value && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          ✓ Key saved to browser storage
        </p>
      )}
    </div>
  );
}
