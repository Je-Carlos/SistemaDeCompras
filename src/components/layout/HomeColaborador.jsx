import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 text-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-500">
          Bem-vindo ao Sistema de Compras
        </h1>
        <p className="mb-6 text-center text-gray-400">
          Escolha uma das opções abaixo para continuar:
        </p>
        <ul className="space-y-4">
          <li>
            <Link
              to="/cotacao"
              className="flex items-center justify-center p-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Fazer Cotação
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="flex items-center justify-center p-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
