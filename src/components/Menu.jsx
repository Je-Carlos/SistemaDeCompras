import { Link } from "react-router-dom";

export default function TelaMenu() {
  return (
    <nav className="mb-4">
      <ul className="flex space-x-10 justify-center">
        <li>
          <Link
            to="/cadastro-fornecedores"
            className="text-secondary-100 hover:text-secondary-200 font-semibold"
          >
            Fornecedores
          </Link>
        </li>
        <li>
          <Link
            to="/cadastro-produtos"
            className="text-secondary-100 hover:text-secondary-200 font-semibold"
          >
            Produtos
          </Link>
        </li>
        <li>
          <Link
            to="/cadastro-contatos"
            className="text-secondary-100 hover:text-secondary-200 font-semibold"
          >
            Contatos
          </Link>
        </li>
        <li>
          <Link
            to="/cadastro-cotacao"
            className="text-secondary-100 hover:text-secondary-200 font-semibold"
          >
            Cadastrar Cotações
          </Link>
        </li>
        <li>
          <Link
            to="/consulta-cotacao"
            className="text-secondary-100 hover:text-secondary-200 font-semibold"
          >
            Cotações
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="text-secondary-100 hover:text-secondary-200 font-semibold"
          >
            Login
          </Link>
        </li>
        {/* Adicionar mais itens de menu conforme necessário */}
      </ul>
    </nav>
  );
}
