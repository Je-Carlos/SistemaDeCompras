import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

function CadastroUsuario() {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "colaborador",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const usuariosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(usuariosList);
    } catch (error) {
      console.error("Erro ao buscar usuários: ", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        usuario.email,
        usuario.senha
      );
      await addDoc(collection(db, "usuarios"), {
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        uid: userCredential.user.uid,
        ativo: true,
      });

      setSucesso("Usuário cadastrado com sucesso!");
      setErro("");
      setUsuario({
        nome: "",
        email: "",
        senha: "",
        tipo: "colaborador",
      });
      fetchUsuarios();
    } catch (error) {
      setErro(error.message);
      setSucesso("");
    }
  };

  const handleDesativarConta = async (id) => {
    try {
      const usuarioRef = doc(db, "usuarios", id);
      await updateDoc(usuarioRef, { ativo: false });
      setSucesso("Usuário desativado com sucesso!");
      setErro("");
      fetchUsuarios();
    } catch (error) {
      setErro("Erro ao desativar usuário");
      setSucesso("");
    }
  };

  const handleReativarConta = async (id) => {
    try {
      const usuarioRef = doc(db, "usuarios", id);
      await updateDoc(usuarioRef, { ativo: true });
      setSucesso("Usuário reativado com sucesso!");
      setErro("");
      fetchUsuarios();
    } catch (error) {
      setErro("Erro ao reativar usuário");
      setSucesso("");
    }
  };

  const handleChangeTipo = async (id, novoTipo) => {
    try {
      const usuarioRef = doc(db, "usuarios", id);
      await updateDoc(usuarioRef, { tipo: novoTipo });
      setSucesso("Tipo de usuário atualizado com sucesso!");
      setErro("");
      fetchUsuarios();
    } catch (error) {
      setErro("Erro ao alterar tipo de usuário");
      setSucesso("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Cadastro de Usuário
        </h2>
        {erro && <p className="text-red-500 text-center">{erro}</p>}
        {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="nome"
            >
              Nome
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="nome"
              type="text"
              name="nome"
              placeholder="Nome"
              value={usuario.nome}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              value={usuario.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="tipo"
            >
              Tipo
            </label>
            <select
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="tipo"
              name="tipo"
              value={usuario.tipo}
              onChange={handleChange}
            >
              <option value="colaborador">Colaborador</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="senha"
            >
              Senha
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="senha"
              type="password"
              name="senha"
              placeholder="********"
              value={usuario.senha}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              type="submit"
            >
              Cadastrar
            </button>
          </div>
        </form>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Emails Cadastrados:</h3>
          <ul className="list-disc list-inside">
            {usuarios.map((usuario) => (
              <li
                key={usuario.id}
                className="flex justify-between items-center"
              >
                <span>
                  {usuario.email} - {usuario.tipo}
                </span>
                <div className="flex items-center">
                  {usuario.ativo ? (
                    <button
                      className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      onClick={() => handleDesativarConta(usuario.id)}
                    >
                      Desativar
                    </button>
                  ) : (
                    <button
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      onClick={() => handleReativarConta(usuario.id)}
                    >
                      Reativar
                    </button>
                  )}
                  <select
                    className="ml-4 shadow appearance-none border border-gray-600 rounded py-1 px-2 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    value={usuario.tipo}
                    onChange={(e) =>
                      handleChangeTipo(usuario.id, e.target.value)
                    }
                  >
                    <option value="colaborador">Colaborador</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuario;
