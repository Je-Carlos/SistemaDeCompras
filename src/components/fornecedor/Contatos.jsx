import { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { useForm } from "react-hook-form";

export default function Contatos() {
  const [contatos, setContatos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [showCadastro, setShowCadastro] = useState(false);
  const [editandoContato, setEditandoContato] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  const fetchContatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "contatos"));
      const contatosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContatos(contatosList);
    } catch (error) {
      console.error("Erro ao buscar contatos: ", error);
    }
  };

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
    fetchContatos();
    fetchFornecedores();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editandoContato) {
        // Atualizar contato existente
        const contatoRef = doc(db, "contatos", editandoContato.id);
        await updateDoc(contatoRef, {
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          fornecedorId: data.fornecedorId,
        });
        setSucesso("Contato atualizado com sucesso!");
      } else {
        // Adicionar novo contato
        const novoContato = {
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          fornecedorId: data.fornecedorId,
        };
        await addDoc(collection(db, "contatos"), novoContato);
        setSucesso("Contato cadastrado com sucesso!");
      }
      setError("");
      reset();
      setShowCadastro(false);
      setEditandoContato(null);
      fetchContatos(); // Atualizar a lista de contatos
    } catch (error) {
      setError("Erro ao cadastrar contato: " + error.message);
      setSucesso("");
    }
  };

  const handleEdit = (contato) => {
    setEditandoContato(contato);
    setValue("nome", contato.nome);
    setValue("telefone", contato.telefone);
    setValue("email", contato.email);
    setValue("fornecedorId", contato.fornecedorId);
    setShowCadastro(true);
  };

  const handleDelete = async (contatoId) => {
    try {
      await deleteDoc(doc(db, "contatos", contatoId));
      setSucesso("Contato excluído com sucesso!");
      fetchContatos(); // Atualizar a lista de contatos
    } catch (error) {
      setError("Erro ao excluir contato: " + error.message);
    }
  };

  const getFornecedorNome = (fornecedorId) => {
    const fornecedor = fornecedores.find((f) => f.id === fornecedorId);
    return fornecedor ? fornecedor.nome : "Fornecedor não encontrado";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-800 text-white shadow-md rounded-lg">
      {showCadastro ? (
        <div>
          <h2 className="text-lg font-bold mb-4 text-white">
            {editandoContato ? "Editar Contato" : "Cadastro de Contato"}
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
                {...register("telefone", {
                  required: true,
                  minLength: 11,
                  maxLength: 11,
                })}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 11);
                }}
              />
              {errors.telefone && (
                <p className="text-red-500 text-xs italic">
                  Telefone deve ter exatamente 11 dígitos.
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
                htmlFor="fornecedorId"
              >
                Fornecedor
              </label>
              <select
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                id="fornecedorId"
                {...register("fornecedorId", { required: true })}
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
              </select>
              {errors.fornecedorId && (
                <p className="text-red-500 text-xs italic">
                  Fornecedor é obrigatório.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {editandoContato ? "Atualizar Contato" : "Cadastrar Contato"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCadastro(false);
                setEditandoContato(null);
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
            Lista de Contatos
          </h2>
          <button
            onClick={() => setShowCadastro(true)}
            className="mb-4 p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Cadastrar Contato
          </button>
          <ul>
            {contatos.map((contato) => (
              <li key={contato.id} className="bg-gray-700 p-4 mb-2 rounded">
                <p>
                  <strong>Nome:</strong> {contato.nome}
                </p>
                <p>
                  <strong>Telefone:</strong> {contato.telefone}
                </p>
                <p>
                  <strong>Email:</strong> {contato.email}
                </p>
                <p>
                  <strong>Fornecedor:</strong>{" "}
                  {getFornecedorNome(contato.fornecedorId)}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(contato)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contato.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
