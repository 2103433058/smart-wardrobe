import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CaptureTab } from './components/capture/CaptureTab';
import { WardrobeGrid } from './components/wardrobe/WardrobeGrid';
import { RecommendationList } from './components/recommendation/RecommendationList';
import { ProfileForm } from './components/profile/ProfileForm';
import { useWardrobeStore } from './stores/wardrobeStore';
import { useProfileStore } from './stores/profileStore';

function AppInit() {
  const loadItems = useWardrobeStore((s) => s.loadItems);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  useEffect(() => { loadItems(); loadProfile(); }, [loadItems, loadProfile]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/capture" element={<CaptureTab />} />
          <Route path="/wardrobe" element={<WardrobeGrid />} />
          <Route path="/recommendation" element={<RecommendationList />} />
          <Route path="/profile" element={<ProfileForm />} />
          <Route path="*" element={<Navigate to="/capture" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
