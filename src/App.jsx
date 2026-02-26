import { Navigate, Route, Routes } from "react-router-dom";
import Studio from "./pages/Studio.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/studio" replace />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="*" element={<div className="p-8">404</div>} />
    </Routes>
  );
}
