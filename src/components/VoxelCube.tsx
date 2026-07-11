import type { CSSProperties } from "react";

type VoxelCubeProps = {
  className?: string;
  front: string;
  side?: string;
  top?: string;
  label?: string;
};

export function VoxelCube({ className = "", front, side = front, top = front, label }: VoxelCubeProps) {
  const style = {
    "--cube-front": `url("${front}")`,
    "--cube-side": `url("${side}")`,
    "--cube-top": `url("${top}")`,
  } as CSSProperties;

  return (
    <div className={`voxel-cube ${className}`} style={style} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <div className="voxel-cube__body">
        <span className="voxel-cube__face voxel-cube__face--front" />
        <span className="voxel-cube__face voxel-cube__face--back" />
        <span className="voxel-cube__face voxel-cube__face--right" />
        <span className="voxel-cube__face voxel-cube__face--left" />
        <span className="voxel-cube__face voxel-cube__face--top" />
        <span className="voxel-cube__face voxel-cube__face--bottom" />
      </div>
    </div>
  );
}
