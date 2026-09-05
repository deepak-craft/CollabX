import React, { useRef } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split current value into individual digit strings
  const otpArray = Array.from({ length }, (_, i) => value[i] || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value;
    // Keep numbers/digits only
    const digitsOnly = rawVal.replace(/\D/g, '');

    if (!digitsOnly) {
      // Input was cleared
      const newOtp = [...otpArray];
      newOtp[index] = '';
      onChange(newOtp.join(''));
      return;
    }

    // Take the last typed digit if user overwrote existing digit
    const lastDigit = digitsOnly[digitsOnly.length - 1];
    const newOtp = [...otpArray];
    newOtp[index] = lastDigit;
    const updatedOtpStr = newOtp.join('');
    onChange(updatedOtpStr);

    // Auto-advance focus to the next input box
    if (index < length - 1 && lastDigit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpArray[index] && index > 0) {
        // Current box is empty, move focus to previous input box
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, length);
    if (!digitsOnly) return;

    onChange(digitsOnly);

    // Focus the input box corresponding to pasted length or the last box
    const nextIndex = Math.min(digitsOnly.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otpArray[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length} digit verification code`}
          className="w-10 h-12 sm:w-11 sm:h-12 text-center text-lg font-bold font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-2 focus:ring-gov-blue focus:border-gov-blue focus:outline-none transition-all disabled:opacity-50 shadow-xs"
        />
      ))}
    </div>
  );
};
