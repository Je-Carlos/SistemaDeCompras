import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function CadastroProdutos() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  const fetchProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const produtosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosList);
    } catch (error) {
      console.error("Erro ao buscar produtos: ", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const novoProduto = {
        nome,
        descricao,
      };

      await addDoc(collection(db, "produtos"), novoProduto);

      setSucesso("Produto cadastrado com sucesso!");
      setError("");
      setNome("");
      setDescricao("");
      setShowCadastro(false);
      fetchProdutos();
    } catch (error) {
      setError("Erro ao cadastrar produto: " + error.message);
      setSucesso("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      {showCadastro ? (
        <div>
          <h1 className="text-2xl font-semibold mb-4 text-center text-white">
            Cadastro de Produtos
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="nome"
              >
                Nome
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="descricao"
              >
                Descrição
              </label>
              <textarea
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Cadastrar Produto
            </button>
            <button
              type="button"
              onClick={() => setShowCadastro(false)}
              className="w-full p-2 mt-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Voltar
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-semibold mb-4 text-center text-white">
            Lista de Produtos
          </h1>
          <button
            onClick={() => setShowCadastro(true)}
            className="mb-4 p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Cadastrar Produto
          </button>
          <ul>
            {produtos.map((produto) => (
              <li key={produto.id} className="bg-gray-700 p-4 mb-2 rounded">
                <p>
                  <strong>Nome:</strong> {produto.nome}
                </p>
                <p>
                  <strong>Descrição:</strong> {produto.descricao}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
