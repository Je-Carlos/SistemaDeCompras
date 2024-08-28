import { useState, useEffect } from "react";

function CadastroContatos() {
  const [fornecedor, setFornecedor] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
  });
  const [fornecedores, setFornecedores] = useState([]);
  const [erro, setErro] = useState("");
  const [isCadastroVisible, setIsCadastroVisible] = useState(false);

  useEffect(() => {
    // Simulação de busca de fornecedores do servidor
    const fetchFornecedores = async () => {
      const data = [
        {
          id: 1,
          nome: "Fornecedor A",
          cnpj: "00.000.000/0000-00",
          endereco: "Endereço A",
          telefone: "123456789",
        },
        {
          id: 2,
          nome: "Fornecedor B",
          cnpj: "11.111.111/1111-11",
          endereco: "Endereço B",
          telefone: "987654321",
        },
      ];
      setFornecedores(data);
    };
    fetchFornecedores();
  }, []);

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
    // Aqui você pode adicionar a lógica para enviar os dados para o servidor
    setFornecedores((prevState) => [
      ...prevState,
      { ...fornecedor, id: prevState.length + 1 },
    ]);
    setFornecedor({ nome: "", cnpj: "", endereco: "", telefone: "" });
    setErro("");
    setIsCadastroVisible(false);
    alert("Fornecedor cadastrado com sucesso!");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      {isCadastroVisible ? (
        <>
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
          <button
            onClick={() => setIsCadastroVisible(false)}
            className="w-full p-2 mt-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Voltar
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4 text-white">
            Lista de Fornecedores
          </h2>
          <ul className="mb-4">
            {fornecedores.map((fornecedor) => (
              <li key={fornecedor.id} className="mb-2 p-2 bg-gray-700 rounded">
                <p className="text-sm text-gray-300">Nome: {fornecedor.nome}</p>
                <p className="text-sm text-gray-300">CNPJ: {fornecedor.cnpj}</p>
                <p className="text-sm text-gray-300">
                  Endereço: {fornecedor.endereco}
                </p>
                <p className="text-sm text-gray-300">
                  Telefone: {fornecedor.telefone}
                </p>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setIsCadastroVisible(true)}
            className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Novo Fornecedor
          </button>
        </>
      )}
    </div>
  );
}

export default CadastroContatos;
