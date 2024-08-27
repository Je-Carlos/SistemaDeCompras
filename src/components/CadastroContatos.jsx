import { useState } from "react";

export default function CadastroContatos() {
  const [contato, setContato] = useState({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    fornecedorId: "",
  });

  // Lista estática de fornecedores para exemplo
  const fornecedores = [
    { id: "1", nome: "Frigorifericos Lmtd" },
    { id: "2", nome: "Açougue do Carlão" },
    { id: "3", nome: "Derivados da Carne" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do contato:", contato);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContato((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Cadastro de Contatos
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            name="nome"
            value={contato.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <input
            name="cargo"
            value={contato.cargo}
            onChange={handleChange}
            placeholder="Cargo"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <input
            name="email"
            value={contato.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <input
            name="telefone"
            value={contato.telefone}
            onChange={handleChange}
            placeholder="Telefone"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Repita para cargo, email e telefone, alterando o atributo `name` e `placeholder` conforme necessário */}
        <div>
          <select
            name="fornecedorId"
            value={contato.fornecedorId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary "
          >
            <option value="">Selecione um Fornecedor</option>
            {fornecedores.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-md hover:bg-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
