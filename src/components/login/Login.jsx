import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log("Login bem-sucedido:", userCredential);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home");
    } catch (error) {
      console.error("Erro durante o login:", error);
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-purple-500 animate-color-change">
          SISCOMP
        </h1>
        <p className="text-lg font-medium mb-6 text-center text-gray-400">
          Sistema de Compras Inteligente
        </p>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
