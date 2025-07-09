
"use client";

import { useEffect } from 'react';
import { TimerIcon } from 'lucide-react';
import { useConsultationTimer } from '@/hooks/useConsultationTimer';
import { Badge } from '@/components/ui/badge';

export default function ConsultationTimer() {
  const { formattedTime, isRunning } = useConsultationTimer();

  // Removed useEffect that controlled timer. Timer is now controlled from dashboard page.

  return (
    <div className="flex items-center gap-2">
      <TimerIcon className="h-5 w-5 text-primary" />
      <Badge variant={isRunning ? "default" : "secondary"} className="px-3 py-1 text-sm font-mono">
        {formattedTime}
      </Badge>
    </div>
  );
}
