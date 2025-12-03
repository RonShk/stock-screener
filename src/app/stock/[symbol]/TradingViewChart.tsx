'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider';

interface TradingViewChartProps {
  symbol: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: theme === 'dark' ? 'dark' : 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: theme === 'dark' ? '#18181b' : '#ffffff',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: 'tradingview_chart',
          hide_side_toolbar: false,
          allow_symbol_change: false,
          studies: [],
          show_popup_button: false,
          popup_width: '1000',
          popup_height: '650',
          backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
          gridColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
          withdateranges: true,
          range: '1D',
          hide_volume: false,
          support_host: 'https://www.tradingview.com'
        });
      }
    };

    const container = document.createElement('div');
    container.id = 'tradingview_chart';
    container.style.height = '450px';
    container.style.width = '100%';
    
    containerRef.current.appendChild(container);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, theme]);

  return (
    <div className="relative w-full h-[450px]" ref={containerRef}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading chart...
        </div>
      </div>
    </div>
  );
}

