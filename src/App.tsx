import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CaptureTab } from './components/capture/CaptureTab';
import { WardrobeGrid } from './components/wardrobe/WardrobeGrid';
import { RecommendationList } from './components/recommendation/RecommendationList';
import { ProfileForm } from './components/profile/ProfileForm';

export default function App() {
  return (
    <BrowserRouter>
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
