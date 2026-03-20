import { BrowserRouter, Routes, Route } from "react-router-dom";
import SmartCampusHome from "./pages/SmartCampusHome";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SmartCampusHome />} />
      </Routes>
    </BrowserRouter>
  );
}
