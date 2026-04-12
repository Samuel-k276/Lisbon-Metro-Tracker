import React from "react";
import { formatTimeInSeconds } from "@/shared/utils/helpers";
import styles from "./TrainDetail.module.scss";

type StationArrivalRowProps = {
  stationName: string;
  arrivalTime: number;
  lineColor: string;
  isNext: boolean;
};

const StationArrivalRow: React.FC<StationArrivalRowProps> = ({
  stationName,
  arrivalTime,
  lineColor,
  isNext,
}) => {
  return (
    <div className={styles.stationRow}>
      <span className={styles.stationLeft}>
        <span className={styles.stationDot} style={{ backgroundColor: lineColor }} />
        <span style={{ fontWeight: isNext ? "bold" : "normal" }}>{stationName}</span>
        {isNext && <span className={styles.nextBadge}>Next station</span>}
      </span>
      <span className={`${styles.arrivalTime} ${isNext ? styles.highlight : ""}`}>
        {formatTimeInSeconds(arrivalTime)}
      </span>
    </div>
  );
};

export { StationArrivalRow };
export type { StationArrivalRowProps };
