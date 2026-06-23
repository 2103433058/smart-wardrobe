import { useEffect, useState, useRef } from 'react';
import { useProfileStore } from '../../stores/profileStore';
import { StyleQuiz } from './StyleQuiz';
import type { UserProfile } from '../../types';

const BODY_LABELS: Record<string, string> = {
  rectangle: '矩形(H型) 肩腰髋等宽', hourglass: '沙漏(X型) 肩髋等宽腰细',
  pear: '梨形(A型) 髋宽于肩', apple: '苹果(O型) 腰腹丰满', 'inverted-triangle': '倒三角(Y型) 肩宽于髋',
};

const STYLE_NAMES: Record<string, string> = {
  minimalist:'简约', sweet:'甜美', tomboy:'帅气', street:'街头', elegant:'优雅',
  sporty:'活力', bohemian:'波西米亚', vintage:'复古', luxury:'轻奢', 'avant-garde':'前卫',
};

export function ProfileForm() {
  const store = useProfileStore();
  const { profile, hasProfile } = store;
  const [showQuiz, setShowQuiz] = useState(false);
  const [saved, setSaved] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      store.loadProfile();
    }
  }, []);

  const [saveErr, setSaveErr] = useState('');

  const save = async (p: UserProfile) => {
    try {
      setSaveErr('');
      await store.setProfile(p);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setSaveErr(e?.message || '保存失败');
      // Try direct state update as fallback
      useProfileStore.setState({ profile: p, hasProfile: true });
    }
  };

  if (showQuiz) {
    return (
      <div>
        <button type="button" onClick={() => setShowQuiz(false)} className="text-primary-500 text-sm mb-4">
          ← 返回
        </button>
        <StyleQuiz onComplete={async (partial) => {
          const merged = { ...store.profile, ...partial } as UserProfile;
          await save(merged);
          setShowQuiz(false);
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">用户画像</h1>
        <div className="flex items-center gap-2">
          {saveErr && <span className="text-xs text-red-500">{saveErr}</span>}
          {saved && <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">已保存 ✓</span>}
        </div>
      </div>

      {/* Body section */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <h2 className="font-semibold mb-3">身体数据</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500 text-xs">体型</label>
            <select value={profile.body.shape}
              onChange={(e) => save({ ...profile, body: { ...profile.body, shape: e.target.value as UserProfile['body']['shape'] } })}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white">
              {Object.entries(BODY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs">身高</label>
            <select value={profile.body.heightRange}
              onChange={(e) => save({ ...profile, body: { ...profile.body, heightRange: e.target.value as UserProfile['body']['heightRange'] } })}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white">
              <option value="short">160cm 以下</option>
              <option value="average">160-170cm</option>
              <option value="tall">170cm 以上</option>
            </select>
          </div>
        </div>
      </section>

      {/* Color section */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <h2 className="font-semibold mb-3">色彩属性</h2>
        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs">肤色基调</label>
            <select value={profile.color.skinTone}
              onChange={(e) => save({ ...profile, color: { ...profile.color, skinTone: e.target.value as UserProfile['color']['skinTone'] } })}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white">
              <option value="warm">🧡 暖色调 — 适合大地色、橙色、金色</option>
              <option value="cool">💙 冷色调 — 适合蓝色、紫色、玫红</option>
              <option value="neutral">💜 中性调 — 冷暖皆可，柔和中间色</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs">发色</label>
            <input value={profile.color.hairColor}
              onBlur={(e) => save({ ...profile, color: { ...profile.color, hairColor: e.target.value } })}
              onChange={(e) => store.setProfile({ ...profile, color: { ...profile.color, hairColor: e.target.value } })}
              className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="例如：黑色" />
          </div>
        </div>
      </section>

      {/* Style section */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <h2 className="font-semibold mb-3">风格偏好</h2>
        {hasProfile && profile.styleProfile?.primaryStyle ? (
          <div className="text-sm space-y-2">
            <p>🎯 主风格: <span className="font-bold text-primary-500 text-base">
              {STYLE_NAMES[profile.styleProfile.primaryStyle] || profile.styleProfile.primaryStyle}
            </span></p>
            <p>🔸 辅风格: <span className="font-medium text-gray-600">
              {STYLE_NAMES[profile.styleProfile.secondaryStyle] || profile.styleProfile.secondaryStyle}
            </span></p>
            {Object.keys(profile.styleProfile.styleScores || {}).length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">全部风格得分</p>
                <div className="space-y-1">
                  {Object.entries(profile.styleProfile.styleScores)
                    .filter(([, v]) => v > 0)
                    .sort(([, a], [, b]) => b - a)
                    .map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2">
                        <span className="text-xs w-16 text-gray-600">{STYLE_NAMES[k] || k}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-400 rounded-full" style={{ width: `${(v / 10) * 100}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{v}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">尚未测试，请先完成风格测试</p>
        )}
        <button type="button" onClick={() => setShowQuiz(true)}
          className="mt-3 text-sm text-primary-500 font-medium">
          {hasProfile && profile.styleProfile?.primaryStyle ? '🔄 重新测试' : '📝 开始风格测试 (15题)'}
        </button>
      </section>

      {/* Lifestyle section */}
      <section className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <h2 className="font-semibold mb-3">场合与预算</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500 text-xs">穿搭预算</label>
            <select value={profile.lifestyle.budget}
              onChange={(e) => save({ ...profile, lifestyle: { ...profile.lifestyle, budget: e.target.value as UserProfile['lifestyle']['budget'] } })}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white">
              <option value="budget">性价比优先</option>
              <option value="mid">中等价位</option>
              <option value="premium">少而精</option>
              <option value="flexible">混搭自由</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs">版型偏好</label>
            <select value={profile.preferences.fitPreference}
              onChange={(e) => save({ ...profile, preferences: { ...profile.preferences, fitPreference: e.target.value as UserProfile['preferences']['fitPreference'] } })}
              className="w-full border rounded-lg px-3 py-2 mt-1 bg-white">
              <option value="loose">宽松</option>
              <option value="regular">合身</option>
              <option value="slim">修身</option>
              <option value="oversized">廓形</option>
            </select>
          </div>
        </div>
      </section>

      {/* Recommendations link */}
      {hasProfile && profile.styleProfile?.primaryStyle && (
        <div className="text-center">
          <p className="text-sm text-gray-500">画像已就绪，前往「✨ 搭配推荐」获取个性化方案</p>
        </div>
      )}
    </div>
  );
}
