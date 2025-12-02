import { getEarningsCalendar, EarningsEntry } from '@/utils/fmp';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import DateRangeFilter from './DateRangeFilter';

export const metadata: Metadata = {
  title: 'Upcoming Earnings Reports | FinDash',
  description: 'Upcoming earnings reports calendar, analyst estimates, and historical data.',
};

function formatMoney(value: number | null) {
  if (value === null) return '-';
  
  // For billions
  if (Math.abs(value) >= 1.0e9) {
    return `$${(value / 1.0e9).toFixed(1)}B`;
  }
  // For millions
  if (Math.abs(value) >= 1.0e6) {
    return `$${(value / 1.0e6).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function formatReportDate(date: string): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function EarningsPagination({ 
  currentPage = 1, 
  totalPages = 1, 
  startDate, 
  endDate 
}: { 
  currentPage?: number; 
  totalPages?: number;
  startDate?: string;
  endDate?: string;
}) {
  if (totalPages <= 1) return null;
  
  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return `/earnings?${params.toString()}`;
  };
  
  const pages = [];
  
  // Always show first page
  if (currentPage > 3) {
    pages.push(1);
    if (currentPage > 4) pages.push('ellipsis-start');
  }
  
  // Show pages around current page
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Always show last page
  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) pages.push('ellipsis-end');
    pages.push(totalPages);
  }
  
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? buildUrl(currentPage - 1) : '#'} 
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} 
          />
        </PaginationItem>
        
        {pages.map((page, idx) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          
          return (
            <PaginationItem key={page}>
              <PaginationLink href={buildUrl(page as number)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        
        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? buildUrl(currentPage + 1) : '#'} 
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} 
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

interface EarningsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EarningsPage({ searchParams }: EarningsPageProps) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;
  
  // Parse date range from URL params
  const startDateParam = typeof params.startDate === 'string' ? params.startDate : undefined;
  const endDateParam = typeof params.endDate === 'string' ? params.endDate : undefined;
  
  // Parse page number from URL params
  const pageParam = typeof params.page === 'string' ? params.page : '1';
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);
  
  const startDate = startDateParam ? new Date(startDateParam) : undefined;
  const endDate = endDateParam ? new Date(endDateParam) : undefined;
  
  // Fetch earnings with optional date range
  const allEarnings = await getEarningsCalendar(startDate, endDate);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allEarnings.length / itemsPerPage);
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const earnings = allEarnings.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Upcoming Earnings Reports</h1>
          <p className="text-zinc-600 mt-2">
            {startDateParam && endDateParam
              ? `Showing earnings from ${new Date(startDateParam).toLocaleDateString()} to ${new Date(endDateParam).toLocaleDateString()}`
              : 'Showing earnings for the upcoming month'}
          </p>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          defaultStartDate={startDateParam}
          defaultEndDate={endDateParam}
        />

        {/* Results Summary */}
        {allEarnings.length > 0 && (
          <div className="mb-4 text-sm text-zinc-600">
            Showing {startIndex + 1}-{Math.min(endIndex, allEarnings.length)} of {allEarnings.length} earnings reports
          </div>
        )}

        {/* Earnings Table */}
        {earnings.length === 0 && allEarnings.length === 0 ? (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No upcoming earnings found</h3>
            <p className="text-zinc-500">Check back later or verify your API key.</p>
          </div>
        ) : earnings.length === 0 ? (
          <div className="bg-white rounded-lg border border-zinc-200 p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No results on this page</h3>
            <p className="text-zinc-500">Try going back to page 1 or adjusting your filters.</p>
          </div>
        ) : (
          <div className="w-full">
            {/* Table Headers - Outside the table, matching background */}
            <div className="w-full overflow-x-auto bg-zinc-50">
              <table className="w-full caption-bottom text-sm table-fixed">
                <colgroup>
                  <col className="w-[24%]" />
                  <col className="w-[10%]" />
                  <col className="w-[22%]" />
                  <col className="w-[12%]" />
                  <col className="w-[16%]" />
                  <col className="w-[16%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="pl-4 pr-0 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      COMPANY
                    </th>
                    <th className="pl-2 pr-1 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      TICKER
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      REPORT DATE
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      EST. EPS
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      EST. REVENUE
                    </th>
                    <th className="px-3 pr-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            
            {/* Table Body */}
            <div className="w-full bg-white rounded-lg border border-zinc-200 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full caption-bottom text-sm table-fixed">
                  <colgroup>
                    <col className="w-[24%]" />
                    <col className="w-[10%]" />
                    <col className="w-[22%]" />
                    <col className="w-[12%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                  </colgroup>
                  <tbody>
                  {earnings.map((item) => (
                    <tr key={`${item.symbol}-${item.date}`} className="border-b border-zinc-200 last:border-b-0 hover:bg-zinc-50/50 transition-colors">
                      <td className="py-4 pl-4 pr-0">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {item.symbol[0]}
                          </div>
                          <span className="font-medium text-zinc-900">{item.symbol}</span>
                        </div>
                      </td>
                      <td className="py-4 pl-2 pr-1 text-zinc-600">
                        {item.symbol}
                      </td>
                      <td className="py-4 px-3 text-zinc-600">
                        {formatReportDate(item.date)}
                      </td>
                      <td className="py-4 px-3 text-zinc-600">
                        {item.epsEstimated !== null ? `$${item.epsEstimated.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-4 px-3 font-bold text-zinc-900">
                        {formatMoney(item.revenueEstimated)}
                      </td>
                      <td className="py-4 px-3">
                        <Link
                          href={`/earnings/${item.symbol}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            
            {/* Pagination */}
            <EarningsPagination 
              currentPage={currentPage} 
              totalPages={totalPages}
              startDate={startDateParam}
              endDate={endDateParam}
            />
          </div>
        )}
      </div>
    </div>
  );
}
