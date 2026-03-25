import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "./components/home/SmartCampusHome";
import "./App.css";
import AuthCallback from "../src/pages/auth/AuthCallback";

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
