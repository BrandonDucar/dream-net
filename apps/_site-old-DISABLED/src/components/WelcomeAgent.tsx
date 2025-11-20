import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useFirstVisit } from "../hooks/useFirstVisit";

interface WelcomeStep {
  id: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    href: string;
  };
}

const welcomeSteps: WelcomeStep[] = [
  {
    id: "welcome",
    title: "Welcome to DreamNet",
    description: "A living mesh where dreams evolve into autonomous products on Base.",
    cta: {
      label: "Let's explore",
      href: "#next",
    },
  },
  {
    id: "rewards",
    title: "Earn DREAM Tokens",
    description: "Claim daily rewards, track streaks, and compete on leaderboards. Your journey starts with earning DREAM.",
    cta: {
      label: "Go to Rewards Hub",
      href: "/miniapps/rewards",
    },
  },
  {
    id: "miniapps",
    title: "Explore Mini Apps",
    description: "Discover our ecosystem of autonomous mini apps. Each one serves a unique purpose in the DreamNet mesh.",
    cta: {
      label: "Browse Mini Apps",
      href: "/miniapps",
    },
  },
  {
    id: "agents",
    title: "Meet the Agents",
    description: "DreamNet is powered by 143+ specialized AI agents. Each agent has unique capabilities that bring dreams to life.",
    cta: {
      label: "Explore Agents",
      href: "/agents",
    },
  },
  {
    id: "ready",
    title: "You're Ready!",
    description: "Start your journey. Claim your first rewards, explore mini apps, or dive into the agent mesh.",
  },
];

export function WelcomeAgent() {
  const { isFirstVisit, dismiss } = useFirstVisit();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  if (!isFirstVisit) return null;

  const current = welcomeSteps[currentStep];
  const progress = ((currentStep + 1) / welcomeSteps.length) * 100;

  const handleNext = () => {
    if (current.cta?.href === "#next") {
      setCurrentStep((prev) => prev + 1);
    } else if (current.cta?.href.startsWith("#")) {
      // Anchor link - scroll and continue
      const element = document.querySelector(current.cta.href);
      element?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => setCurrentStep((prev) => prev + 1), 500);
    } else {
      // External link - mark complete and navigate
      setCompletedSteps((prev) => new Set(prev).add(current.id));
      window.location.href = current.cta!.href;
    }
  };

  const handleSkip = () => {
    dismiss();
  };

  const handleComplete = () => {
    setCompletedSteps((prev) => new Set(prev).add(current.id));
    dismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-cyan-500/30 max-w-lg w-full p-8 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {welcomeSteps.length}
            </span>
            <span className="text-sm text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-black mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {current.title}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">{current.description}</p>
        </div>

        {/* Completed Steps Indicator */}
        {completedSteps.size > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {welcomeSteps.map((step) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  completedSteps.has(step.id) || currentStep > welcomeSteps.indexOf(step)
                    ? "bg-cyan-400"
                    : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {currentStep < welcomeSteps.length - 1 ? (
            <>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold text-gray-300 transition-colors"
              >
                Skip Tour
              </button>
              {current.cta ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  {current.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              Start Exploring
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

