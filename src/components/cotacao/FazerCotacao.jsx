// FazerCotacao.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

function FazerCotacao() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [cotacoes, setCotacoes] = useState([]);
  const [expandedCotacao, setExpandedCotacao] = useState(null);
  const [showCotacoes, setShowCotacoes] = useState(false);

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

  useEffect(() => {
    fetchCotacoes();
  }, []);

  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const novaCotacao = {
        userId: user.uid,
        produto: data.produto,
        categoria: data.categoria,
        dataHora: new Date().toISOString(),
        status: "aberta",
      };

      await addDoc(collection(db, "cotacoes"), novaCotacao);

      setSucesso("Cotação cadastrada com sucesso!");
      setError("");
      fetchCotacoes(); // Atualizar a lista de cotações
    } catch (error) {
      setError("Erro ao cadastrar cotação: " + error.message);
      setSucesso("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Fazer Cotação
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
            <input
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="produto"
              type="text"
              {...register("produto", { required: true })}
            />
            {errors.produto && (
              <p className="text-red-500 text-xs italic">
                Produto é obrigatório.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="categoria"
            >
              Categoria
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              id="categoria"
              type="text"
              {...register("categoria", { required: true })}
            />
            {errors.categoria && (
              <p className="text-red-500 text-xs italic">
                Categoria é obrigatória.
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              type="submit"
            >
              Cadastrar Cotação
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 w-full text-left"
            onClick={() => setShowCotacoes(!showCotacoes)}
          >
            {showCotacoes
              ? "Esconder Cotações Feitas"
              : "Mostrar Cotações Feitas"}
          </button>
          {showCotacoes && (
            <div className="mt-4">
              <ul className="list-none">
                {cotacoes.map((cotacao) => (
                  <li
                    key={cotacao.id}
                    className="bg-gray-700 p-4 mb-2 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {cotacao.produto} - {cotacao.categoria} -{" "}
                        {cotacao.status}
                      </span>
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
                    {expandedCotacao === cotacao.id && (
                      <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">
                          Data e Hora:{" "}
                          {format(
                            new Date(cotacao.dataHora),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Cotações:
                          </h3>
                          <ul className="list-disc list-inside text-gray-300">
                            {cotacao.cotacoes &&
                              cotacao.cotacoes.map((c, index) => (
                                <li key={index} className="mb-2">
                                  <div className="flex justify-between">
                                    <span>Fornecedor: {c.fornecedor}</span>
                                    <span>Preço: {c.preco}</span>
                                    <span>
                                      Data:{" "}
                                      {format(new Date(c.data), "dd/MM/yyyy")}
                                    </span>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FazerCotacao;
