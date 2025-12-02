import { getEarningsCalendar, EarningsEntry } from '@/utils/fmp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Earnings Calendar | Stock Screener Hub',
  description: 'Upcoming earnings reports calendar, analyst estimates, and historical data.',
};

function formatMoney(value: number | null) {
  if (value === null) return '-';
  
  // For billions
  if (Math.abs(value) >= 1.0e9) {
    return `$${(value / 1.0e9).toFixed(2)}B`;
  }
  // For millions
  if (Math.abs(value) >= 1.0e6) {
    return `$${(value / 1.0e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function formatTime(time: string | undefined) {
  if (!time) return 'TBD';
  switch (time) {
    case 'bmo': return 'Before Market';
    case 'amc': return 'After Close';
    case 'ime': return 'During Market';
    default: return time.toUpperCase();
  }
}

function TimeBadge({ time }: { time?: string }) {
  if (!time) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-zinc-50 text-zinc-500 border-zinc-200">
        TBD
      </span>
    );
  }
  
  const styles = {
    bmo: 'bg-blue-50 text-blue-700 border-blue-200',
    amc: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    ime: 'bg-zinc-50 text-zinc-700 border-zinc-200',
  };
  
  const style = styles[time as keyof typeof styles] || styles.ime;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {formatTime(time)}
    </span>
  );
}

export default async function EarningsPage() {
  // Fetch upcoming earnings for the next 2 weeks
  const earnings = await getEarningsCalendar();

  // Group by date for better display
  const groupedEarnings = earnings.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, EarningsEntry[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedEarnings).sort();

  return (
    <div className="min-h-screen bg-zinc-50/50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Earnings Calendar</h1>
          <p className="mt-2 text-zinc-600">
            Upcoming earnings reports for the next 14 days.
          </p>
        </div>

        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900">No upcoming earnings found</h3>
            <p className="mt-1 text-zinc-500">Check back later or verify your API key.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date) => (
              <div key={date} className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="bg-zinc-50/80 px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
                  <h2 className="font-semibold text-lg text-zinc-900">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    })}
                  </h2>
                  <span className="text-sm text-zinc-500 font-medium bg-white px-3 py-1 rounded-full border border-zinc-200">
                    {groupedEarnings[date].length} Companies
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/30 border-b border-zinc-100">
                      <tr>
                        <th className="px-6 py-3 font-medium">Symbol</th>
                        <th className="px-6 py-3 font-medium">Time</th>
                        <th className="px-6 py-3 font-medium text-right">Est. EPS</th>
                        <th className="px-6 py-3 font-medium text-right">Est. Revenue</th>
                        <th className="px-6 py-3 font-medium text-right">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {groupedEarnings[date].map((item) => (
                        <tr key={item.symbol} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-900">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {item.symbol[0]}
                              </div>
                              {item.symbol}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <TimeBadge time={item.time} />
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-zinc-600">
                            {item.epsEstimated !== null ? `$${item.epsEstimated.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-zinc-600">
                            {formatMoney(item.revenueEstimated)}
                          </td>
                          <td className="px-6 py-4 text-right text-zinc-500">
                            {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


