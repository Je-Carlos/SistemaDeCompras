import { useState, useEffect } from "react";
import { db, database } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function ConsultaCotacao() {
  const [cotacoes, setCotacoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [isCotacaoVisible, setIsCotacaoVisible] = useState(false);
  const [selectedCotacao, setSelectedCotacao] = useState(null);
  const [cotacao, setCotacao] = useState({
    valor: "",
    data: "",
    fornecedor: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [isCotacoesVisible, setIsCotacoesVisible] = useState({});

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

    const fetchFornecedores = () => {
      const fornecedoresRef = ref(database, "fornecedores");
      onValue(fornecedoresRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fornecedoresList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setFornecedores(fornecedoresList);
        }
      });
    };

    fetchAllCotacoes();
    fetchFornecedores();
  }, []);

  const handleCotacaoSubmit = async (e) => {
    e.preventDefault();
    if (!cotacao.valor || !cotacao.data || !cotacao.fornecedor) {
      setErro("Todos os campos são obrigatórios");
      return;
    }

    const produtoCotacoes = selectedCotacao.cotações || [];
    if (produtoCotacoes.length >= 3) {
      setErro("Limite de 3 cotações atingido para este produto");
      return;
    }

    const novaCotacao = {
      valor: cotacao.valor,
      data: cotacao.data,
      fornecedor: cotacao.fornecedor,
    };

    try {
      const cotacaoRef = doc(db, "cotacoes", selectedCotacao.id);
      await updateDoc(cotacaoRef, {
        cotações: arrayUnion(novaCotacao),
        status: produtoCotacoes.length + 1 >= 3 ? "fechada" : "aberta",
      });

      setSucesso("Cotação registrada com sucesso!");
      setErro("");
      setIsCotacaoVisible(false);
      setCotacao({ valor: "", data: "", fornecedor: "" });

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

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Todas as Cotações</h2>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul className="mt-2">
          {cotacoes.map((cotacao, index) => (
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
                onClick={() => {
                  setSelectedCotacao(cotacao);
                  setIsCotacaoVisible(true);
                }}
                className={`mt-2 p-2 rounded ${
                  cotacao.status === "fechada"
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
                disabled={cotacao.status === "fechada"}
              >
                Fazer Cotação
              </button>
              <button
                onClick={() => toggleCotacoesVisibility(cotacao.id)}
                className="ml-2 p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <FontAwesomeIcon
                  icon={
                    isCotacoesVisible[cotacao.id] ? faChevronUp : faChevronDown
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
          ))}
        </ul>
      )}
      {isCotacaoVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-white">Fazer Cotação</h3>
            <form onSubmit={handleCotacaoSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="valor"
                  className="block text-sm font-medium text-gray-300"
                >
                  Valor
                </label>
                <input
                  name="valor"
                  type="text"
                  value={cotacao.valor}
                  onChange={(e) =>
                    setCotacao({ ...cotacao, valor: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="data"
                  className="block text-sm font-medium text-gray-300"
                >
                  Data
                </label>
                <input
                  name="data"
                  type="date"
                  value={cotacao.data}
                  onChange={(e) =>
                    setCotacao({ ...cotacao, data: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="fornecedor"
                  className="block text-sm font-medium text-gray-300"
                >
                  Fornecedor
                </label>
                <select
                  name="fornecedor"
                  value={cotacao.fornecedor}
                  onChange={(e) =>
                    setCotacao({ ...cotacao, fornecedor: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedores.map((fornecedor) => (
                    <option key={fornecedor.id} value={fornecedor.nome}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Registrar Cotação
              </button>
              <button
                type="button"
                onClick={() => setIsCotacaoVisible(false)}
                className="w-full p-2 mt-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
