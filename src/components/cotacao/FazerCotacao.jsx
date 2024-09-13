import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function FazerCotacao() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [cotacoes, setCotacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [selectedCotacao, setSelectedCotacao] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isCotacoesVisible, setIsCotacoesVisible] = useState({});
  const [isCotacoesFeitasVisible, setIsCotacoesFeitasVisible] = useState(true);

  useEffect(() => {
    const fetchAllCotacoes = async () => {
      setCarregando(true);
      try {
        const querySnapshot = await getDocs(collection(db, "cotacoes"));
        const cotacoesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCotacoes(cotacoesList);
      } catch (error) {
        console.error("Erro ao buscar as cotações:", error);
      } finally {
        setCarregando(false);
      }
    };

    fetchAllCotacoes();
  }, []);

  const onSubmit = async (data) => {
    if (!data.produto || !data.categoria) {
      setErro("Todos os campos são obrigatórios");
      return;
    }

    const produtoCotacoes = selectedCotacao?.cotações || [];
    if (produtoCotacoes.length >= 3) {
      setErro("Limite de 3 cotações atingido para este produto");
      return;
    }

    const novaCotacao = {
      valor: data.valor,
      data: data.data,
      fornecedor: data.fornecedor,
    };

    try {
      const cotacaoRef = doc(db, "cotacoes", selectedCotacao.id);
      await updateDoc(cotacaoRef, {
        cotações: arrayUnion(novaCotacao),
        status: produtoCotacoes.length + 1 >= 3 ? "fechada" : "aberta",
      });

      setSucesso("Cotação registrada com sucesso!");
      setErro("");

      // Atualizar a lista de cotações
      setCotacoes((prevCotacoes) =>
        prevCotacoes.map((c) =>
          c.id === selectedCotacao.id
            ? {
                ...c,
                cotações: [...produtoCotacoes, novaCotacao],
                status: produtoCotacoes.length + 1 >= 3 ? "fechada" : "aberta",
              }
            : c
        )
      );
    } catch (error) {
      console.error("Erro ao registrar a cotação:", error);
      setErro("Erro ao registrar a cotação: " + error.message);
    }
  };

  const toggleCotacoesVisibility = (id) => {
    setIsCotacoesVisible((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleCotacoesFeitasVisibility = () => {
    setIsCotacoesFeitasVisible(!isCotacoesFeitasVisible);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Fazer Cotação</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="produto"
            className="block text-sm font-medium text-gray-300"
          >
            Produto
          </label>
          <input
            name="produto"
            type="text"
            {...register("produto", { required: "Produto é obrigatório" })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.produto && (
            <p className="text-red-500">{errors.produto.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="categoria"
            className="block text-sm font-medium text-gray-300"
          >
            Categoria
          </label>
          <input
            name="categoria"
            type="text"
            {...register("categoria", { required: "Categoria é obrigatória" })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          {errors.categoria && (
            <p className="text-red-500">{errors.categoria.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Fazer Cotação
        </button>
      </form>
      {erro && <p className="text-red-500 mt-4">{erro}</p>}
      {sucesso && <p className="text-green-500 mt-4">{sucesso}</p>}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h2 className="text-lg font-bold text-white">Cotações Feitas</h2>
        <button onClick={toggleCotacoesFeitasVisibility} className="text-white">
          <FontAwesomeIcon
            icon={isCotacoesFeitasVisible ? faChevronUp : faChevronDown}
          />
        </button>
      </div>
      {isCotacoesFeitasVisible && (
        <ul className="mt-2">
          {carregando ? (
            <p>Carregando...</p>
          ) : (
            cotacoes.map((cotacao, index) => (
              <li key={index} className="bg-gray-700 p-2 mb-2 rounded">
                <p>
                  <strong>Produto:</strong> {cotacao.produto}
                </p>
                <p>
                  <strong>Categoria:</strong> {cotacao.categoria}
                </p>
                <p>
                  <strong>Data:</strong> {cotacao.data}
                </p>
                <p>
                  <strong>Email:</strong> {cotacao.email}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={
                      cotacao.status === "aberta"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {cotacao.status}
                  </span>
                </p>
                <button
                  onClick={() => toggleCotacoesVisibility(cotacao.id)}
                  className="ml-2 p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  <FontAwesomeIcon
                    icon={
                      isCotacoesVisible[cotacao.id]
                        ? faChevronUp
                        : faChevronDown
                    }
                  />
                </button>
                {isCotacoesVisible[cotacao.id] && cotacao.cotações && (
                  <ul className="mt-2">
                    {cotacao.cotações.map((c, i) => (
                      <li key={i} className="bg-gray-600 p-2 mb-2 rounded">
                        <p>
                          <strong>Valor:</strong> {c.valor}
                        </p>
                        <p>
                          <strong>Data:</strong> {c.data}
                        </p>
                        <p>
                          <strong>Fornecedor:</strong> {c.fornecedor}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
