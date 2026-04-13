"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { PACT_NODES, canSelectNode, canDeselectNode, findShortestPath } from "@/data/pacts";
import { PACT_POINT_LIMIT } from "@/types/dps";
import type { PactNode } from "@/types/dps";

interface Props {
  selected: string[];
  onChange: (pacts: string[]) => void;
}

const BRANCH_COLORS = {
  melee: { fill: "#dc2626", stroke: "#ef4444", glow: "rgba(239,68,68,0.5)" },
  ranged: { fill: "#16a34a", stroke: "#22c55e", glow: "rgba(34,197,94,0.5)" },
  magic: { fill: "#2563eb", stroke: "#3b82f6", glow: "rgba(59,130,246,0.5)" },
  null: { fill: "#d97706", stroke: "#f59e0b", glow: "rgba(245,158,11,0.5)" },
} as const;

const NODE_RADIUS = { node_minor: 10, node_major: 15, node_capstone: 20 };

// Compute viewBox bounds from node positions
const xs = PACT_NODES.map(n => n.position.x);
const ys = PACT_NODES.map(n => n.position.y);
const PAD = 40;
const MIN_X = Math.min(...xs) - PAD;
const MIN_Y = Math.min(...ys) - PAD;
const TREE_W = Math.max(...xs) - MIN_X + PAD;
const TREE_H = Math.max(...ys) - MIN_Y + PAD;

