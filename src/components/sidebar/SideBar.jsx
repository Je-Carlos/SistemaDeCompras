// Sidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClipboardList,
  faPhone,
  faShoppingCart,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FaSignOutAlt } from "react-icons/fa";

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

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
              <Link to="/user" className="text-white">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Usuários
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/cotacao" className="text-white">
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Fazer Cotação
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/fornecedor" className="text-white">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                Fornecedores
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/fazer-cotacao" className="text-white">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Cotações
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/login" className="text-white flex items-center">
                <FaSignOutAlt className="mr-2" /> Logout
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

export default Sidebar;
