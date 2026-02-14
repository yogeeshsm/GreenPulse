import { useState } from 'react';
import { User, Trophy, Target, Flame, Droplets, Cloud, TrendingUp, Award, Lock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { userStats, achievements, sustainabilityTips } from '@/data/extendedData';

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High': return <span className="text-red-400">●</span>;
      case 'Medium': return <span className="text-yellow-400">●</span>;
      default: return <span className="text-green-400">●</span>;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-500/30 hover:border-teal-500/50 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center">
          <User className="w-4 h-4 text-teal-400" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs text-teal-400 font-medium">{userStats.rank}</p>
          <p className="text-xs text-slate-400">{userStats.totalScans} scans</p>
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-teal-500/20 max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5 text-teal-400" />
              Your Sustainability Dashboard
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl border border-teal-500/20">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">Eco Warrior</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-orange-400">{userStats.streakDays} day streak!</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress to {userStats.nextRank}</span>
                      <span>{userStats.progressToNext}%</span>
                    </div>
                    <Progress value={userStats.progressToNext} className="h-2 bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <Cloud className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.carbonSaved}</p>
                  <p className="text-xs text-slate-400">kg CO₂ saved</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.waterSaved.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">liters saved</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.productsSwitched}</p>
                  <p className="text-xs text-slate-400">products switched</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl text-center">
                  <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{userStats.averageScore}</p>
                  <p className="text-xs text-slate-400">avg score</p>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-xl text-center transition-all ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                          : 'bg-slate-800/50 border border-slate-700'
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <p className={`text-xs font-medium ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
                        {achievement.name}
                      </p>
                      {!achievement.unlocked && achievement.progress && (
                        <div className="mt-2">
                          <Progress value={achievement.progress} className="h-1 bg-slate-700" />
                          <p className="text-xs text-slate-500 mt-1">{achievement.progress}%</p>
                        </div>
                      )}
                      {!achievement.unlocked && !achievement.progress && (
                        <Lock className="w-4 h-4 text-slate-600 mx-auto mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainability Tips */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400" />
                  Personalized Tips
                </h4>
                <div className="space-y-2">
                  {sustainabilityTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getImpactIcon(tip.impact)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 text-xs">
                              {tip.category}
                            </span>
                            <span className={`text-xs ${tip.impact === 'High' ? 'text-red-400' : tip.impact === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                              {tip.impact} Impact
                            </span>
                          </div>
                          <p className="font-medium text-white mt-1">{tip.title}</p>
                          <p className="text-sm text-slate-400">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Button */}
              <Button className="w-full eco-button text-white gap-2">
                <Share2 className="w-4 h-4" />
                Share Your Impact
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDashboard;
