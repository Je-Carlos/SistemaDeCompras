import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/SideBar";
import Home from "../layout/Home";
import CadastroProduto from "../cotacao/CadastroProduto";
import Fornecedor from "../fornecedor/Fornecedor";
import CadastroCotacao from "../cotacao/FazerCotacao";
import User from "../usuarios/Colaborador";

export default function MainLayout() {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  return (
    <div className="flex">
      {!isLoginRoute && <Sidebar />}
      <div className="flex-grow">
        <div className="p-4">
          <Routes>
            <Route path="/produto" element={<CadastroProduto />} />
            <Route path="/fornecedor" element={<Fornecedor />} />
            <Route path="/cotacao" element={<CadastroCotacao />} />
            <Route path="/user" element={<User />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
