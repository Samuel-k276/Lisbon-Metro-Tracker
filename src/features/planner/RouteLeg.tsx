import React from "react";
import { getLineColor } from "@/shared/utils/metroUtils";
import styles from "./PlanearViagem.module.scss";

type RouteLegProps = {
  tipo: "viagem" | "troca de linha";
  de: string;
  para: string;
  linha?: string;
  tempo: number;
  estacoes: number;
};

const LineChip: React.FC<{ name: string }> = ({ name }) => (
  <span
    className={styles.chip}
    style={{
      backgroundColor: getLineColor(name),
      color: name === "Amarela" ? "#000" : "#fff",
    }}
  >
    {name}
  </span>
);

const TravelLeg: React.FC<RouteLegProps> = ({ de, para, linha, tempo, estacoes }) => (
  <div className={styles.legTravel} style={{ borderLeftColor: getLineColor(linha ?? "") }}>
    <div className={styles.legHeader}>
      <span className={styles.legIcon} style={{ color: getLineColor(linha ?? "") }}>
        🚇
      </span>
      <span>
        {de} → {para}
      </span>
      {linha && <LineChip name={linha} />}
    </div>
    <div className={styles.legMeta}>
      {estacoes} estações • {tempo} minutos
    </div>
  </div>
);

const TransferLeg: React.FC<RouteLegProps> = ({ de, para, tempo }) => (
  <div className={styles.legTransfer}>
    <div className={styles.legHeader}>
      <span className={styles.legIcon}>🚶</span>
      <span>Mudança de Linha:</span>
      <LineChip name={de} />
      <span>→</span>
      <LineChip name={para} />
    </div>
    <div className={styles.legMeta}>Tempo estimado: {tempo} minutos</div>
  </div>
);

const RouteLeg: React.FC<RouteLegProps> = (props) => {
  if (props.tipo === "viagem") return <TravelLeg {...props} />;
  return <TransferLeg {...props} />;
};

export { RouteLeg };
export type { RouteLegProps };
