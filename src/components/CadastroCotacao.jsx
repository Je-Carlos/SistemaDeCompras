import { useState, useEffect } from "react";

function CadastroCotacao() {
  const [cotacao, setCotacao] = useState({
    produto: "",
    fornecedor: "",
    quantidade: "",
    preco: "",
  });
  const [cotacoes, setCotacoes] = useState([]);
  const [selectedCotacao, setSelectedCotacao] = useState(null);

  useEffect(() => {
    // Simulação de busca de cotações do servidor
    const fetchCotacoes = async () => {
      const data = [
        {
          id: 1,
          produto: "Produto A",
          fornecedor: "Fornecedor X",
          quantidade: 10,
          preco: 100,
        },
        {
          id: 2,
          produto: "Produto B",
          fornecedor: "Fornecedor Y",
          quantidade: 20,
          preco: 200,
        },
      ];
      setCotacoes(data);
    };
    fetchCotacoes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCotacao((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { produto, fornecedor, quantidade, preco } = cotacao;
    if (!produto || !fornecedor || !quantidade || !preco) {
      alert("Todos os campos são obrigatórios");
      return;
    }
    // Aqui você pode adicionar a lógica para enviar os dados para o servidor
    console.log({ produto, fornecedor, quantidade, preco });
    alert("Cotação cadastrada com sucesso!");
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selected = cotacoes.find((c) => c.id === parseInt(selectedId));
    setSelectedCotacao(selected);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">Cadastro de Cotação</h2>
      <form onSubmit={handleSubmit}>
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
            value={cotacao.produto}
            onChange={handleChange}
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
          <input
            name="fornecedor"
            type="text"
            value={cotacao.fornecedor}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quantidade"
            className="block text-sm font-medium text-gray-300"
          >
            Quantidade
          </label>
          <input
            name="quantidade"
            type="number"
            value={cotacao.quantidade}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="preco"
            className="block text-sm font-medium text-gray-300"
          >
            Preço
          </label>
          <input
            name="preco"
            type="number"
            value={cotacao.preco}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Cadastrar
        </button>
      </form>

      <h2 className="text-lg font-bold mt-8 mb-4 text-white">
        Consultar Cotações
      </h2>
      <div className="mb-4">
        <label
          htmlFor="cotacoes"
          className="block text-sm font-medium text-gray-300"
        >
          Selecionar Cotação
        </label>
        <select
          id="cotacoes"
          onChange={handleSelectChange}
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
        >
          <option value="">Selecione uma cotação</option>
          {cotacoes.map((cotacao) => (
            <option key={cotacao.id} value={cotacao.id}>
              {cotacao.produto} - {cotacao.fornecedor}
            </option>
          ))}
        </select>
      </div>

      {selectedCotacao && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-white">
            Detalhes da Cotação
          </h3>
          <p className="text-sm text-gray-300">
            Produto: {selectedCotacao.produto}
          </p>
          <p className="text-sm text-gray-300">
            Fornecedor: {selectedCotacao.fornecedor}
          </p>
          <p className="text-sm text-gray-300">
            Quantidade: {selectedCotacao.quantidade}
          </p>
          <p className="text-sm text-gray-300">
            Preço: {selectedCotacao.preco}
          </p>
        </div>
      )}
    </div>
  );
}

export default CadastroCotacao;
