import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { format, isValid } from "date-fns";

export default function ConsultaCotacao() {
  const [cotacoes, setCotacoes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]); // Definindo a variável fornecedores
  const [carregando, setCarregando] = useState(false);
  const [isCotacaoVisible, setIsCotacaoVisible] = useState(false);
  const [selectedCotacao, setSelectedCotacao] = useState(null);
  const [cotacao, setCotacao] = useState({
    valor: "",
    data: "",
    fornecedor: "",
  });
  const [erro, setErro] = useState("");
  const [isCotacoesVisible, setIsCotacoesVisible] = useState({});
  const [cotacaoCount, setCotacaoCount] = useState(0);

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

    const fetchFornecedores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fornecedores"));
        const fornecedoresList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFornecedores(fornecedoresList);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      }
    };

    fetchAllCotacoes();
    fetchFornecedores();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "aberta":
        return "text-green-500";
      case "em cotacao":
        return "text-yellow-500";
      case "fechada":
        return "text-red-500";
      default:
        return "";
    }
  };

  const handleAddCotacao = async (cotacaoId, novaCotacao) => {
    try {
      const cotacaoRef = doc(db, "cotacoes", cotacaoId);
      const cotacaoDoc = await getDoc(cotacaoRef);
      const cotacaoData = cotacaoDoc.data();

      const updatedCotacoes = [...(cotacaoData.cotacoes || []), novaCotacao];
      let status = "em cotacao";
      if (updatedCotacoes.length >= 3) {
        status = "fechada";
      }

      await updateDoc(cotacaoRef, {
        cotacoes: arrayUnion(novaCotacao),
        status: status,
      });

      setCotacoes((prevCotacoes) =>
        prevCotacoes.map((cot) =>
          cot.id === cotacaoId
            ? { ...cot, cotacoes: updatedCotacoes, status }
            : cot
        )
      );
    } catch (error) {
      console.error("Erro ao adicionar cotação: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cotacao.valor || !cotacao.data || !cotacao.fornecedor) {
      setErro("Todos os campos são obrigatórios");
      return;
    }

    const produtoCotacoes = selectedCotacao.cotacoes || [];
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
        cotacoes: arrayUnion(novaCotacao),
        status: produtoCotacoes.length + 1 >= 3 ? "fechada" : "em cotacao",
      });

      setCotacoes((prevCotacoes) =>
        prevCotacoes.map((cot) =>
          cot.id === selectedCotacao.id
            ? {
                ...cot,
                cotacoes: [...(cot.cotacoes || []), novaCotacao],
                status:
                  produtoCotacoes.length + 1 >= 3 ? "fechada" : "em cotacao",
              }
            : cot
        )
      );

      setSelectedCotacao((prevSelectedCotacao) => ({
        ...prevSelectedCotacao,
        cotacoes: [...(prevSelectedCotacao.cotacoes || []), novaCotacao],
        status: produtoCotacoes.length + 1 >= 3 ? "fechada" : "em cotacao",
      }));

      setCotacao({
        valor: "",
        data: "",
        fornecedor: "",
      });
      setErro("");
      setCotacaoCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 3) {
          setIsCotacaoVisible(false);
        }
        return newCount;
      });
    } catch (error) {
      console.error("Erro ao adicionar cotação: ", error);
      setErro("Erro ao adicionar cotação");
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
            <li
              key={index}
              className="bg-gray-700 p-2 mb-2 rounded cursor-pointer"
              onClick={() => toggleCotacoesVisibility(cotacao.id)}
            >
              <p>
                <strong>Produto:</strong> {cotacao.produto}
              </p>
              <p>
                <strong>Quantidade:</strong> {cotacao.quantidade}
              </p>
              <p>
                <strong>Email:</strong> {cotacao.userEmail}
              </p>
              <p>
                <strong>Observação:</strong> {cotacao.observacao}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusClass(cotacao.status)}>
                  {cotacao.status}
                </span>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
              {isCotacoesVisible[cotacao.id] && cotacao.cotacoes && (
                <ul className="mt-2">
                  {cotacao.cotacoes.map((c, i) => (
                    <li key={i} className="bg-gray-600 p-2 mb-2 rounded">
                      <p>
                        <strong>Valor:</strong> {c.valor}
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {isValid(new Date(c.data))
                          ? format(new Date(c.data), "dd/MM/yyyy")
                          : "Data inválida"}
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
            <form onSubmit={handleSubmit}>
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
