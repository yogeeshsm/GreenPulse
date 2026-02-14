import { useState } from 'react';
import { Users, Globe, Leaf, TreePine, Droplets, Zap, ArrowRight, Crown, Medal, Star, UserPlus, Check, Search, MapPin, TrendingUp } from 'lucide-react';

interface Circle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  members: number;
  category: 'neighborhood' | 'workplace' | 'school' | 'interest' | 'challenge';
  co2SavedKg: number;
  activitiesToday: number;
  topMembers: { name: string; avatar: string; score: number }[];
  isJoined: boolean;
  color: string;
  location?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  circleId: string;
  circleName: string;
  daysLeft: number;
  participants: number;
  targetKg: number;
  currentKg: number;
  reward: string;
}

const INITIAL_CIRCLES: Circle[] = [
  {
    id: 'c1',
    name: 'Green Bengaluru',
    description: 'Bengaluru residents working together to make our city greener. Share tips, track collective impact, and join local clean-up drives.',
    icon: <TreePine className="w-6 h-6" />,
    members: 1247,
    category: 'neighborhood',
    co2SavedKg: 8450,
    activitiesToday: 89,
    topMembers: [
      { name: 'Priya S.', avatar: 'PS', score: 2840 },
      { name: 'Rahul M.', avatar: 'RM', score: 2510 },
      { name: 'Ananya K.', avatar: 'AK', score: 2390 },
    ],
    isJoined: true,
    color: 'emerald',
    location: 'Bengaluru, KA',
  },
  {
    id: 'c2',
    name: 'Zero Waste Kitchen',
    description: 'Learn to reduce food waste, compost effectively, and cook sustainably. Weekly challenges and recipe sharing!',
    icon: <Leaf className="w-6 h-6" />,
    members: 834,
    category: 'interest',
    co2SavedKg: 3200,
    activitiesToday: 45,
    topMembers: [
      { name: 'Meera R.', avatar: 'MR', score: 1980 },
      { name: 'Vikram P.', avatar: 'VP', score: 1760 },
      { name: 'Sana J.', avatar: 'SJ', score: 1590 },
    ],
    isJoined: false,
    color: 'lime',
  },
  {
    id: 'c3',
    name: 'Water Warriors',
    description: 'Track water usage, share conservation tips, and compete to save the most water in your community.',
    icon: <Droplets className="w-6 h-6" />,
    members: 612,
    category: 'challenge',
    co2SavedKg: 1850,
    activitiesToday: 32,
    topMembers: [
      { name: 'Arjun D.', avatar: 'AD', score: 1540 },
      { name: 'Kavya N.', avatar: 'KN', score: 1320 },
      { name: 'Ravi T.', avatar: 'RT', score: 1180 },
    ],
    isJoined: false,
    color: 'sky',
  },
  {
    id: 'c4',
    name: 'EV Riders India',
    description: 'Electric vehicle enthusiasts sharing charging spots, range tips, and tracking emissions saved by going electric.',
    icon: <Zap className="w-6 h-6" />,
    members: 1589,
    category: 'interest',
    co2SavedKg: 12400,
    activitiesToday: 112,
    topMembers: [
      { name: 'Karthik B.', avatar: 'KB', score: 3200 },
      { name: 'Neha G.', avatar: 'NG', score: 2870 },
      { name: 'Suresh L.', avatar: 'SL', score: 2640 },
    ],
    isJoined: false,
    color: 'amber',
  },
  {
    id: 'c5',
    name: 'Campus Green Club',
    description: 'University students and faculty tracking campus sustainability. Competitions between departments and dorms.',
    icon: <Globe className="w-6 h-6" />,
    members: 456,
    category: 'school',
    co2SavedKg: 980,
    activitiesToday: 28,
    topMembers: [
      { name: 'Aisha M.', avatar: 'AM', score: 890 },
      { name: 'Dev P.', avatar: 'DP', score: 780 },
      { name: 'Zara K.', avatar: 'ZK', score: 720 },
    ],
    isJoined: false,
    color: 'violet',
    location: 'IIT Madras',
  },
  {
    id: 'c6',
    name: 'Eco Office - TechPark',
    description: 'Colleagues at TechPark reducing workplace carbon footprint. Carpool matching, energy audits, and green challenges.',
    icon: <Users className="w-6 h-6" />,
    members: 328,
    category: 'workplace',
    co2SavedKg: 2100,
    activitiesToday: 41,
    topMembers: [
      { name: 'Amit S.', avatar: 'AS', score: 1450 },
      { name: 'Pooja R.', avatar: 'PR', score: 1280 },
      { name: 'Rohan V.', avatar: 'RV', score: 1100 },
    ],
    isJoined: true,
    color: 'teal',
    location: 'Manyata TechPark',
  },
];

const CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    title: '7-Day No Plastic Challenge',
    description: 'Avoid single-use plastics for a full week. Log every plastic-free choice!',
    circleId: 'c1',
    circleName: 'Green Bengaluru',
    daysLeft: 4,
    participants: 189,
    targetKg: 0.5,
    currentKg: 0.32,
    reward: '🏆 Plastic-Free Hero Badge',
  },
  {
    id: 'ch2',
    title: 'Bucket Bath Week',
    description: 'Switch from shower to bucket bath for 7 days. Track your water savings!',
    circleId: 'c3',
    circleName: 'Water Warriors',
    daysLeft: 6,
    participants: 94,
    targetKg: 200,
    currentKg: 78,
    reward: '💧 Water Saver Badge',
  },
  {
    id: 'ch3',
    title: 'Carpool February',
    description: 'Share rides to work this month. Every shared trip counts!',
    circleId: 'c6',
    circleName: 'Eco Office - TechPark',
    daysLeft: 14,
    participants: 67,
    targetKg: 50,
    currentKg: 22,
    reward: '🚗 Carpool Champion Badge',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  neighborhood: 'Neighborhood',
  workplace: 'Workplace',
  school: 'School / Campus',
  interest: 'Interest Group',
  challenge: 'Challenge',
};

const COLOR_MAP: Record<string, { bg: string; text: string; badge: string; border: string; light: string }> = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
  lime: { bg: 'bg-lime-500', text: 'text-lime-600', badge: 'bg-lime-100 text-lime-700', border: 'border-lime-200', light: 'bg-lime-50' },
  sky: { bg: 'bg-sky-500', text: 'text-sky-600', badge: 'bg-sky-100 text-sky-700', border: 'border-sky-200', light: 'bg-sky-50' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
  violet: { bg: 'bg-violet-500', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200', light: 'bg-violet-50' },
  teal: { bg: 'bg-teal-500', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-700', border: 'border-teal-200', light: 'bg-teal-50' },
};

export function Communities({ onBack }: { onBack: () => void }) {
  const [circles, setCircles] = useState<Circle[]>(INITIAL_CIRCLES);
  const [activeTab, setActiveTab] = useState<'discover' | 'my-circles' | 'challenges'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCircle, setExpandedCircle] = useState<string | null>(null);

  const handleJoinCircle = (circleId: string) => {
    setCircles(prev =>
      prev.map(c => c.id === circleId ? { ...c, isJoined: !c.isJoined, members: c.isJoined ? c.members - 1 : c.members + 1 } : c)
    );
  };

  const myCircles = circles.filter(c => c.isJoined);
  const filteredCircles = circles.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCo2Saved = myCircles.reduce((sum, c) => sum + c.co2SavedKg, 0);
  const totalMembers = myCircles.reduce((sum, c) => sum + c.members, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Community Circles
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join a Circle</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Connect with like-minded people, take on challenges together, and multiply your environmental impact.
          </p>
        </div>

        {/* Stats Bar */}
        {myCircles.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-emerald-600">{myCircles.length}</p>
              <p className="text-xs text-gray-500 mt-1">My Circles</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-emerald-600">{totalMembers.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Fellow Members</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-emerald-600">{(totalCo2Saved / 1000).toFixed(1)}t</p>
              <p className="text-xs text-gray-500 mt-1">CO₂ Saved Together</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {[
            { key: 'discover', label: 'Discover', icon: Search },
            { key: 'my-circles', label: `My Circles (${myCircles.length})`, icon: Users },
            { key: 'challenges', label: 'Challenges', icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search & Filter */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search circles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Circle Cards */}
            <div className="space-y-4">
              {filteredCircles.map(circle => {
                const colors = COLOR_MAP[circle.color] || COLOR_MAP.emerald;
                const isExpanded = expandedCircle === circle.id;

                return (
                  <div
                    key={circle.id}
                    className={`bg-white rounded-2xl border ${colors.border} shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-emerald-200' : 'hover:shadow-md'}`}
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => setExpandedCircle(isExpanded ? null : circle.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center ${colors.text}`}>
                            {circle.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{circle.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                                {CATEGORY_LABELS[circle.category]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{circle.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {circle.members.toLocaleString()} members</span>
                              <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5" /> {circle.co2SavedKg.toLocaleString()} kg saved</span>
                              {circle.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {circle.location}</span>}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleJoinCircle(circle.id); }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                            circle.isJoined
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-red-50 hover:text-red-600'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {circle.isJoined ? (
                            <><Check className="w-4 h-4" /> Joined</>
                          ) : (
                            <><UserPlus className="w-4 h-4" /> Join</>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded leaderboard */}
                    {isExpanded && (
                      <div className={`${colors.light} border-t ${colors.border} p-5`}>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-500" /> Leaderboard — Top Members
                        </h4>
                        <div className="space-y-2">
                          {circle.topMembers.map((member, index) => (
                            <div key={member.name} className="flex items-center gap-3 bg-white/70 rounded-xl px-4 py-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0 ? 'bg-amber-100 text-amber-700' :
                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>
                                {index === 0 ? <Crown className="w-4 h-4" /> : index === 1 ? <Medal className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                              </div>
                              <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-xs font-semibold text-emerald-800">
                                {member.avatar}
                              </div>
                              <span className="flex-1 text-sm font-medium text-gray-700">{member.name}</span>
                              <span className={`text-sm font-bold ${colors.text}`}>{member.score.toLocaleString()} pts</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="bg-white/70 rounded-xl p-3 text-center">
                            <p className={`text-lg font-bold ${colors.text}`}>{circle.activitiesToday}</p>
                            <p className="text-xs text-gray-500">Activities Today</p>
                          </div>
                          <div className="bg-white/70 rounded-xl p-3 text-center">
                            <p className={`text-lg font-bold ${colors.text}`}>{(circle.co2SavedKg / circle.members).toFixed(1)} kg</p>
                            <p className="text-xs text-gray-500">Avg per Member</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredCircles.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No circles found</p>
                  <p className="text-sm mt-1">Try a different search or category</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* My Circles Tab */}
        {activeTab === 'my-circles' && (
          <div>
            {myCircles.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium text-lg">No circles yet</p>
                <p className="text-sm mt-1 mb-4">Discover and join circles to start collaborating!</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Explore Circles
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myCircles.map(circle => {
                  const colors = COLOR_MAP[circle.color] || COLOR_MAP.emerald;
                  return (
                    <div key={circle.id} className={`bg-white rounded-2xl border ${colors.border} shadow-sm p-5`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center ${colors.text}`}>
                          {circle.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{circle.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>{circle.members.toLocaleString()} members</span>
                            <span>{circle.activitiesToday} active today</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${colors.text}`}>{circle.co2SavedKg.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">kg CO₂ saved</p>
                        </div>
                      </div>

                      {/* Quick leaderboard preview */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400 mr-1">Top:</span>
                        {circle.topMembers.slice(0, 3).map((member, i) => (
                          <div key={member.name} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1">
                            <div className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-800">
                              {member.avatar}
                            </div>
                            <span className="text-xs text-gray-600">{member.name.split(' ')[0]}</span>
                            <span className="text-xs font-medium text-emerald-600">{member.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Active Challenges</h2>
              <span className="text-sm text-gray-400">{CHALLENGES.length} ongoing</span>
            </div>

            {CHALLENGES.map(challenge => {
              const progress = Math.min((challenge.currentKg / challenge.targetKg) * 100, 100);

              return (
                <div key={challenge.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium">
                      {challenge.daysLeft}d left
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{challenge.currentKg} / {challenge.targetKg} kg</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {challenge.participants} participants</span>
                      <span>by {challenge.circleName}</span>
                    </div>
                    <span className="text-sm">{challenge.reward}</span>
                  </div>
                </div>
              );
            })}

            {/* Global Impact */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white mt-6">
              <h3 className="text-lg font-bold mb-1">Global Community Impact</h3>
              <p className="text-emerald-100 text-sm mb-4">All GreenPulse circles combined</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold">5,066</p>
                  <p className="text-xs text-emerald-200">Total Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">28.9t</p>
                  <p className="text-xs text-emerald-200">CO₂ Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">347</p>
                  <p className="text-xs text-emerald-200">Active Today</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
