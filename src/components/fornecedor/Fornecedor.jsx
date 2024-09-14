import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

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
    // Carregar fornecedores do Firestore Database
    const fetchFornecedores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "fornecedores"));
        const fornecedoresList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFornecedores(fornecedoresList);
      } catch (error) {
        console.error("Erro ao buscar fornecedores: ", error);
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nome, cnpj, endereco, telefone } = fornecedor;
    if (!nome || !cnpj || !endereco || !telefone) {
      setErro("Todos os campos são obrigatórios");
      return;
    }
    // Adicionar novo fornecedor ao Firestore Database
    try {
      await addDoc(collection(db, "fornecedores"), fornecedor);
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
      // Atualizar a lista de fornecedores
      const querySnapshot = await getDocs(collection(db, "fornecedores"));
      const fornecedoresList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFornecedores(fornecedoresList);
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor: ", error);
      setErro("Erro ao cadastrar fornecedor: " + error.message);
    }
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
            <div className="flex items-center justify-between">
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                type="submit"
              >
                Cadastrar Fornecedor
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4 text-white">
            Lista de Fornecedores
          </h2>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mb-4"
            onClick={handleNovoFornecedor}
          >
            Novo Fornecedor
          </button>
          <div className="space-y-4">
            {fornecedores.map((fornecedor) => (
              <div
                key={fornecedor.id}
                className="bg-gray-700 p-4 rounded-lg shadow-md"
              >
                <div className="flex flex-col space-y-2">
                  <span className="font-semibold text-lg">
                    {fornecedor.nome}
                  </span>
                  <span className="text-sm text-gray-400">
                    CNPJ: {fornecedor.cnpj}
                  </span>
                  <span className="text-sm text-gray-400">
                    Endereço: {fornecedor.endereco}
                  </span>
                  <span className="text-sm text-gray-400">
                    Telefone: {fornecedor.telefone}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
