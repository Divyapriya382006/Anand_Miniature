import React, { useEffect, useRef } from 'react';
import { LeaderboardItem } from '../types';
import { Trophy, Star, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  publicLeaderboard: LeaderboardItem[];
  adminLeaderboard?: LeaderboardItem[];
  isAdmin?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  publicLeaderboard, 
  adminLeaderboard, 
  isAdmin 
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-slide-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = sectionRef.current?.querySelectorAll('.leaderboard-item');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [publicLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 2:
        return <Trophy className="w-7 h-7 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    const colors = {
      1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      2: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      3: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
    };
    
    return colors[rank as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const leaderboard = isAdmin && adminLeaderboard ? adminLeaderboard : publicLeaderboard;

  if (leaderboard.length === 0) {
    return (
      <section id="leaderboard" className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Best Sellers — Crowd Favourites
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            (ranks only)
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No sales data available yet. Start selling to see your top products here!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="leaderboard" ref={sectionRef} className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Best Sellers — Crowd Favourites
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {isAdmin ? 'Admin View: Complete Sales Data' : '(ranks only)'}
          </p>
        </div>

        <div className="space-y-6">
          {leaderboard.map((item, index) => (
            <div
              key={item.id}
              className={`leaderboard-item opacity-0 transform translate-y-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                item.rank === 1 ? 'ring-2 ring-yellow-400 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-6">
                {/* Rank Badge */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRankBadge(item.rank)} shadow-lg`}>
                  <span className="text-2xl font-bold">#{item.rank}</span>
                </div>

                {/* Trophy Icon */}
                <div className="flex-shrink-0">
                  {getRankIcon(item.rank)}
                </div>

                {/* Product Image */}
                {item.thumb && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={item.thumb}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Top Seller
                    </span>
                    {isAdmin && (
                      <>
                        <span>Units Sold: {item.units_sold}</span>
                        <span>Revenue: ₹{item.total_revenue?.toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Rank Animation */}
                <div className="text-right">
                  <div className={`text-4xl font-bold ${
                    item.rank === 1 ? 'text-yellow-500' :
                    item.rank === 2 ? 'text-gray-400' :
                    'text-amber-600'
                  }`}>
                    #{item.rank}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.rank === 1 ? 'Champion' :
                     item.rank === 2 ? 'Runner-up' :
                     'Third Place'}
                  </div>
                </div>
              </div>

              {/* Special Effects for #1 */}
              {item.rank === 1 && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Most Popular Product
                    <Star className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Rankings based on total sales</span>
            </div>
            {!isAdmin && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Star className="w-4 h-4" />
                <span>Public view shows ranks only</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Leaderboard;