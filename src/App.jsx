import { BrowserRouter, Route, Routes } from "react-router-dom";
import CadastroFornecedores from "./components/CadastroFornencedores";
import TelaMenu from "./components/Menu";
import CadastroContatos from "./components/CadastroContatos";
import CadastroProdutos from "./components/CadastroProdutos";
import CadastroCotacao from "./components/CadastroCotacao";
import ConsultaCotacao from "./components/ConsultaCotacao";
import TelaLogin from "./components/TelaLogin";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-secondary-300 min-h-screen flex justify-center items-center">
        <div className="bg-secondary-400 p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-center text-primary">
            Sistema de Cotações ACME
          </h1>
          <TelaMenu />
          <Routes>
            <Route
              path="/cadastro-fornecedores"
              element={<CadastroFornecedores />}
            />
            <Route path="/cadastro-produtos" element={<CadastroProdutos />} />
            <Route path="/cadastro-contatos" element={<CadastroContatos />} />
            <Route path="/cadastro-cotacao" element={<CadastroCotacao />} />
            <Route path="/consulta-cotacao" element={<ConsultaCotacao />} />
            <Route path="/login" element={<TelaLogin />} />

            {/* Defina outras rotas conforme necessário */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
