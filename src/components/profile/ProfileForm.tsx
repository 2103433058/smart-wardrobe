import { useEffect, useState } from 'react';
import { useProfileStore } from '../../stores/profileStore';
import { StyleQuiz } from './StyleQuiz';
import type { UserProfile } from '../../types';

export function ProfileForm() {
  const { profile, hasProfile, loadProfile, setProfile } = useProfileStore();
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  if (showQuiz) {
    return (
      <div>
        <button onClick={() => setShowQuiz(false)} className="text-indigo-600 text-sm mb-4">
          ← 返回
        </button>
        <StyleQuiz onComplete={async (partial) => {
          const merged = { ...profile, ...partial } as UserProfile;
          await setProfile(merged);
          setShowQuiz(false);
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">用户画像</h1>

      {/* Body section */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-3">身体数据</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500 text-xs">体型</label>
            <select value={profile.body.shape}
              onChange={(e) => setProfile({ ...profile, body: { ...profile.body, shape: e.target.value as any } })}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="rectangle">矩形</option>
              <option value="hourglass">沙漏</option>
              <option value="pear">梨形</option>
              <option value="apple">苹果</option>
              <option value="inverted-triangle">倒三角</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs">身高</label>
            <select value={profile.body.heightRange}
              onChange={(e) => setProfile({ ...profile, body: { ...profile.body, heightRange: e.target.value as any } })}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="short">160cm 以下</option>
              <option value="average">160-170cm</option>
              <option value="tall">170cm 以上</option>
            </select>
          </div>
        </div>
      </section>

      {/* Color section */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-3">色彩属性</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500 text-xs">肤色基调</label>
            <select value={profile.color.skinTone}
              onChange={(e) => setProfile({ ...profile, color: { ...profile.color, skinTone: e.target.value as any } })}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="warm">暖色调</option>
              <option value="cool">冷色调</option>
              <option value="neutral">中性色调</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs">发色</label>
            <input value={profile.color.hairColor}
              onChange={(e) => setProfile({ ...profile, color: { ...profile.color, hairColor: e.target.value } })}
              className="w-full border rounded-lg px-3 py-2 mt-1" placeholder="例如：黑色" />
          </div>
        </div>
      </section>

      {/* Style section */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-3">风格偏好</h2>
        {hasProfile ? (
          <div className="text-sm space-y-2">
            <p>主风格: <span className="font-medium text-indigo-600">{profile.styleProfile.primaryStyle}</span></p>
            <p>辅风格: <span className="font-medium text-gray-600">{profile.styleProfile.secondaryStyle}</span></p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">尚未测试</p>
        )}
        <button onClick={() => setShowQuiz(true)}
          className="mt-3 text-sm text-indigo-600 font-medium">
          {hasProfile ? '🔄 重新测试' : '📝 开始风格测试'}
        </button>
      </section>

      {/* Lifestyle section */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-3">场合与预算</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-gray-500 text-xs">预算</label>
            <select value={profile.lifestyle.budget}
              onChange={(e) => setProfile({ ...profile, lifestyle: { ...profile.lifestyle, budget: e.target.value as any } })}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="budget">性价比优先</option>
              <option value="mid">中等价位</option>
              <option value="premium">少而精</option>
              <option value="flexible">混搭自由</option>
            </select>
          </div>
          <div>
            <label className="text-gray-500 text-xs">版型偏好</label>
            <select value={profile.preferences.fitPreference}
              onChange={(e) => setProfile({ ...profile, preferences: { ...profile.preferences, fitPreference: e.target.value as any } })}
              className="w-full border rounded-lg px-3 py-2 mt-1">
              <option value="loose">宽松</option>
              <option value="regular">合身</option>
              <option value="slim">修身</option>
              <option value="oversized">廓形</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
