import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import MainLayout from "./components/layout/MainLayout";

export default function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
