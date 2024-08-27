import { useEffect, useState } from "react";

export default function CadastroCotacao() {
  const [produtos, setProdutos] = useState([]);
  const [cotacao, setCotacao] = useState({
    produtoId: "",
    dataCotacao: "",
    preco: "",
  });

  useEffect(() => {
    // Chamada para buscar os produtos existentes
    // setProdutos(resultadoDaBusca);
  }, []);

  const handleChange = (e) => {
    setCotacao({ ...cotacao, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chamada para enviar a cotação para o servidor
    console.log(cotacao);
  };
  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Produto:
          </label>
          <select
            name="produtoId"
            value={cotacao.produtoId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
          >
            <option value="">Selecione um Produto</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data da Cotação:
          </label>
          <input
            type="date"
            name="dataCotacao"
            value={cotacao.dataCotacao}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preço:
          </label>
          <input
            type="number"
            name="preco"
            value={cotacao.preco}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
        >
          Enviar Cotação
        </button>
      </form>
    </div>
  );
}
