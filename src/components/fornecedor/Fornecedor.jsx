import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";

export default function Fornecedor() {
  const [fornecedores, setFornecedores] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [editandoFornecedor, setEditandoFornecedor] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

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

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editandoFornecedor) {
        // Atualizar fornecedor existente
        const fornecedorRef = doc(db, "fornecedores", editandoFornecedor.id);
        await updateDoc(fornecedorRef, {
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          endereco: data.endereco,
          cnpj: data.cnpj,
          cep: data.cep,
        });
        setSucesso("Fornecedor atualizado com sucesso!");
      } else {
        // Adicionar novo fornecedor
        const novoFornecedor = {
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          endereco: data.endereco,
          cnpj: data.cnpj,
          cep: data.cep,
        };
        await addDoc(collection(db, "fornecedores"), novoFornecedor);
        setSucesso("Fornecedor cadastrado com sucesso!");
      }
      setError("");
      reset();
      setShowCadastro(false);
      setEditandoFornecedor(null);
      fetchFornecedores(); // Atualizar a lista de fornecedores
    } catch (error) {
      setError("Erro ao cadastrar fornecedor: " + error.message);
      setSucesso("");
    }
  };

  const handleEdit = (fornecedor) => {
    setEditandoFornecedor(fornecedor);
    setValue("nome", fornecedor.nome);
    setValue("telefone", fornecedor.telefone);
    setValue("email", fornecedor.email);
    setValue("endereco", fornecedor.endereco);
    setValue("cnpj", fornecedor.cnpj);
    setValue("cep", fornecedor.cep);
    setShowCadastro(true);
  };

  const handleDelete = async (fornecedorId) => {
    try {
      await deleteDoc(doc(db, "fornecedores", fornecedorId));
      setSucesso("Fornecedor excluído com sucesso!");
      fetchFornecedores(); // Atualizar a lista de fornecedores
    } catch (error) {
      setError("Erro ao excluir fornecedor: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      {showCadastro ? (
        <div>
          <h2 className="text-lg font-bold mb-4 text-white">
            {editandoFornecedor
              ? "Editar Fornecedor"
              : "Cadastro de Fornecedor"}
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {sucesso && <p className="text-green-500 text-center">{sucesso}</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="nome"
              >
                Nome
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="nome"
                type="text"
                {...register("nome", { required: true })}
              />
              {errors.nome && (
                <p className="text-red-500 text-xs italic">
                  Nome é obrigatório.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="telefone"
              >
                Telefone
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="telefone"
                type="text"
                {...register("telefone", { required: true })}
              />
              {errors.telefone && (
                <p className="text-red-500 text-xs italic">
                  Telefone é obrigatório.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="email"
                type="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs italic">
                  Email é obrigatório.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="endereco"
              >
                Endereço
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="endereco"
                type="text"
                {...register("endereco", { required: true })}
              />
              {errors.endereco && (
                <p className="text-red-500 text-xs italic">
                  Endereço é obrigatório.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="cnpj"
              >
                CNPJ
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="cnpj"
                type="text"
                {...register("cnpj", { required: true })}
              />
              {errors.cnpj && (
                <p className="text-red-500 text-xs italic">
                  CNPJ é obrigatório.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-300"
                htmlFor="cep"
              >
                CEP
              </label>
              <input
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="cep"
                type="text"
                {...register("cep", { required: true })}
              />
              {errors.cep && (
                <p className="text-red-500 text-xs italic">
                  CEP é obrigatório.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {editandoFornecedor
                ? "Atualizar Fornecedor"
                : "Cadastrar Fornecedor"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCadastro(false);
                setEditandoFornecedor(null);
                reset();
              }}
              className="w-full p-2 mt-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Voltar
            </button>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-bold mb-4 text-white">
            Lista de Fornecedores
          </h2>
          <button
            onClick={() => setShowCadastro(true)}
            className="mb-4 p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Cadastrar Fornecedor
          </button>
          <div>
            {fornecedores.map((fornecedor) => (
              <div key={fornecedor.id} className="bg-gray-700 p-4 mb-2 rounded">
                <p>
                  <strong>Nome:</strong> {fornecedor.nome}
                </p>
                <p>
                  <strong>Endereço:</strong> {fornecedor.endereco}
                </p>
                <p>
                  <strong>Telefone:</strong> {fornecedor.telefone}
                </p>
                <p>
                  <strong>Email:</strong> {fornecedor.email}
                </p>
                <p>
                  <strong>CNPJ:</strong> {fornecedor.cnpj}
                </p>
                <p>
                  <strong>CEP:</strong> {fornecedor.cep}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(fornecedor)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(fornecedor.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
