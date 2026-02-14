import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { QuickLogModal } from '@/components/QuickLogModal';
import { DailySummary } from '@/components/DailySummary';
import { MissingItemsModal } from '@/components/MissingItemsModal';
import { LedgerView } from '@/components/LedgerView';
import { QRShareModal } from '@/components/QRShareModal';
import { HeroSection } from '@/sections/HeroSection';
import { FeatureSection } from '@/sections/FeatureSection';
import { DailySummarySection } from '@/sections/DailySummarySection';
import { WeeklyInsightsSection } from '@/sections/WeeklyInsightsSection';
import { ClosingCTASection } from '@/sections/ClosingCTASection';
import { Timeline } from '@/components/Timeline';
import { MicroMoves } from '@/components/MicroMoves';
import { CarbonCreditCalculator } from '@/components/CarbonCreditCalculator';
import { CarbonFootprintCalculator } from '@/components/CarbonFootprintCalculator';
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout';
import { Communities } from '@/components/Communities';
import { ToastProvider, showToast } from '@/components/Toast';
import { useAppState } from '@/hooks/useAppState';
import { Train, Salad, Droplets, Zap, Wind, ShoppingBag, Users, Recycle, Calculator, Plane } from 'lucide-react';
import { mockWeeklyInsight } from '@/data/mockData';
import type { ActivityLog } from '@/types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [showMissingItemsCheck, setShowMissingItemsCheck] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const {
    daySession,
    activities,
    microMoves,
    showQuickLog,
    quickLogCategory,
    addActivity,
    executeMicroMove,
    closeQuickLog,
    openQuickLog,
    completeDailyClose,
    toggleGoal,
    addGoal
  } = useAppState();

  const handleAddActivity = (activity: Partial<ActivityLog>) => {
    const fullActivity: ActivityLog = {
      id: `al-${Date.now()}`,
      userId: 'user-001',
      daySessionId: daySession.id,
      timestamp: new Date(),
      activityType: activity.activityType!,
      subtype: activity.subtype!,
      quantity: activity.quantity!,
      unit: activity.unit!,
      metadata: activity.metadata!,
      calculatedImpact: activity.calculatedImpact!
    };
    addActivity(fullActivity);
    showToast(`${activity.activityType} activity logged! +${Math.round((activity.calculatedImpact?.avoidedCo2eKg || 0) * 100) / 100} kg CO₂e saved`, 'success');
    // Navigate to dashboard after logging to show updated stats
    if (currentView === 'home') {
      setCurrentView('dashboard');
    }
  };

  const handleDailyClose = () => {
    // Show missing items check first
    setShowMissingItemsCheck(true);
  };

  const handleMissingItemsContinue = () => {
    setShowMissingItemsCheck(false);
    completeDailyClose();
    setShowDailySummary(true);
    showToast('Day closed! Great job tracking your impact today! 🌿', 'success', 4000);
  };
  const handleGetStarted = () => {
    setCurrentView('dashboard');
  };

  const handleStartDay = () => {
    setCurrentView('dashboard');
  };

  const handleJoinCircle = () => {
    setCurrentView('communities');
  };

  const handleViewChange = (view: string) => {
    if (view === 'ecoscan') {
      window.open('https://eco-pulse-ai.vercel.app/', '_blank');
      return;
    }
    setCurrentView(view);
  };

  // Render different views based on currentView
  const renderView = () => {
    // Show Daily Summary modal if triggered
    if (showDailySummary) {
      return (
        <DailySummary
          daySession={daySession}
          activities={activities}
          onClose={() => setShowDailySummary(false)}
          onOpenQR={() => setShowQRModal(true)}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <Dashboard 
              daySession={daySession} 
              activities={activities}
              onQuickLog={openQuickLog} 
              onToggleGoal={toggleGoal}
              onAddGoal={addGoal}
            />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'timeline':
        return (
          <>
            <Timeline activities={activities} />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'micromoves':
        return (
          <>
            <MicroMoves moves={microMoves} onExecute={executeMicroMove} />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'insights':
        return (
          <>
            <WeeklyInsightsSection insight={mockWeeklyInsight} />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'ledger':
        return (
          <>
            <LedgerView daySessions={[daySession]} activities={activities} onOpenQR={() => setShowQRModal(true)} />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'input':
        return (
          <CalculatorLayout onBack={() => setCurrentView('dashboard')} />
        );
      case 'communities':
        return (
          <>
            <Communities onBack={() => setCurrentView('dashboard')} />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'carbon-calculator':
        return (
          <>
            <CarbonCreditCalculator />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'footprint-calculator':
        return (
          <>
            <CarbonFootprintCalculator />
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
      case 'summary':
        return (
          <>
            <DailySummary 
              daySession={daySession} 
              activities={activities}
              onClose={() => setCurrentView('home')}
              onOpenQR={() => setShowQRModal(true)}
            />
          </>
        );
      case 'home':
      default:
        return (
          <>
            {/* Hero Section */}
            <HeroSection onGetStarted={handleGetStarted} />

            {/* Feature Sections */}
            <FeatureSection
              id="transport"
              headline="Choose how you move"
              body="A quick log of your commute updates your footprint instantly—metro, bus, bike, or walk."
              cta="Log commute"
              microText="~0.4 kg CO₂e saved today"
              imageSrc="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"
              imageAlt="Eco-friendly public transportation"
              icon={Train}
              gradient="sky-gradient-noon"
              layout="left-image"
              zIndex={20}
              onCtaClick={() => openQuickLog('transport')}
            />

            <FeatureSection
              id="flights"
              headline="Track your flights"
              body="Log your air travel by class and distance. See the carbon cost of domestic, short-haul, and long-haul flights."
              cta="Log a flight"
              microText="Delhi–Mumbai economy ≈ 340 kg CO₂e"
              imageSrc="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80"
              imageAlt="Airplane in sky representing air travel"
              icon={Plane}
              gradient="sky-gradient-noon"
              layout="right-image"
              zIndex={25}
              onCtaClick={() => openQuickLog('flights')}
            />

            <FeatureSection
              id="food"
              headline="Eat lighter"
              body="Log your main meal type. Even small shifts—more plants, less waste—show up in your daily total."
              cta="Log a meal"
              microText="Tip: finishing what's on your plate counts too."
              imageSrc="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
              imageAlt="Healthy plant-based sustainable meal"
              icon={Salad}
              gradient="sky-gradient-noon"
              layout="right-image"
              zIndex={30}
              onCtaClick={() => openQuickLog('food')}
            />

            <FeatureSection
              id="water"
              headline="Use water mindfully"
              body="Shower time, tap habits, and laundry add up. Quick logs help you spot easy wins."
              cta="Log water use"
              microText="~18 L saved vs. your baseline"
              imageSrc="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80"
              imageAlt="Water conservation and sustainability"
              icon={Droplets}
              gradient="sky-gradient-afternoon"
              layout="left-image"
              zIndex={40}
              onCtaClick={() => openQuickLog('water')}
            />

            <FeatureSection
              id="energy"
              headline="Power smarter"
              body="Log AC hours, laptop use, and lights. See which habits move the needle."
              cta="Log energy"
              microText="~0.6 kWh today"
              imageSrc="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80"
              imageAlt="Renewable energy and solar panels"
              icon={Zap}
              gradient="sky-gradient-afternoon"
              layout="right-image"
              zIndex={50}
              onCtaClick={() => openQuickLog('energy')}
            />

            <FeatureSection
              id="air"
              headline="Keep the air cleaner"
              body="Your transport and energy choices reduce emissions. We translate that into a simple 'air impact' proxy—no sensors needed."
              cta="See your impact"
              microText="Based on avoided emissions today"
              imageSrc="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
              imageAlt="Clean air and green nature"
              icon={Wind}
              gradient="sky-gradient-evening"
              layout="left-image"
              zIndex={60}
              onCtaClick={() => setCurrentView('dashboard')}
            />

            <FeatureSection
              id="waste"
              headline="Waste less"
              body="Log composting, recycling, and refusals. Small wins earn points and keep material out of landfills."
              cta="Log waste action"
              microText="2 items diverted today"
              imageSrc="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80"
              imageAlt="Recycling and waste management"
              icon={Recycle}
              gradient="sky-gradient-evening"
              layout="right-image"
              zIndex={70}
              onCtaClick={() => openQuickLog('waste')}
            />

            <FeatureSection
              id="shopping"
              headline="Shop lighter"
              body="Log deliveries, packaging choices, and reuse. Fewer packages = lower footprint."
              cta="Log shopping"
              microText="Choosing thrift or repair earns bonus points."
              imageSrc="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
              imageAlt="Sustainable shopping with reusable bags"
              icon={ShoppingBag}
              gradient="sky-gradient-dusk"
              layout="left-image"
              zIndex={80}
              onCtaClick={() => openQuickLog('shopping')}
            />

            <FeatureSection
              id="community"
              headline="Build a habit together"
              body="Join a circle—family, building, or office. Compare streaks, share swaps, and stay accountable without the noise."
              cta="Start a circle"
              microText="Join an existing circle"
              imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              imageAlt="Community working together for sustainability"
              icon={Users}
              gradient="sky-gradient-dusk"
              layout="right-image"
              zIndex={90}
              onCtaClick={() => setCurrentView('communities')}
            />

            <FeatureSection
              id="carbon-credits"
              headline="Offset your carbon footprint"
              body="Calculate your carbon credits needed and explore verified offset providers to achieve carbon neutrality for your activities."
              cta="Calculate Credits"
              microText="Carbon credit pricing from verified providers"
              imageSrc="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80"
              imageAlt="Carbon offset and environmental conservation"
              icon={Calculator}
              gradient="sky-gradient-night"
              layout="left-image"
              zIndex={100}
              onCtaClick={() => setCurrentView('footprint-calculator')}
            />

            {/* Daily Summary */}
            <DailySummarySection 
              daySession={daySession}
              onViewLedger={() => setCurrentView('ledger')}
              onShareSummary={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My GreenPulse Daily Summary',
                    text: `Today I saved ${daySession.totals.co2eKg.toFixed(1)}kg CO₂e, used ${daySession.totals.kwh.toFixed(1)}kWh, ${daySession.totals.waterLiters}L water, and diverted ${daySession.totals.wasteDiverted} waste items! 🌿`,
                    url: window.location.href
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(
                    `GreenPulse Summary: ${daySession.totals.co2eKg.toFixed(1)}kg CO₂e saved, ${daySession.totals.kwh.toFixed(1)}kWh, ${daySession.totals.waterLiters}L water, ${daySession.totals.wasteDiverted} items diverted 🌿`
                  );
                  showToast('Summary copied to clipboard!', 'success');
                }
              }}
            />

            {/* Weekly Insights */}
            <WeeklyInsightsSection insight={mockWeeklyInsight} />

            {/* Closing CTA */}
            <ClosingCTASection onStartDay={handleStartDay} onJoinCircle={handleJoinCircle} />
          </>
        );
    }
  };

  return (
    <ToastProvider>
    <div className="min-h-screen bg-[#F6F8F6]">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <Navigation currentView={currentView} onViewChange={handleViewChange} daySession={daySession} />

      {/* Main Content */}
      <main className="relative">
        {renderView()}
      </main>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={showQuickLog}
        category={quickLogCategory}
        onClose={closeQuickLog}
        onLog={handleAddActivity}
      />

      {/* Missing Items Check Modal */}
      <MissingItemsModal
        isOpen={showMissingItemsCheck}
        activities={activities}
        onContinue={handleMissingItemsContinue}
        onFillMissing={(category) => {
          setShowMissingItemsCheck(false);
          openQuickLog(category);
        }}
        onClose={() => setShowMissingItemsCheck(false)}
      />

      {/* QR Share Modal */}
      <QRShareModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        daySession={daySession}
        activities={activities}
      />

      {/* Floating Action Button (Mobile) - only on non-home views */}
      {currentView !== 'home' && (
        <button
          onClick={() => openQuickLog('transport')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#22C55E] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40"
          title="Quick Log"
        >
          <span className="text-white text-2xl font-light">+</span>
        </button>
      )}

      {/* Daily Close Button - only on dashboard/timeline */}
      {(currentView === 'dashboard' || currentView === 'timeline') && (
        <button
          onClick={handleDailyClose}
          className="fixed bottom-6 right-6 px-6 py-3 bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-medium rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform z-40"
        >
          <span>End Day</span>
          <span className="text-xl">✨</span>
        </button>
      )}
    </div>
    </ToastProvider>
  );
}

export default App;
