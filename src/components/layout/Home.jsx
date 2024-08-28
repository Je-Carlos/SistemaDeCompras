import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <div className="p-8 bg-gray-700 text-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">
          Bem-vindo ao Sistema de Compras
        </h1>
        <p className="mb-4">Escolha uma das opções abaixo para continuar:</p>
        <ul className="space-y-4">
          <li>
            <Link
              to="/cadastro-fornecedores"
              className="text-blue-400 hover:underline"
            >
              Cadastro de Fornecedores
            </Link>
          </li>
          <li>
            <Link
              to="/cadastro-produtos"
              className="text-blue-400 hover:underline"
            >
              Cadastro de Produtos
            </Link>
          </li>
          <li>
            <Link
              to="/cadastro-contatos"
              className="text-blue-400 hover:underline"
            >
              Cadastro de Contatos
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
