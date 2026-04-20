import { Html, Line, OrbitControls, Sphere, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import { GLOBE_RADIUS, latLngToVector3 } from "@/lib/globe-utils";
import type { ArcDatum, Stakeholder, VisualMode } from "@/types/sng";

interface GlobeSceneProps {
  arcs: ArcDatum[];
  autoRotate: boolean;
  mode: VisualMode;
  nightLights: boolean;
  selectedId?: string | null;
  showConnections: boolean;
  showCountries: boolean;
  stakeholders: Stakeholder[];
  connectedIds?: Set<string>;
  highMatchIds?: Set<string>;
  onSelect: (stakeholder: Stakeholder) => void;
}

function GlobeObject({
  arcs,
  autoRotate,
  mode,
  nightLights,
  onSelect,
  selectedId,
  showConnections,
  showCountries,
  stakeholders,
  connectedIds,
  highMatchIds,
}: GlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthDay = useTexture("/globe/earth-blue-marble.jpg");
  const earthNight = useTexture("/globe/earth-night.jpg");
  const bump = useTexture("/globe/earth-topology.png");

  useFrame((_state, delta) => {
    if (autoRotate && groupRef.current) {
      // Blueprint spec: subtle 0.1 deg/sec auto-rotation
      groupRef.current.rotation.y += delta * 0.018;
    }
  });

  const visibleArcs = useMemo(() => {
    if (!showConnections) return [];
    if (!selectedId) return arcs;
    return arcs.filter((arc) => arc.id.includes(selectedId));
  }, [arcs, selectedId, showConnections]);

  const lineSegments = useMemo(
    () =>
      visibleArcs.map((arc) => {
        const start = latLngToVector3(arc.startLat, arc.startLng, GLOBE_RADIUS + 2);
        const end = latLngToVector3(arc.endLat, arc.endLng, GLOBE_RADIUS + 2);
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + 18);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        return {
          id: arc.id,
          color: arc.color[0],
          points: curve.getPoints(42),
        };
      }),
    [visibleArcs],
  );

  // VGG brand palette per blueprint:
  // viewer = green #4DB848, connected = blue #2E86C1, others = soft slate, selected = bright cyan, high-match = gold ring
  const COLOR_VIEWER = "#4DB848";
  const COLOR_CONNECTED = "#2E86C1";
  const COLOR_DEFAULT = "#94a3b8";
  const COLOR_SELECTED = "#22d3ee";
  const COLOR_HEATMAP = "#f97316";
  const COLOR_HIGH_MATCH_RING = "#f5b400";

  const materialConfig = {
    color: mode === "simple" ? "#0b1220" : undefined,
    emissive: nightLights ? new THREE.Color("#1e3a5f") : new THREE.Color("#000000"),
    emissiveIntensity: nightLights ? 0.15 : 0,
    map: mode === "simple" ? null : mode === "satellite" || nightLights ? earthNight : earthDay,
    bumpMap: mode === "simple" ? null : bump,
    bumpScale: mode === "simple" ? 0 : mode === "satellite" ? 3.2 : 2.4,
    metalness: mode === "satellite" ? 0.18 : 0.08,
    roughness: mode === "satellite" ? 0.78 : 0.88,
  };

  return (
    <group ref={groupRef}>
      <Sphere args={[GLOBE_RADIUS, mode === "simple" ? 28 : 64, mode === "simple" ? 28 : 64]}>
        <meshStandardMaterial {...materialConfig} />
      </Sphere>

      {/* Atmospheric halo — skip in simple mode for performance */}
      {mode !== "simple" && (
        <Sphere args={[GLOBE_RADIUS + 4, 48, 48]}>
          <meshBasicMaterial color={mode === "satellite" ? "#60a5fa" : "#4DB848"} transparent opacity={0.06} side={THREE.BackSide} />
        </Sphere>
      )}

      {showCountries && (
        <Sphere args={[GLOBE_RADIUS + 0.6, 32, 32]}>
          <meshBasicMaterial color={mode === "satellite" ? "#bae6fd" : "#4DB848"} opacity={0.08} transparent wireframe />
        </Sphere>
      )}

      {lineSegments.map((segment) => (
        <Line key={segment.id} points={segment.points} color={segment.color} lineWidth={1.2} transparent opacity={0.5} />
      ))}

      {stakeholders.map((stakeholder) => {
        const elevation = mode === "heatmap" ? 4.5 : 3.2;
        const position = latLngToVector3(stakeholder.lat, stakeholder.lng, GLOBE_RADIUS + elevation);
        const selected = stakeholder.id === selectedId;
        const isConnected = connectedIds?.has(stakeholder.id);
        const isHighMatch = highMatchIds?.has(stakeholder.id);
        const scale = selected ? 1.7 : stakeholder.isViewer ? 1.45 : isConnected ? 1.2 : 1;

        const baseColor = stakeholder.isViewer
          ? COLOR_VIEWER
          : selected
            ? COLOR_SELECTED
            : isConnected
              ? COLOR_CONNECTED
              : mode === "heatmap"
                ? COLOR_HEATMAP
                : COLOR_DEFAULT;

        const radius = mode === "heatmap" ? 2.8 * scale : 1.9 * scale;

        return (
          <group key={stakeholder.id} position={position}>
            {/* Gold ring for high-match stakeholders (blueprint Spec 4.4) */}
            {isHighMatch && !stakeholder.isViewer && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius * 1.8, radius * 2.4, 32]} />
                <meshBasicMaterial color={COLOR_HIGH_MATCH_RING} transparent opacity={0.85} side={THREE.DoubleSide} />
              </mesh>
            )}
            <mesh onClick={() => onSelect(stakeholder)}>
              <sphereGeometry args={[radius, 18, 18]} />
              <meshStandardMaterial
                color={baseColor}
                emissive={baseColor}
                emissiveIntensity={selected ? 0.95 : stakeholder.isViewer ? 0.7 : isConnected ? 0.55 : 0.3}
                transparent
                opacity={mode === "heatmap" ? 0.7 : 0.95}
              />
            </mesh>
            {selected && (
              <Html distanceFactor={10} center>
                <div className="rounded-lg border border-border/60 bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm">
                  {stakeholder.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
  return (
    <div className="h-full w-full overflow-hidden rounded-none">
      <Canvas camera={{ position: [0, 0, 260], fov: 38 }}>
        <color attach="background" args={["#080d1a"]} />
        <fog attach="fog" args={["#080d1a", 240, 420]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[220, 120, 160]} intensity={1.6} />
        <Suspense fallback={null}>
          <Stars radius={300} depth={80} count={2500} factor={3} saturation={0.1} fade speed={0.3} />
          <GlobeObject {...props} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={180} maxDistance={340} autoRotate={false} />
      </Canvas>
    </div>
  );
}
