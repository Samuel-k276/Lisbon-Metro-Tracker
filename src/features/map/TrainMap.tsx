import React from "react";
import { useNavigate } from "react-router-dom";
import { Stage, Layer, Circle, Group, Image, Arrow, Text } from "react-konva";
import useImage from "use-image";
import mapaImg from "@/assets/mapa.png";
import { useState, useEffect, useRef } from "react";

import { stationCoordinates, lines } from "@/shared/data/staticData";
import { getStationLines, getLineColor, isTransferStation } from "@/shared/utils/metroUtils";
import { useTrains } from "@/shared/contexts/TrainContext";
import styles from "./TrainMap.module.scss";

const TrainMap: React.FC = () => {
  const stageRef = useRef<any>(null);
  const dimensions = { width: 1034.4, height: 720 };
  const navigate = useNavigate();
  const [backgroundImage] = useImage(mapaImg);
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [hoveredTrain, setHoveredTrain] = useState<string | null>(null);
  const [stageScale] = useState(1);
  const [mapReady, setMapReady] = useState(false);

  const { trainPositions, error: loadingError } = useTrains();

  useEffect(() => {
    if (!backgroundImage) return;
    const timer = setTimeout(() => setMapReady(true), 500);
    return () => clearTimeout(timer);
  }, [backgroundImage]);

  const handleStationClick = (stationId: string) => {
    window.scrollTo(0, 0);
    navigate(`/station/${stationId}`);
  };

  const handleTrainClick = (trainId: string) => {
    window.scrollTo(0, 0);
    navigate(`/train/${trainId}`);
  };

  return (
    <div className={styles.container}>
      {loadingError && <div className={styles.errorBanner}>{loadingError}</div>}

      <div
        className={styles.stageWrapper}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Station clickable areas */}
        {mapReady &&
          Object.values(lines)
            .flatMap((lineData) =>
              lineData.stations.map((stationId) => {
                const coords = stationCoordinates[stationId];
                if (!coords) return null;

                return (
                  <div
                    key={`overlay-station-${stationId}`}
                    onClick={() => handleStationClick(stationId)}
                    onMouseEnter={() => setHoveredStation(stationId)}
                    onMouseLeave={() => setHoveredStation(null)}
                    className={styles.stationOverlay}
                    style={{
                      left: coords.x - 15,
                      top: coords.y - 15,
                      width: 30,
                      height: 30,
                    }}
                  />
                );
              }),
            )
            .filter(Boolean)}

        {/* Train clickable areas */}
        {mapReady &&
          trainPositions.map((train) => (
            <div
              key={`overlay-train-${train.id}`}
              onClick={() => handleTrainClick(train.id)}
              onMouseEnter={() => setHoveredTrain(train.id)}
              onMouseLeave={() => setHoveredTrain(null)}
              className={styles.trainOverlay}
              style={{
                left: train.position.x - 15,
                top: train.position.y - 15,
                width: 30,
                height: 30,
              }}
            />
          ))}

        {/* Konva stage */}
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          scale={{ x: stageScale, y: stageScale }}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Layer name="background">
            {backgroundImage && (
              <Image
                image={backgroundImage}
                width={dimensions.width}
                height={dimensions.height}
                scaleX={1}
                scaleY={1}
                listening={false}
              />
            )}
          </Layer>

          <Layer name="stations">
            {Object.values(lines)
              .flatMap((lineData) =>
                lineData.stations.map((stationId) => {
                  const coords = stationCoordinates[stationId];
                  if (!coords) return null;

                  const stationTransfer = isTransferStation(stationId);
                  const stationLines = getStationLines(stationId);

                  return (
                    <Group key={`station-${stationId}`} x={coords.x} y={coords.y} listening={false}>
                      {stationTransfer ? (
                        <>
                          <Circle
                            radius={hoveredStation === stationId ? 13 : 10}
                            fill="white"
                            stroke={
                              hoveredStation === stationId
                                ? "#2196F3"
                                : getLineColor(stationLines[0] ?? "")
                            }
                            strokeWidth={hoveredStation === stationId ? 3 : 2}
                            shadowColor="rgba(0,0,0,0.3)"
                            shadowBlur={hoveredStation === stationId ? 8 : 4}
                            shadowOffset={{ x: 0, y: 2 }}
                            shadowOpacity={0.6}
                          />
                          <Circle
                            radius={hoveredStation === stationId ? 11 : 8}
                            fill={getLineColor(stationLines[0] ?? "")}
                          />
                        </>
                      ) : (
                        <Circle
                          radius={hoveredStation === stationId ? 8 : 6}
                          fill="white"
                          stroke={
                            hoveredStation === stationId
                              ? "#2196F3"
                              : getLineColor(stationLines[0] ?? "")
                          }
                          strokeWidth={hoveredStation === stationId ? 3 : 2}
                          shadowColor="rgba(0,0,0,0.3)"
                          shadowBlur={hoveredStation === stationId ? 8 : 4}
                          shadowOffset={{ x: 0, y: 2 }}
                          shadowOpacity={0.6}
                        />
                      )}
                    </Group>
                  );
                }),
              )
              .filter(Boolean)}
          </Layer>

          <Layer name="trains">
            {trainPositions.map((train) => (
              <Group
                key={`train-${train.id}`}
                x={train.position.x}
                y={train.position.y}
                listening={false}
              >
                <Circle
                  radius={hoveredTrain === train.id ? 12 : 10}
                  fill="#ED1C24"
                  stroke="white"
                  strokeWidth={hoveredTrain === train.id ? 3 : 1.5}
                  shadowColor="rgba(0,0,0,0.5)"
                  shadowBlur={hoveredTrain === train.id ? 10 : 5}
                  shadowOffset={{ x: 0, y: 3 }}
                  shadowOpacity={0.7}
                />
                <Arrow
                  points={[0, 0, Math.cos(train.angle) * 20, Math.sin(train.angle) * 20]}
                  pointerLength={6}
                  pointerWidth={6}
                  fill="white"
                  stroke="white"
                  strokeWidth={2}
                />
                <Text
                  text={train.id.substring(0, 4)}
                  fontSize={hoveredTrain === train.id ? 12 : 10}
                  fontStyle="bold"
                  fill="white"
                  offsetX={-8}
                  offsetY={-12}
                  shadowColor="black"
                  shadowBlur={3}
                  shadowOffset={{ x: 1, y: 1 }}
                  shadowOpacity={0.8}
                />
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export { TrainMap };
