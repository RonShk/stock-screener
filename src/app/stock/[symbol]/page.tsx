import { getCompanyProfile } from '@/utils/fmp';
import { formatMoney, formatVolume } from '@/utils/format';
import { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft } from 'lucide-react';
import TradingViewChart from './TradingViewChart';

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol.toUpperCase()} Stock Details | FinDash`,
    description: `Detailed information and charts for ${symbol.toUpperCase()}`,
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const profile = await getCompanyProfile(symbol.toUpperCase());

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/earnings"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Earnings
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-2">
              Stock not found
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Unable to load data for {symbol.toUpperCase()}. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const change = profile.change ?? 0;
  const changePercentage = profile.changePercentage ?? 0;
  const isPositive = change >= 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Back Button and Theme Toggle */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/earnings"
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Earnings
          </Link>
          <ThemeToggle />
        </div>

        {/* Stock Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {profile.companyName} ({profile.symbol})
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Data is delayed by 15 minutes.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                + Add to Watchlist
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors">
                Trade
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              {/* Price Display */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                  ${profile.price.toFixed(2)}
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercentage.toFixed(2)}%) Today
                </div>
              </div>

              {/* TradingView Chart */}
              <TradingViewChart symbol={profile.symbol} />
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* More Statistics */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                More Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Market Cap</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatMoney(profile.marketCap)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Volume (Daily)</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatVolume(profile.volume)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Avg. Volume</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatVolume(profile.averageVolume)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Day&apos;s Change</span>
                  <span className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? '+' : ''}${change.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Change %</span>
                  <span className={`text-sm font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? '+' : ''}{changePercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Company Info
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">52-Week Range</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {profile.range || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Industry</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 text-right">
                    {profile.industry || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">Sector</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {profile.sector || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            About {profile.companyName}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {profile.description || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
}

