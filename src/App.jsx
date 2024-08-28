import { BrowserRouter, Route, Routes } from "react-router-dom";
import CadastroFornecedores from "./components/CadastroFornecedores";
import CadastroContatos from "./components/CadastroContatos";
import CadastroProdutos from "./components/CadastroProdutos";
import CadastroCotacao from "./components/CadastroCotacao";
import Sidebar from "./components/SideBar";
import Login from "./components/Login";
import Home from "./components/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-900 text-white min-h-screen flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4 text-center">
              ACME SISCOMP
            </h1>
            <Routes>
              <Route
                path="/cadastro-fornecedores"
                element={<CadastroFornecedores />}
              />
              <Route path="/cadastro-produtos" element={<CadastroProdutos />} />
              <Route path="/cadastro-contatos" element={<CadastroContatos />} />
              <Route path="/cadastro-cotacao" element={<CadastroCotacao />} />
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
