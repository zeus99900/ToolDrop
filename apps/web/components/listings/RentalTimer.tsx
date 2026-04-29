'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RentalTimerProps {
  pickedUpAt: Date | string;
  totalHours: number;
  className?: string;
}

export default function RentalTimer({ pickedUpAt, totalHours, className }: RentalTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const startTime = new Date(pickedUpAt).getTime();
    const durationMs = totalHours * 60 * 60 * 1000;
    const endTime = startTime + durationMs;

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft(Math.abs(diff));
        setIsOverdue(true);
      } else {
        setTimeLeft(diff);
        setIsOverdue(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pickedUpAt, totalHours]);

  if (timeLeft === null) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all animate-pulse-slow",
      isOverdue 
        ? "bg-red-50 border-red-100 text-red-700" 
        : "bg-brand-50 border-brand-100 text-brand-700",
      className
    )}>
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        isOverdue ? "bg-red-100" : "bg-brand-100"
      )}>
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold opacity-70">
          {isOverdue ? 'Overdue' : 'Time Remaining'}
        </p>
        <p className="text-xl font-mono font-bold tabular-nums">
          {isOverdue && '-'}
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </p>
      </div>
      {isOverdue && (
        <AlertCircle className="w-5 h-5 ml-auto text-red-500 animate-bounce" />
      )}
    </div>
  );
}
