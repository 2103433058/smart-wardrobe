import { useState, useCallback } from 'react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import type { UserProfile, BodyShape, SkinTone, Budget, AccessoryLevel, StyleLabel, Occasion } from '../../types';

const ALL_STYLES: StyleLabel[] = ['minimalist','sweet','tomboy','street','elegant','sporty','bohemian','vintage','luxury','avant-garde'];

interface Props {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export function StyleQuiz({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[step];
  if (!q) return <div className="text-red-400 text-sm">题目加载失败</div>;
  const isMulti = q.id === 3;
  const currentAnswer = answers[q.id] || (isMulti ? [] : '');

  const setAnswer = useCallback((value: string) => {
    setAnswers((prev) => {
      const cur = prev[q.id];
      if (isMulti) {
        const arr = (Array.isArray(cur) ? cur : []) as string[];
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
        return { ...prev, [q.id]: next };
      }
      return { ...prev, [q.id]: value };
    });
  }, [q.id, isMulti]);

  const handleNext = useCallback(() => {
    if (done) return;
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      setDone(true);
      onComplete(buildProfile(answers));
    }
  }, [step, answers, done, onComplete]);

  const isSelected = (v: string) =>
    isMulti ? ((currentAnswer as string[]) || []).includes(v) : currentAnswer === v;

  const canProceed = isMulti ? ((currentAnswer as string[]) || []).length > 0 : !!currentAnswer;

  if (done) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-4xl">✅</div>
        <h3 className="text-lg font-semibold">风格画像已生成</h3>
        <p className="text-sm text-gray-500">可在「用户画像」页查看和修改</p>
        <button onClick={() => onComplete(buildProfile(answers))}
          className="px-8 py-3 bg-primary-500 text-white rounded-2xl font-medium">
          返回画像
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all"
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
          <button key={opt.value} type="button"
            onClick={() => setAnswer(opt.value)}
            className={`w-full text-left px-4 py-3 rounded-2xl border transition-colors ${
              isSelected(opt.value)
                ? 'border-primary-400 bg-primary-50 text-primary-600'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Next button */}
      <button type="button"
        onClick={handleNext}
        disabled={!canProceed}
        className="w-full py-3 bg-primary-500 text-white rounded-2xl font-medium disabled:opacity-50"
      >
        {step < QUIZ_QUESTIONS.length - 1 ? '下一题' : '✨ 完成测试'}
      </button>
    </div>
  );
}

function buildProfile(answers: Record<number, string | string[]>): Partial<UserProfile> {
  // Body shape from q1
  const bodyShape = (answers[1] as string) || 'rectangle';

  // Skin tone from q11 (血管颜色)
  const skinTone = (answers[11] as string) || 'neutral';

  // Budget from q15
  const budget = (answers[15] as string) || 'mid';

  // Accessory level from q8
  const accessoryLevel = (answers[8] as string) || 'minimal';

  // Style scoring: q4 (穿搭感觉), q5 (心动单品), q6 (鞋子) — each counts as a vote
  // Also check: q7 (图案偏好) maps to styles, q9 (衣橱颜色) maps to styles
  const styleVotes: Record<string, number> = {};
  ALL_STYLES.forEach((s) => { styleVotes[s] = 0; });

  // q4: direct style mapping
  const q4 = answers[4] as string;
  if (q4 && q4 in styleVotes) styleVotes[q4] += 3; // primary weight

  // q5: direct style mapping
  const q5 = answers[5] as string;
  if (q5 && q5 in styleVotes) styleVotes[q5] += 2;

  // q6: direct style mapping
  const q6 = answers[6] as string;
  if (q6 && q6 in styleVotes) styleVotes[q6] += 2;

  // q7: pattern preference -> style inference
  const q7 = answers[7] as string;
  const patternStyleMap: Record<string, string[]> = {
    'solid': ['minimalist','elegant'], 'stripes': ['minimalist','tomboy'],
    'floral': ['sweet','vintage','bohemian'], 'geometric': ['avant-garde','luxury'],
    'print': ['street','avant-garde'], 'all': [],
  };
  (patternStyleMap[q7] || []).forEach((s) => { if (s in styleVotes) styleVotes[s] += 1; });

  // q9: wardrobe color -> style inference
  const q9 = answers[9] as string;
  const colorStyleMap: Record<string, string[]> = {
    'neutral': ['minimalist','elegant','tomboy'], 'earth': ['vintage','bohemian','elegant'],
    'blue': ['minimalist','sporty'], 'pink': ['sweet','luxury'],
    'warm': ['bohemian','street'], 'green': ['sporty','vintage'],
  };
  (colorStyleMap[q9] || []).forEach((s) => { if (s in styleVotes) styleVotes[s] += 1; });

  // Sort by votes
  const sorted = Object.entries(styleVotes).sort((a, b) => b[1] - a[1]);

  // Avoid colors from q10
  const q10 = answers[10] as string;
  const avoidColors = q10 && q10 !== 'none' ? [q10] : [];

  return {
    body: {
      shape: bodyShape as BodyShape,
      heightRange: 'average',
      highlightAreas: [],
      downplayAreas: Array.isArray(answers[3]) ? (answers[3] as string[]).filter((v: string) => v !== 'none') : [],
    },
    color: {
      skinTone: skinTone as SkinTone,
      hairColor: '',
      avoidColors,
    },
    styleProfile: {
      primaryStyle: (sorted[0]?.[0] || 'minimalist') as StyleLabel,
      secondaryStyle: (sorted[1]?.[0] || 'elegant') as StyleLabel,
      styleScores: Object.fromEntries(sorted) as Record<StyleLabel, number>,
    },
    lifestyle: {
      workEnv: (answers[12] as string) || '',
      weekendActivity: (answers[13] as string) || '',
      topOccasions: [(answers[14] as string) || 'casual'] as Occasion[],
      budget: budget as Budget,
    },
    preferences: {
      patternPreference: q7 ? [q7] : [],
      fitPreference: 'regular',
      accessoryLevel: accessoryLevel as AccessoryLevel,
    },
  };
}
