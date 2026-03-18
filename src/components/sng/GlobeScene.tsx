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
}: GlobeSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthDay = useTexture("/globe/earth-blue-marble.jpg");
  const earthNight = useTexture("/globe/earth-night.jpg");
  const bump = useTexture("/globe/earth-topology.png");

  useFrame((_state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
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

  const materialConfig = {
    color: mode === "simple" ? "hsl(var(--secondary))" : undefined,
    emissive: nightLights ? new THREE.Color("#ffb703") : new THREE.Color("#000000"),
    emissiveIntensity: nightLights ? 0.15 : 0,
    map: mode === "simple" ? null : mode === "satellite" || nightLights ? earthNight : earthDay,
    bumpMap: mode === "simple" ? null : bump,
    bumpScale: mode === "simple" ? 0 : 2.4,
    metalness: 0.05,
    roughness: 0.92,
  };

  return (
    <group ref={groupRef}>
      <Sphere args={[GLOBE_RADIUS, mode === "simple" ? 28 : 64, mode === "simple" ? 28 : 64]}>
        <meshStandardMaterial {...materialConfig} />
      </Sphere>

      {showCountries && (
        <Sphere args={[GLOBE_RADIUS + 0.6, 32, 32]}>
          <meshBasicMaterial color="hsl(var(--foreground))" opacity={0.08} transparent wireframe />
        </Sphere>
      )}

      {lineSegments.map((segment) => (
        <Line key={segment.id} points={segment.points} color={segment.color} lineWidth={1.2} transparent opacity={0.45} />
      ))}

      {stakeholders.map((stakeholder) => {
        const position = latLngToVector3(stakeholder.lat, stakeholder.lng, GLOBE_RADIUS + (mode === "heatmap" ? 4.5 : 3.2));
        const selected = stakeholder.id === selectedId;
        const scale = selected ? 1.7 : stakeholder.isViewer ? 1.35 : 1;

        return (
          <group key={stakeholder.id} position={position}>
            <mesh onClick={() => onSelect(stakeholder)}>
              <sphereGeometry args={[mode === "heatmap" ? 2.8 * scale : 1.9 * scale, 18, 18]} />
              <meshStandardMaterial
                color={stakeholder.isViewer ? "#F7B731" : selected ? "#F97316" : mode === "heatmap" ? "#FB7185" : "#2DD4BF"}
                emissive={stakeholder.isViewer ? "#F7B731" : selected ? "#F97316" : "#2DD4BF"}
                emissiveIntensity={selected ? 0.85 : 0.35}
                transparent
                opacity={mode === "heatmap" ? 0.66 : 0.95}
              />
            </mesh>
            {selected && (
              <Html distanceFactor={10} center>
                <div className="rounded-full border border-border bg-background/95 px-3 py-1 text-xs font-medium text-foreground shadow-lg backdrop-blur-sm">
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

export function GlobeScene(props: GlobeSceneProps) {
  return (
    <div className="h-full w-full rounded-[2rem] border border-border/70 bg-card/40 shadow-[0_25px_90px_hsl(var(--foreground)/0.18)] backdrop-blur-md">
      <Canvas camera={{ position: [0, 0, 260], fov: 38 }}>
        <color attach="background" args={["#07111f"]} />
        <fog attach="fog" args={["#07111f", 240, 420]} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[220, 120, 160]} intensity={1.8} />
        <Suspense fallback={null}>
          <Stars radius={300} depth={80} count={3000} factor={3.2} saturation={0} fade speed={0.3} />
          <GlobeObject {...props} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={180} maxDistance={340} autoRotate={false} />
      </Canvas>
    </div>
  );
}
