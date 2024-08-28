import { useState } from "react";

function CadastroFornecedores() {
  const [fornecedor, setFornecedor] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
  });
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, cnpj, endereco, telefone } = fornecedor;
    if (!nome || !cnpj || !endereco || !telefone) {
      setErro("Todos os campos são obrigatórios");
      return;
    }
    // lógica para enviar os dados para o servidor
    console.log({ nome, cnpj, endereco, telefone });
    alert("Fornecedor cadastrado com sucesso!");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-white">
        Cadastro de Fornecedores
      </h2>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-300"
          >
            Nome
          </label>
          <input
            name="nome"
            type="text"
            value={fornecedor.nome}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cnpj"
            className="block text-sm font-medium text-gray-300"
          >
            CNPJ
          </label>
          <input
            name="cnpj"
            type="text"
            value={fornecedor.cnpj}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endereco"
            className="block text-sm font-medium text-gray-300"
          >
            Endereço
          </label>
          <input
            name="endereco"
            type="text"
            value={fornecedor.endereco}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-gray-300"
          >
            Telefone
          </label>
          <input
            name="telefone"
            type="text"
            value={fornecedor.telefone}
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
    </div>
  );
}

export default CadastroFornecedores;
