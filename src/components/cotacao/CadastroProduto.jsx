import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function CadastroProdutos() {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [editandoProduto, setEditandoProduto] = useState(null);

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
    if (!nome || !categoria) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      if (editandoProduto) {
        // Atualizar produto existente
        const produtoRef = doc(db, "produtos", editandoProduto.id);
        await updateDoc(produtoRef, {
          nome,
          categoria,
        });
        setSucesso("Produto atualizado com sucesso!");
      } else {
        // Adicionar novo produto
        await addDoc(collection(db, "produtos"), {
          nome,
          categoria,
        });
        setSucesso("Produto cadastrado com sucesso!");
      }
      setError("");
      setNome("");
      setCategoria("");
      setEditandoProduto(null);
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao cadastrar produto: ", error);
      setError("Erro ao cadastrar produto: " + error.message);
    }
  };

  const handleEdit = (produto) => {
    setNome(produto.nome);
    setCategoria(produto.categoria);
    setEditandoProduto(produto);
  };

  const handleDelete = async (produtoId) => {
    try {
      await deleteDoc(doc(db, "produtos", produtoId));
      setSucesso("Produto removido com sucesso!");
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao remover produto: ", error);
      setError("Erro ao remover produto: " + error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">
        Cadastro de Produtos
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      {sucesso && <p className="text-green-500">{sucesso}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-300"
          >
            Nome
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-300"
          >
            Categoria
          </label>
          <input
            id="categoria"
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          {editandoProduto ? "Atualizar Produto" : "Cadastrar Produto"}
        </button>
      </form>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2 text-white">
          Produtos Cadastrados
        </h3>
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id} className="bg-gray-700 p-2 mb-2 rounded">
              <p>
                <strong>Nome:</strong> {produto.nome}
              </p>
              <p>
                <strong>Categoria:</strong> {produto.categoria}
              </p>
              <button
                onClick={() => handleEdit(produto)}
                className="mr-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(produto.id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
