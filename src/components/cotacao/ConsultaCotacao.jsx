import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

function ConsultaCotacao() {
  const [cotacoes, setCotacoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [expandedCotacao, setExpandedCotacao] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCotacaoId, setCurrentCotacaoId] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  const fetchCotacoes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cotacoes"));
      const cotacoesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCotacoes(cotacoesList);
    } catch (error) {
      console.error("Erro ao buscar cotações: ", error);
    }
  };

  const fetchFornecedores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "fornecedores"));
      const fornecedoresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFornecedores(fornecedoresList);
    } catch (error) {
      console.error("Erro ao buscar fornecedores: ", error);
    }
  };

  useEffect(() => {
    fetchCotacoes();
    fetchFornecedores();
  }, []);

  const onSubmitCotacao = async (data) => {
    try {
      const novaCotacao = {
        fornecedor: data.fornecedor,
        preco: data.preco,
        data: data.data,
      };

      const cotacaoRef = doc(db, "cotacoes", currentCotacaoId);
      await updateDoc(cotacaoRef, {
        cotacoes: [
          ...(cotacoes.find((c) => c.id === currentCotacaoId).cotacoes || []),
          novaCotacao,
        ],
      });

      setSucesso("Cotação adicionada com sucesso!");
      setError("");
      reset();
      setShowForm(false);
      fetchCotacoes(); // Atualizar a lista de cotações
    } catch (error) {
      setError("Erro ao adicionar cotação: " + error.message);
      setSucesso("");
    }
  };

  const openForm = (cotacaoId) => {
    setCurrentCotacaoId(cotacaoId);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setCurrentCotacaoId(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-2/3">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Consulta de Cotações
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}
        <div className="mt-4">
          <ul className="list-none">
            {cotacoes.map((cotacao) => (
              <li
                key={cotacao.id}
                className="bg-gray-700 p-4 mb-2 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{cotacao.produto}</span> -
                    <span className="font-semibold">{cotacao.categoria}</span> -
                    <span className="font-semibold">{cotacao.status}</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="ml-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      onClick={() => openForm(cotacao.id)}
                    >
                      Cotar
                    </button>
                    <button
                      className="ml-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                      onClick={() =>
                        setExpandedCotacao(
                          expandedCotacao === cotacao.id ? null : cotacao.id
                        )
                      }
                    >
                      {expandedCotacao === cotacao.id ? "▲" : "▼"}
                    </button>
                  </div>
                </div>
                {expandedCotacao === cotacao.id && (
                  <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">
                      Data e Hora:{" "}
                      {format(new Date(cotacao.dataHora), "dd/MM/yyyy HH:mm")}
                    </p>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Cotações:</h3>
                      <div className="space-y-1">
                        {cotacao.cotacoes &&
                          cotacao.cotacoes.map((c, index) => (
                            <div
                              key={index}
                              className="bg-gray-700 p-2 rounded-lg"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                  Fornecedor:
                                </span>
                                <span>{c.fornecedor}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Preço:</span>
                                <span>{c.preco}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="font-semibold">Data:</span>
                                <span>
                                  {format(new Date(c.data), "dd/MM/yyyy")}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-md w-1/3">
            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
              Adicionar Cotação
            </h2>
            <form onSubmit={handleSubmit(onSubmitCotacao)}>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="fornecedor"
                >
                  Fornecedor
                </label>
                <select
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  id="fornecedor"
                  {...register("fornecedor", { required: true })}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.nome}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
                {errors.fornecedor && (
                  <p className="text-red-500 text-xs italic">
                    Fornecedor é obrigatório.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="preco"
                >
                  Preço
                </label>
                <input
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  id="preco"
                  type="number"
                  step="0.01"
                  {...register("preco", { required: true })}
                />
                {errors.preco && (
                  <p className="text-red-500 text-xs italic">
                    Preço é obrigatório.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="data"
                >
                  Data
                </label>
                <input
                  className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  id="data"
                  type="date"
                  {...register("data", { required: true })}
                />
                {errors.data && (
                  <p className="text-red-500 text-xs italic">
                    Data é obrigatória.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  type="submit"
                >
                  Adicionar Cotação
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  type="button"
                  onClick={closeForm}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultaCotacao;
