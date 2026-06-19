import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-lg">
      {title}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/capture" element={<Placeholder title="📷 识别录入" />} />
          <Route path="/wardrobe" element={<Placeholder title="👗 衣橱管理" />} />
          <Route path="/recommend" element={<Placeholder title="✨ 搭配推荐" />} />
          <Route path="/profile" element={<Placeholder title="👤 用户画像" />} />
          <Route path="*" element={<Navigate to="/capture" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
