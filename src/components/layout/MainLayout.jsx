import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import CadastroProduto from "../cotacao/CadastroProduto";
import Fornecedor from "../fornecedor/Fornecedor";
import CadastroCotacao from "../cotacao/FazerCotacao";
import HomeAdmin from "./HomeAdmin";
import HomeColaborador from "./HomeColaborador";
import Sidebar from "../sidebar/SideBar";
import Logout from "../login/Logout";
import Colaborador from "../usuarios/Colaborador";
import ConsultaCotacao from "../cotacao/ConsultaCotacao";
import Contatos from "../fornecedor/Contatos";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userType = localStorage.getItem("userType");
    setUserType(userType);

    if (!isAuthenticated) {
      window.location.href = "/login";
    } else if (location.pathname === "/") {
      if (userType === "admin") {
        window.location.href = "/home";
      } else if (userType === "colaborador") {
        window.location.href = "/cotacao";
      }
    }
  }, [location]);

  return (
    <div className="flex">
      {!isLoginRoute && <Sidebar />}
      <div className="flex-grow">
        <div className="p-4">
          <Routes>
            {userType === "admin" && (
              <>
                <Route path="/home" element={<HomeAdmin />} />
                <Route path="/produto" element={<CadastroProduto />} />
                <Route path="/fornecedor" element={<Fornecedor />} />
                <Route path="/contato" element={<Contatos />} />
                <Route path="/colaborador" element={<Colaborador />} />
                <Route path="/lista-cotacao" element={<ConsultaCotacao />} />
                <Route path="/logout" element={<Logout />} />
              </>
            )}
            {userType === "colaborador" && (
              <>
                <Route path="/home" element={<HomeColaborador />} />
                <Route path="/cotacao" element={<CadastroCotacao />} />
                <Route path="/logout" element={<Logout />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
