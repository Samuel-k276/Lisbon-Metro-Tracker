import React, { useState } from "react";
import { stationMappings } from "@/shared/data/stationMappings";
import { metroGraph } from "@/features/planner/graph";
import { getLineColor } from "@/shared/utils/metroUtils";
import styles from "./PlanearViagem.module.scss";

type RouteSegment = {
  tipo: "viagem" | "troca de linha";
  de: string;
  para: string;
  linha?: string;
  tempo: number;
  estacoes: number;
};

type RouteResult = {
  tempoTotal: number;
  estacoes: number;
  trocasLinha: number;
  rota: RouteSegment[];
};

const estacoes = Object.values(stationMappings)
  .map((station) => ({ id: station.id, name: station.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const PlanearViagem: React.FC = () => {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [resultados, setResultados] = useState<RouteResult | null>(null);

  const trocarOrigemDestino = () => {
    setOrigem(destino);
    setDestino(origem);
  };

  const calcularRota = () => {
    if (!origem || !destino) {
      alert("Por favor, selecione a origem e o destino");
      return;
    }

    const resultado = metroGraph.shortestPath(origem, destino);
    const rotaProcessada = metroGraph.formatPathForUI(resultado);

    const tempoTotal = rotaProcessada.segments.reduce((total, seg) => total + seg.tempo, 0);
    const estacoesPart = rotaProcessada.segments
      .filter((seg) => seg.tipo === "viagem")
      .reduce((total, seg) => total + seg.estacoes, 0);

    setResultados({
      tempoTotal,
      estacoes: estacoesPart,
      trocasLinha: rotaProcessada.transbordos,
      rota: rotaProcessada.segments.map((seg) => ({
        ...seg,
        tipo: seg.tipo === "transbordo" ? "troca de linha" : "viagem",
      })),
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Planear Viagem</h1>
      <p className={styles.description}>
        Utilize este planeador para calcular a melhor rota entre duas estações do Metro de Lisboa. O
        sistema vai calcular o caminho mais rápido, incluindo mudanças de linha necessárias.
      </p>

      <div className={styles.card}>
        <div className={styles.formRow}>
          <div className={styles.selectWrapper}>
            <label htmlFor="origem-select">Estação de Origem</label>
            <select id="origem-select" value={origem} onChange={(e) => setOrigem(e.target.value)}>
              <option value="">Selecionar...</option>
              {estacoes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.swapButton} onClick={trocarOrigemDestino}>
            ⇅
          </button>

          <div className={styles.selectWrapper}>
            <label htmlFor="destino-select">Estação de Destino</label>
            <select
              id="destino-select"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            >
              <option value="">Selecionar...</option>
              {estacoes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.submitRow}>
          <button className={styles.submitButton} onClick={calcularRota}>
            Calcular Rota
          </button>
        </div>
      </div>

      {resultados && (
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Resultado</h2>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>⏱</span>
              <div>
                <div className={styles.statLabel}>Tempo Total</div>
                <div className={styles.statValue}>{resultados.tempoTotal} min</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🚇</span>
              <div>
                <div className={styles.statLabel}>Estações</div>
                <div className={styles.statValue}>{resultados.estacoes}</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🔄</span>
              <div>
                <div className={styles.statLabel}>Mudanças de Linha</div>
                <div className={styles.statValue}>{resultados.trocasLinha}</div>
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          <h3 className={styles.sectionTitle}>Itinerário Detalhado</h3>

          <div className={styles.itinerary}>
            {resultados.rota.map((etapa, index) => {
              if (etapa.tipo === "viagem") {
                return (
                  <div
                    key={index}
                    className={styles.legTravel}
                    style={{ borderLeftColor: getLineColor(etapa.linha ?? "") }}
                  >
                    <div className={styles.legHeader}>
                      <span
                        className={styles.legIcon}
                        style={{ color: getLineColor(etapa.linha ?? "") }}
                      >
                        🚇
                      </span>
                      <span>
                        {etapa.de} → {etapa.para}
                      </span>
                      <span
                        className={styles.chip}
                        style={{
                          backgroundColor: getLineColor(etapa.linha ?? ""),
                          color: etapa.linha === "Amarela" ? "#000" : "#fff",
                        }}
                      >
                        {etapa.linha}
                      </span>
                    </div>
                    <div className={styles.legMeta}>
                      {etapa.estacoes} estações • {etapa.tempo} minutos
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className={styles.legTransfer}>
                  <div className={styles.legHeader}>
                    <span className={styles.legIcon}>🚶</span>
                    <span>Mudança de Linha:</span>
                    <span
                      className={styles.chip}
                      style={{
                        backgroundColor: getLineColor(etapa.de ?? ""),
                        color: etapa.de === "Amarela" ? "#000" : "#fff",
                      }}
                    >
                      {etapa.de}
                    </span>
                    <span>→</span>
                    <span
                      className={styles.chip}
                      style={{
                        backgroundColor: getLineColor(etapa.para ?? ""),
                        color: etapa.para === "Amarela" ? "#000" : "#fff",
                      }}
                    >
                      {etapa.para}
                    </span>
                  </div>
                  <div className={styles.legMeta}>Tempo estimado: {etapa.tempo} minutos</div>
                </div>
              );
            })}
          </div>

          <div className={styles.note}>
            <strong>Nota:</strong> Este é um planeador conceptual. Os tempos são estimativas e podem
            variar consoante o horário, ocupação das estações e outros fatores.
          </div>
        </div>
      )}
    </div>
  );
};

export { PlanearViagem };
