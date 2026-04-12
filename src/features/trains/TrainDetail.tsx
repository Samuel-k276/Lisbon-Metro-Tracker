import React from "react";
import { useParams } from "react-router-dom";
import { useTrain } from "@/shared/hooks/useTrain";
import { getStationNameById } from "@/shared/utils/metroUtils";
import { formatTimeInSeconds } from "@/shared/utils/helpers";
import { lines } from "@/shared/data/staticData";
import styles from "./TrainDetail.module.scss";

const TrainDetail: React.FC = () => {
  const { trainId } = useParams<{ trainId: string }>();
  const { train, trainInfo, loading, error } = useTrain(trainId);

  if (!trainId) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.error}>Train ID not found</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error || !train || !trainInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.error}>{error || "Train information not available"}</h2>
          <p>
            The train you're looking for may have completed its journey or the information is
            temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  const lineStations = lines[trainInfo.line]?.stations;

  return (
    <div className={styles.container}>
      <div
        className={styles.card}
        style={{ "--line-color": trainInfo.lineColor } as React.CSSProperties}
      >
        <div className={styles.titleRow}>
          <span className={styles.trainIcon}>🚇</span>
          <h1 className={styles.title}>Train {trainId}</h1>
          <span
            className={styles.lineBadge}
            style={{
              backgroundColor: trainInfo.lineColor,
              color: trainInfo.line === "Amarela" ? "#000" : "#fff",
            }}
          >
            {trainInfo.line}
          </span>
        </div>

        <p className={styles.direction}>
          Direction: <strong>{trainInfo.destination}</strong>
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Journey Information</h2>
          {trainInfo.nextStations.map((station, index) => (
            <div key={`${station.stationId}-${index}`} className={styles.stationRow}>
              <span className={styles.stationLeft}>
                <span
                  className={styles.stationDot}
                  style={{ backgroundColor: trainInfo.lineColor }}
                />
                <span style={{ fontWeight: index === 0 ? "bold" : "normal" }}>
                  {station.stationName}
                </span>
                {index === 0 && <span className={styles.nextBadge}>Next station</span>}
              </span>
              <span className={`${styles.arrivalTime} ${index === 0 ? styles.highlight : ""}`}>
                {formatTimeInSeconds(station.arrivalTime)}
              </span>
            </div>
          ))}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Line Information</h2>
          <div className={styles.infoRow}>
            <span>Line:</span>
            <strong>{trainInfo.line}</strong>
          </div>
          <div className={styles.infoRow}>
            <span>Terminals:</span>
            <span className={styles.terminals}>
              {lineStations && (
                <>
                  <span>{getStationNameById(lineStations[0])}</span>
                  <span>→</span>
                  <span>{getStationNameById(lineStations[lineStations.length - 1])}</span>
                </>
              )}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span>Total Stations:</span>
            <strong>{lineStations?.length ?? "N/A"}</strong>
          </div>
        </section>
      </div>
    </div>
  );
};

export { TrainDetail };
