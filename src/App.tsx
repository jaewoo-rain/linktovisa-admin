// 파일: src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ROUTE_PATHS } from './constants/routes';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN페이지 */}
        <Route path={ROUTE_PATHS.INIT} element={<AdminPage />} />
        {/* 4. 잘못된 경로 처리 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;