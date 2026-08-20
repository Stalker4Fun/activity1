import { Navigate, Route, Routes } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );
}
