import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUserPlus,
  faClipboardList,
  faShoppingCart,
  faSignOutAlt,
  faBars,
  faTimes,
  faUsers,
  faList,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const [userType, setUserType] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    setUserType(userType);
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`bg-gray-800 text-white p-4 ${
        isExpanded ? "w-64" : "w-20"
      } min-h-screen shadow-md transition-width duration-300`}
    >
      <button onClick={toggleSidebar} className="mb-4 text-white">
        <FontAwesomeIcon icon={isExpanded ? faTimes : faBars} />
      </button>
      {isExpanded && (
        <>
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">
              <Link
                to="/home"
                className="flex items-center text-white hover:text-purple-400 transition duration-300"
              >
                <FontAwesomeIcon icon={faHouse} className="mr-2" />
                Home
              </Link>
            </li>
            {userType === "admin" && (
              <>
                <li className="mb-2">
                  <Link
                    to="/produto"
                    className="flex items-center text-white hover:text-purple-400 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                    Produtos
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/fornecedor"
                    className="flex items-center text-white hover:text-purple-400 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Fornecedores
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contato"
                    className="flex items-center text-white hover:text-purple-400 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                    Contatos
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/colaborador"
                    className="flex items-center text-white hover:text-purple-400 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    Lista de Colaboradores
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/lista-cotacao"
                    className="flex items-center text-white hover:text-purple-400 transition duration-300"
                  >
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    Cotações de Compras
                  </Link>
                </li>
              </>
            )}
            <li className="mb-2">
              <Link
                to="/cotacao"
                className="flex items-center text-white hover:text-purple-400 transition duration-300"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Requisição de Compras
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/logout"
                className="flex items-center text-white hover:text-purple-400 transition duration-300"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
