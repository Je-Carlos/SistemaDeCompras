import { useState, useEffect } from "react";
import { database } from "../../firebase/firebaseConfig";
import { ref, set, push, onValue } from "firebase/database";

export default function CadastroContatos() {
  const [fornecedor, setFornecedor] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    cep: "", // Adiciona o campo CEP
  });
  const [fornecedores, setFornecedores] = useState([]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(""); // Adiciona estado para mensagem de sucesso
  const [isCadastroVisible, setIsCadastroVisible] = useState(false);

  useEffect(() => {
    // Carregar fornecedores do Firebase Database
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value;
    setFornecedor((prevState) => ({
      ...prevState,
      cep,
    }));

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFornecedor((prevState) => ({
            ...prevState,
            endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
          }));
        } else {
          setErro("CEP não encontrado");
        }
      } catch (error) {
        setErro("Erro ao buscar o endereço");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nome, cnpj, endereco, telefone } = fornecedor;
    if (!nome || !cnpj || !endereco || !telefone) {
      setErro("Todos os campos são obrigatórios");
      return;
    }
    // Adicionar novo fornecedor ao Firebase Database
    const fornecedoresRef = ref(database, "fornecedores");
    const newFornecedorRef = push(fornecedoresRef);
    set(newFornecedorRef, fornecedor)
      .then(() => {
        console.log("Fornecedor cadastrado com sucesso!");
        setFornecedor({
          nome: "",
          cnpj: "",
          endereco: "",
          telefone: "",
          cep: "",
        });
        setErro("");
        setSucesso("Fornecedor cadastrado com sucesso!"); // Define a mensagem de sucesso
        setIsCadastroVisible(false);
      })
      .catch((error) => {
        console.error("Erro ao cadastrar fornecedor: ", error);
        setErro("Erro ao cadastrar fornecedor: " + error.message);
      });
  };

  const handleNovoFornecedor = () => {
    setFornecedor({
      nome: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      cep: "",
    });
    setErro("");
    setSucesso("");
    setIsCadastroVisible(true);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      {isCadastroVisible ? (
        <>
          <h2 className="text-lg font-bold mb-4 text-white">
            Cadastro de Fornecedores
          </h2>
          {erro && <div className="text-red-500 mb-2">{erro}</div>}
          {sucesso && <div className="text-green-500 mb-2">{sucesso}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="cep"
                className="block text-sm font-medium text-gray-300"
              >
                CEP
              </label>
              <input
                name="cep"
                type="text"
                value={fornecedor.cep}
                onChange={handleCepChange}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
              />
            </div>
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
          {sucesso && <div className="text-green-500 mb-2">{sucesso}</div>}
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
            onClick={handleNovoFornecedor}
            className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Novo Fornecedor
          </button>
        </>
      )}
    </div>
  );
}
