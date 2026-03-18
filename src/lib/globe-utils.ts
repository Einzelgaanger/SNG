import * as THREE from "three";

export const GLOBE_RADIUS = 100;
export const MARKER_ALTITUDE = 3.2;

export function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS + MARKER_ALTITUDE) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
