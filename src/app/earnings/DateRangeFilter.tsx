'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export default function DateRangeFilter({ defaultStartDate, defaultEndDate }: DateRangeFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize with defaults or undefined
  const [startDate, setStartDate] = useState<Date | undefined>(
    defaultStartDate ? new Date(defaultStartDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    defaultEndDate ? new Date(defaultEndDate) : undefined
  );
  
  // Control popover open state
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  // Update local state when URL params change
  useEffect(() => {
    setStartDate(defaultStartDate ? new Date(defaultStartDate) : undefined);
    setEndDate(defaultEndDate ? new Date(defaultEndDate) : undefined);
  }, [defaultStartDate, defaultEndDate]);

  const handleApply = () => {
    const params = new URLSearchParams();
    
    // Reset to page 1 when applying new filters
    params.set('page', '1');
    
    if (startDate) {
      params.set('startDate', format(startDate, 'yyyy-MM-dd'));
    }
    
    if (endDate) {
      params.set('endDate', format(endDate, 'yyyy-MM-dd'));
    }
    
    router.push(`/earnings?${params.toString()}`);
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    router.push('/earnings');
  };

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Start Date
          </label>
          <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setStartDateOpen(false);
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            End Date
          </label>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setEndDateOpen(false);
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply
          </Button>
          
          <Button
            onClick={handleClear}
            variant="outline"
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          >
            Clear
          </Button>
        </div>
      </div>
      
      {!startDate && !endDate && (
        <p className="text-sm text-zinc-500 mt-3">
          Leave dates empty to view earnings for the upcoming month
        </p>
      )}
    </div>
  );
}

