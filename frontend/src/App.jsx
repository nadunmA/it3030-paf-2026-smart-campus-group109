import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "../src/features/home/pages/SmartCampusHome";
import "./App.css";
import AuthCallback from "../src/features/auth/pages/AuthCallback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}
