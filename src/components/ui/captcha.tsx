import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export function Captcha({ onVerify, className = '' }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random captcha text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    onVerify(false);
  };

  // Draw captcha on canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw captcha text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < captchaText.length; i++) {
      const char = captchaText[i];
      const x = 25 + i * 25;
      const y = 30 + (Math.random() - 0.5) * 10;
      const angle = (Math.random() - 0.5) * 0.3;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 30%)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Add noise dots
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  // Verify captcha input
  const verifyCaptcha = (input: string) => {
    const isValid = input.toLowerCase() === captchaText.toLowerCase();
    setIsVerified(isValid);
    onVerify(isValid);
    return isValid;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    if (value.length === captchaText.length) {
      verifyCaptcha(value);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  // Initialize captcha
  useEffect(() => {
    generateCaptcha();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw when captcha text changes
  useEffect(() => {
    if (captchaText) {
      drawCaptcha();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaText]);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="captcha">Verification Code</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={180}
            height={60}
            className="border border-input rounded-md bg-background cursor-pointer"
            onClick={generateCaptcha}
            title="Click to refresh"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateCaptcha}
          className="h-[60px] px-3"
          title="Refresh captcha"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        <Input
          id="captcha"
          type="text"
          placeholder="Enter the code shown above"
          value={userInput}
          onChange={handleInputChange}
          className={`h-10 ${
            userInput.length === captchaText.length
              ? isVerified
                ? 'border-green-500 focus:border-green-500'
                : 'border-red-500 focus:border-red-500'
              : ''
          }`}
          maxLength={6}
        />
        {userInput.length === captchaText.length && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isVerified ? (
              <span className="text-green-500 text-sm">✓</span>
            ) : (
              <span className="text-red-500 text-sm">✗</span>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Click on the image or refresh button to generate a new code
      </p>
    </div>
  );
}
