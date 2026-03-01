import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TurnstileGateProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    turnstile: {
      render: (element: HTMLElement, options: any) => void;
    };
  }
}

export const TurnstileGate = ({ children }: TurnstileGateProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // If no site key, just show content (development)
    if (!siteKey) {
      setIsVerified(true);
      return;
    }

    if (!containerRef.current) return;

    const renderTurnstile = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: () => setIsVerified(true),
        });
      }
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const checkTurnstile = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkTurnstile);
          renderTurnstile();
        }
      }, 100);
      return () => clearInterval(checkTurnstile);
    }
  }, [siteKey]);

  if (isVerified) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Security Check</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div ref={containerRef} />
        </CardContent>
      </Card>
    </div>
  );
};