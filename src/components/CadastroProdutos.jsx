import { useState } from "react";

export default function CadastroProdutos() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui será a lógica para enviar os dados para o servidor
    console.log({ nome, descricao, preco });
    alert("Produto cadastrado com sucesso!");
  };
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Cadastro de Produtos</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Produto
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="preco"
            className="block text-sm font-medium text-gray-700"
          >
            Preço
          </label>
          <input
            type="number"
            id="preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary-500"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
