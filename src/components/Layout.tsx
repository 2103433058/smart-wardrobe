import { NavLink, Outlet } from 'react-router-dom';

const tabs = [
  { path: '/capture', label: '📷 识别录入' },
  { path: '/wardrobe', label: '👗 衣橱管理' },
  { path: '/recommendation', label: '✨ 搭配推荐' },
  { path: '/profile', label: '👤 用户画像' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20 max-w-2xl mx-auto px-4 py-4">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-2xl mx-auto flex justify-around">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 text-xs gap-1 ${
                  isActive ? 'text-indigo-600' : 'text-gray-500'
                }`
              }
            >
              <span className="text-lg">{tab.label.slice(0, 2)}</span>
              <span>{tab.label.slice(3)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