export function PactSkillTree({ selected, onChange }: Props) {
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const [tooltip, setTooltip] = useState<PactNode | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // Pan/zoom state
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: MIN_X, y: MIN_Y, w: TREE_W, h: TREE_H });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  const handleNodeClick = useCallback((node: PactNode) => {
    if (selectedSet.has(node.id)) {
      if (canDeselectNode(node.id, selectedSet)) {
        onChange(selected.filter(id => id !== node.id));
      }
    } else if (canSelectNode(node.id, selectedSet)) {
      // Direct neighbor — just add it
      onChange([...selected, node.id]);
    } else {
      // Not adjacent — find shortest path and select all intermediate nodes
      const path = findShortestPath(node.id, selectedSet);
      if (path) {
        onChange([...selected, ...path]);
      }
    }
  }, [selected, onChange, selectedSet]);

  const handleReset = useCallback(() => {
    onChange([]);
  }, [onChange]);

  // Zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox(vb => {
      const newW = vb.w * factor;
      const newH = vb.h * factor;
      const dx = (vb.w - newW) / 2;
      const dy = (vb.h - newH) / 2;
      return { x: vb.x + dx, y: vb.y + dy, w: newW, h: newH };
    });
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    // Only start pan if clicking on background, not on a node
    if ((e.target as Element).tagName === "svg" || (e.target as Element).tagName === "line" || (e.target as Element).tagName === "rect") {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y };
    }
  }, [viewBox]);

  useEffect(() => {
    if (!isPanning) return;
    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBox.w / rect.width;
      const scaleY = viewBox.h / rect.height;
      const dx = (e.clientX - panStart.current.x) * scaleX;
      const dy = (e.clientY - panStart.current.y) * scaleY;
      setViewBox(vb => ({ ...vb, x: panStart.current.vx - dx, y: panStart.current.vy - dy }));
    };
    const handleMouseUp = () => setIsPanning(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, viewBox.w, viewBox.h]);

  // Build edge list (deduplicated)
  const edges: { from: PactNode; to: PactNode }[] = [];
  const edgeSet = new Set<string>();
  const nodeMap = new Map(PACT_NODES.map(n => [n.id, n]));

  for (const node of PACT_NODES) {
    for (const linkedId of node.linkedNodes) {
      const key = [node.id, linkedId].sort().join("-");
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      const linked = nodeMap.get(linkedId);
      if (linked) edges.push({ from: node, to: linked });
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 text-sm font-semibold text-osrs-gold uppercase tracking-wider hover:text-osrs-gold/80 transition-colors"
        >
          <span className={`transition-transform ${collapsed ? "" : "rotate-90"}`}>&#9654;</span>
          <h3>Pact Tree</h3>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs text-osrs-text-dim">
            <span className={selected.length >= PACT_POINT_LIMIT ? "text-demon-glow" : "text-osrs-gold"}>{selected.length}</span>/{PACT_POINT_LIMIT} points
          </span>
          {selected.length > 0 && (
            <button onClick={handleReset} className="text-[10px] text-osrs-text-dim hover:text-osrs-text hover:underline">
              Reset
            </button>
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Branch legend */}
          <div className="flex gap-3 text-[10px] text-osrs-text-dim">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Melee</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600" /> Ranged</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /> Magic</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600" /> General</span>
          </div>

          {/* SVG Tree */}
          <div className="relative bg-osrs-darker rounded-lg border border-osrs-border overflow-hidden" style={{ height: "400px" }}>
            <svg
              ref={svgRef}
              viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
              className="w-full h-full"
              style={{ cursor: isPanning ? "grabbing" : "grab" }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
            >
              {/* Background rect for pan target */}
              <rect x={viewBox.x} y={viewBox.y} width={viewBox.w} height={viewBox.h} fill="transparent" />

              {/* Edges */}
              {edges.map(({ from, to }) => {
                const bothSelected = selectedSet.has(from.id) && selectedSet.has(to.id);
                return (
                  <line
                    key={`${from.id}-${to.id}`}
                    x1={from.position.x} y1={from.position.y}
                    x2={to.position.x} y2={to.position.y}
                    stroke={bothSelected ? "#f59e0b" : "#374151"}
                    strokeWidth={bothSelected ? 2 : 1}
                    opacity={bothSelected ? 0.9 : 0.4}
                  />
                );
              })}

              {/* Nodes */}
              {PACT_NODES.map(node => {
                const isSelected = selectedSet.has(node.id);
                const isReachable = !isSelected && canSelectNode(node.id, selectedSet);
                const branchKey = node.branch ?? "null";
                const colors = BRANCH_COLORS[branchKey as keyof typeof BRANCH_COLORS];
                const r = NODE_RADIUS[node.size];
                let fill = "#1f2937"; // unreachable: dark
                let stroke = "#374151";
                let opacity = 0.5;
                let glowFilter = "";

                if (isSelected) {
                  fill = colors.fill;
                  stroke = "#f59e0b";
                  opacity = 1;
                  glowFilter = `drop-shadow(0 0 4px ${colors.glow})`;
                } else if (isReachable) {
                  fill = "#374151";
                  stroke = colors.stroke;
                  opacity = 0.8;
                }

                return (
                  <g
                    key={node.id}
                    data-testid={`node-${node.id}`}
                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node); }}
                    onMouseEnter={() => setTooltip(node)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ cursor: "pointer", filter: glowFilter }}
                  >
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={r}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={opacity}
                    />
                    {/* Capstone diamond indicator */}
                    {node.size === "node_capstone" && (
                      <polygon
                        points={`${node.position.x},${node.position.y - r - 4} ${node.position.x + 4},${node.position.y - r} ${node.position.x},${node.position.y - r + 4} ${node.position.x - 4},${node.position.y - r}`}
                        fill={isSelected ? "#f59e0b" : stroke}
                        opacity={opacity}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Tooltip panel */}
            {tooltip && (
              <div className="absolute bottom-0 left-0 right-0 bg-osrs-panel/95 border-t border-osrs-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-osrs-gold">{tooltip.name}</span>
                  <span className="text-[10px] text-osrs-text-dim capitalize">
                    {tooltip.branch ?? "general"} &middot; {tooltip.size.replace("node_", "")}
                  </span>
                </div>
                <div className="text-xs text-osrs-text">{tooltip.description}</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
