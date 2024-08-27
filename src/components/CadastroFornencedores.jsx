import { useState } from "react";

export default function CadastroFornecedores() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const validarFormulario = () => {
    if (!nome || !cnpj || !endereco || !telefone) {
      setErro("Todos os campos são obrigatórios.");
      return false;
    }
    // Adicione aqui outras validações conforme necessário
    setErro("");
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      return;
    }
    // Aqui você pode adicionar a lógica para enviar os dados para o servidor
    console.log({ nome, cnpj, endereco, telefone });
    alert("Fornecedor cadastrado com sucesso!");
  };
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Cadastro de Fornecedores</h2>
      {erro && <div className="text-red-500 mb-2">{erro}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="cnpj"
            className="block text-sm font-medium text-gray-700"
          >
            CNPJ
          </label>
          <input
            type="text"
            id="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endereco"
            className="block text-sm font-medium text-gray-700"
          >
            Endereço
          </label>
          <input
            type="text"
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endereco"
            className="block text-sm font-medium text-gray-700"
          >
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
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
