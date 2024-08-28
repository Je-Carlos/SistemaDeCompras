import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
// TODO: CADASTRO DE USUÁRIO QUEBRADO
function CadastroUsuario() {
  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "colaborador", // padrão para colaborador
  });
  const [erro, setErro] = useState("");
  const [usuarios, setUsuarios] = useState([]); // Inicialize como um array vazio

  useEffect(() => {
    // Fetch users from Firebase
    const fetchUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsuarios(usuariosList);
      } catch (error) {
        console.error("There was an error fetching the users!", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "usuarios"), usuario);
      setUsuarios([...usuarios, { id: docRef.id, ...usuario }]);
      setUsuario({
        nome: "",
        email: "",
        senha: "",
        tipo: "colaborador",
      });
    } catch (error) {
      setErro("Erro ao cadastrar usuário");
      console.error("There was an error creating the user!", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-800 rounded-lg">
      <h1 className="text-2xl mb-4">Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-white">Nome:</label>
          <input
            type="text"
            name="nome"
            value={usuario.nome}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Email:</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Senha:</label>
          <input
            type="password"
            name="senha"
            value={usuario.senha}
            onChange={handleChange}
            className="w-full p-2 rounded"
          />
        </div>
        <div className="mb-2">
          <label className="block text-white">Tipo:</label>
          <select
            name="tipo"
            value={usuario.tipo}
            onChange={handleChange}
            className="w-full p-2 rounded"
          >
            <option value="colaborador">Colaborador</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        {erro && <p className="text-red-500">{erro}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Cadastrar
        </button>
      </form>
      <h2 className="text-xl mt-4 mb-2">Usuários Cadastrados</h2>
      <select className="w-full p-2 rounded">
        {Array.isArray(usuarios) &&
          usuarios.map(
            (
              usuario // Verifique se usuarios é um array
            ) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome} - {usuario.email}
              </option>
            )
          )}
      </select>
    </div>
  );
}

export default CadastroUsuario;
