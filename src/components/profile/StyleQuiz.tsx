import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import type { UserProfile, BodyShape, SkinTone, Budget, FitPreference, AccessoryLevel, StyleLabel, Occasion } from '../../types';

interface Props {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export function StyleQuiz({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const q = QUIZ_QUESTIONS[step];
  const isMulti = q.id === 3;
  const currentAnswer = answers[q.id] || (isMulti ? [] : '');

  const setAnswer = (value: string) => {
    if (isMulti) {
      const arr = (currentAnswer as string[]);
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      setAnswers({ ...answers, [q.id]: next });
    } else {
      setAnswers({ ...answers, [q.id]: value });
    }
  };

  const handleNext = () => {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(buildProfile(answers));
    }
  };

  const isSelected = (v: string) =>
    isMulti ? (currentAnswer as string[]).includes(v) : currentAnswer === v;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>
        <span className="text-xs text-gray-400">{step + 1}/{QUIZ_QUESTIONS.length}</span>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold">{q.question}</h3>
      {isMulti && <p className="text-xs text-gray-400">可多选</p>}

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setAnswer(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
              isSelected(opt.value)
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={isMulti ? (currentAnswer as string[]).length === 0 : !currentAnswer}
        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
      >
        {step < QUIZ_QUESTIONS.length - 1 ? '下一题' : '完成测试'}
      </button>
    </div>
  );
}

function buildProfile(answers: Record<number, string | string[]>): Partial<UserProfile> {
  const q1 = answers[1] as string || 'rectangle';
  const q4 = answers[4] as string || 'minimalist';
  const q11 = answers[11] as string || 'neutral';
  const q15 = answers[15] as string || 'mid';
  const q8 = answers[8] as string || 'minimal';

  // Count style votes from q4-q6
  const styleVotes: Record<string, number> = { minimalist: 0, sweet: 0, tomboy: 0, street: 0, elegant: 0, sporty: 0 };
  [answers[4], answers[5], answers[6]].forEach((v) => {
    if (typeof v === 'string' && v in styleVotes) styleVotes[v]++;
  });
  const sorted = Object.entries(styleVotes).sort((a, b) => b[1] - a[1]);

  return {
    body: {
      shape: q1 as BodyShape,
      heightRange: 'average',
      highlightAreas: [],
      downplayAreas: Array.isArray(answers[3]) ? answers[3] as string[] : [],
    },
    color: {
      skinTone: q11 as SkinTone,
      hairColor: '',
      avoidColors: [],
    },
    styleProfile: {
      primaryStyle: sorted[0][0] as StyleLabel,
      secondaryStyle: sorted[1]?.[0] as StyleLabel || 'minimalist',
      styleScores: Object.fromEntries(sorted) as Record<StyleLabel, number>,
    },
    lifestyle: {
      workEnv: (answers[12] as string) || '',
      weekendActivity: (answers[13] as string) || '',
      topOccasions: [(answers[14] as string) || 'casual'] as Occasion[],
      budget: q15 as Budget,
    },
    preferences: {
      patternPreference: [],
      fitPreference: 'regular' as FitPreference,
      accessoryLevel: q8 as AccessoryLevel,
    },
  };
}
