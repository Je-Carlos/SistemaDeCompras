import { useEffect, useState } from "react";

export default function ConsultaCotacao() {
  const [produtos, setProdutos] = useState([
    { id: "1", nome: "Maminha" },
    { id: "2", nome: "Ancho" },
  ]);
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [cotacoes, setCotacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    // Simulação: Buscar produtos existentes
    if (produtoSelecionado === "1") {
      setCotacoes([
        { dataCotacao: "2023-04-01", preco: "R$ 10,00" },
        { dataCotacao: "2023-04-02", preco: "R$ 11,00" },
      ]);
    } else if (produtoSelecionado === "2") {
      setCotacoes([
        { dataCotacao: "2023-04-01", preco: "R$ 20,00" },
        { dataCotacao: "2023-04-02", preco: "R$ 21,00" },
      ]);
    } else {
      setCotacoes([]); // Limpa as cotações se nenhum produto estiver selecionado
    }
  }, [produtoSelecionado]); // Dependência: produtoSelecionado

  // setProdutos(resultadoDaBusca);

  useEffect(() => {
    if (produtoSelecionado) {
      setCarregando(true);
      // Simulação: Buscar cotações do produto selecionado
      // setCotacoes(resultadoDaBusca);
      setCarregando(false);
    }
  }, [produtoSelecionado]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Consulta de Cotações por Produto
      </h2>
      <div className="mb-4">
        <select
          value={produtoSelecionado}
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          className="p-2 border border-slate-100 rounded-md"
        >
          <option value="">Selecione um Produto</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : cotacoes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2">Data</th>
                <th className="p-2">Preço</th>
              </tr>
            </thead>
            <tbody>
              {cotacoes.map((cotacao, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{cotacao.dataCotacao}</td>
                  <td className="p-2">{cotacao.preco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : produtoSelecionado ? (
        <p>Nenhuma cotação encontrada para o produto selecionado.</p>
      ) : null}
    </div>
  );
}
