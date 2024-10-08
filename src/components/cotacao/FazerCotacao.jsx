import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { Parser } from "@json2csv/plainjs";

export default function FazerCotacao() {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [cotacoes, setCotacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCotacaoId, setCurrentCotacaoId] = useState(null);
  const [selectedProduto, setSelectedProduto] = useState(null);
  const [produtoCotacoes, setProdutoCotacoes] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterName, setFilterName] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCotacoes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      const q = query(
        collection(db, "cotacoes"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const cotacoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCotacoes(cotacoesList);
    } catch (error) {
      console.error("Erro ao buscar cotações: ", error);
    }
  };
  const filteredCotacoes = cotacoes.filter((cotacao) => {
    const matchesName =
      filterName === "" ||
      cotacao.produto.toLowerCase().includes(filterName.toLowerCase());
    const matchesDate = filterDate === "" || cotacao.data === filterDate;
    return matchesName && matchesDate;
  });
  const fetchProdutos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "produtos"));
      const produtosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutos(produtosList);
      const categoriasMap = {};
      produtosList.forEach((produto) => {
        categoriasMap[produto.nome] = produto.categoria;
      });
      setCategorias(categoriasMap);
    } catch (error) {
      console.error("Erro ao buscar produtos: ", error);
    }
  };
  const exportToCSV = () => {
    const closedCotacoes = cotacoes.filter(
      (cotacao) => cotacao.status === "fechada"
    );
    if (closedCotacoes.length === 0) {
      setError("Nenhuma cotação fechada para exportar.");
      return;
    }

    const fields = [
      "produto",
      "categoria",
      "quantidade",
      "observacao",
      "data",
      "userEmail",
      "status",
    ];
    const opts = { fields };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(closedCotacoes);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "cotacoes_fechadas.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError("Erro ao exportar cotações.");
    }
  };
  const fetchProdutoCotacoes = async (produtoId) => {
    try {
      const q = query(
        collection(db, "cotacoes"),
        where("produtoId", "==", produtoId)
      );
      const querySnapshot = await getDocs(q);
      const cotacoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutoCotacoes(cotacoesList);
    } catch (error) {
      console.error("Erro ao buscar cotações do produto: ", error);
    }
  };

  useEffect(() => {
    fetchCotacoes();
    fetchProdutos();
  }, []);

  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      const novaCotacao = {
        produto: data.produto,
        quantidade: data.quantidade,
        observacao: data.observacao,
        userId: user.uid,
        userEmail: user.email,
        data: new Date().toLocaleString(),
        status: "aberta",
      };

      if (isEditing) {
        const cotacaoRef = doc(db, "cotacoes", currentCotacaoId);
        await updateDoc(cotacaoRef, novaCotacao);
        setSucesso("Compra atualizada com sucesso!");
      } else {
        await addDoc(collection(db, "cotacoes"), novaCotacao);
        setSucesso("Compra cadastrada com sucesso!");
      }

      setError("");
      fetchCotacoes();
      reset();
      setIsEditing(false);
      setCurrentCotacaoId(null);
    } catch (error) {
      setError("Erro ao cadastrar compra: " + error.message);
      setSucesso("");
    }
  };

  const editCotacao = (cotacao) => {
    setValue("produto", cotacao.produto);
    setValue("quantidade", cotacao.quantidade);
    setValue("observacao", cotacao.observacao);
    setIsEditing(true);
    setCurrentCotacaoId(cotacao.id);
  };

  const deleteCotacao = async (cotacaoId) => {
    try {
      const cotacaoRef = doc(db, "cotacoes", cotacaoId);
      await deleteDoc(cotacaoRef);
      setSucesso("Compras excluída com sucesso!");
      setError("");
      fetchCotacoes();
    } catch (error) {
      setError("Erro ao excluir Compras: " + error.message);
      setSucesso("");
    }
  };

  const handleProdutoClick = async (produto) => {
    setSelectedProduto(produto);
    try {
      const q = query(
        collection(db, "cotacoes"),
        where("produto", "==", produto.produto)
      );
      const querySnapshot = await getDocs(q);
      const cotacoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProdutoCotacoes(cotacoesList);
    } catch (error) {
      console.error("Erro ao buscar cotações do produto: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Fazer Compras
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="produto"
            >
              Produto
            </label>
            <select
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="produto"
              name="produto"
              {...register("produto", { required: true })}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.nome}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="quantidade"
            >
              Quantidade
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="quantidade"
              type="number"
              name="quantidade"
              placeholder="Quantidade"
              {...register("quantidade", { required: true })}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="observacao"
            >
              Observação
            </label>
            <textarea
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="observacao"
              name="observacao"
              placeholder="Observação"
              {...register("observacao")}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              type="submit"
            >
              {isEditing ? "Atualizar Compra" : "Cadastrar Compra"}
            </button>
          </div>
        </form>
        <div className="mt-8">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </button>
          {showFilters && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Filtrar Cotações
              </h3>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="filterName"
                >
                  Nome do Produto
                </label>
                <input
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  id="filterName"
                  type="text"
                  placeholder="Nome do Produto"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="filterDate"
                >
                  Data
                </label>
                <input
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  id="filterDate"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Cotações de Compras
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Produto
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Categoria
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Quantidade
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600">
                    Observação
                  </th>
                  <th className="py-2 px-4 border-b border-gray-600">Data</th>
                  <th className="py-2 px-4 border-b border-gray-600">Email</th>
                  <th className="py-2 px-4 border-b border-gray-600">Status</th>
                  <th className="py-2 px-4 border-b border-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCotacoes.map((cotacao) => (
                  <tr
                    key={cotacao.id}
                    className="hover:bg-gray-600"
                    onClick={() => handleProdutoClick(cotacao)}
                  >
                    <td className="py-2 px-4 border-b border-gray-600">
                      {cotacao.produto}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {categorias[cotacao.produto] ||
                        "Categoria não encontrada"}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {cotacao.quantidade}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {cotacao.observacao}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {cotacao.data}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {cotacao.userEmail}
                    </td>
                    <td
                      className={`py-2 px-4 border-b border-gray-600 ${
                        cotacao.status === "aberta"
                          ? "text-green-500"
                          : cotacao.status === "em cotacao"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {cotacao.status}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          editCotacao(cotacao);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCotacao(cotacao.id);
                        }}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onClick={exportToCSV}
          >
            Exportar Cotações Fechadas para CSV
          </button>
        </div>
        {selectedProduto && selectedProduto.cotacoes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Cotações do Produto: {selectedProduto.produto}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-600">
                      Fornecedor
                    </th>
                    <th className="py-2 px-4 border-b border-gray-600">
                      Preço
                    </th>
                    <th className="py-2 px-4 border-b border-gray-600">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduto.cotacoes.map((cotacao, index) => (
                    <tr key={index} className="hover:bg-gray-600">
                      <td className="py-2 px-4 border-b border-gray-600">
                        {cotacao.fornecedor}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-600">
                        {cotacao.valor}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-600">
                        {cotacao.data}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
