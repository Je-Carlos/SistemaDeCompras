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
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center text-white">
        Cadastro de Produtos
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div>
          <input
            name="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div>
          <input
            name="preco"
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Preço"
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
    </div>
  );
}
