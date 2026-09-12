"use client";

import { useEffect, useMemo, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useStore } from "@/lib/store";
import CardNode, { CardNodeData } from "./CardNode";
import LabeledEdge from "./LabeledEdge";
import NodeDrawer from "./NodeDrawer";
import RootFinderBar from "./RootFinderBar";

const nodeTypes = { cardNode: CardNode };
const edgeTypes = { labeledEdge: LabeledEdge };

function GraphInner() {
  const cards = useStore((s) => s.cards);
  const activeCardId = useStore((s) => s.activeCardId);
  const setActiveCard = useStore((s) => s.setActiveCard);
  const updateCardPosition = useStore((s) => s.updateCardPosition);
  const rootFinderActive = useStore((s) => s.rootFinderActive);
  const rootFinderFirstId = useStore((s) => s.rootFinderFirstId);
  const pickRootFinderNode = useStore((s) => s.pickRootFinderNode);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CardNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync store cards -> react-flow nodes, preserving any in-progress drag positions.
  useEffect(() => {
    setNodes((current) => {
      const byId = new Map(current.map((n) => [n.id, n]));
      return cards.map((card) => {
        const existing = byId.get(card.id);
        return {
          id: card.id,
          type: "cardNode",
          position: existing ? existing.position : card.position,
          data: {
            card,
            isRootPick: rootFinderFirstId === card.id,
            rootFinderActive,
          },
        } as Node<CardNodeData>;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, rootFinderFirstId, rootFinderActive]);

  useEffect(() => {
    const nextEdges: Edge[] = [];
    const cardIds = new Set(cards.map((c) => c.id));
    cards.forEach((card) => {
      card.connections.forEach((conn) => {
        if (!cardIds.has(conn.targetId)) return;
        nextEdges.push({
          id: `${card.id}->${conn.targetId}`,
          source: card.id,
          target: conn.targetId,
          type: "labeledEdge",
          className: conn.aiGenerated ? "root-edge" : undefined,
          data: { description: conn.description, aiGenerated: !!conn.aiGenerated },
        });
      });
    });
    setEdges(nextEdges);
  }, [cards, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_e, node) => {
      if (rootFinderActive) {
        pickRootFinderNode(node.id);
      } else {
        setActiveCard(node.id);
      }
    },
    [rootFinderActive, pickRootFinderNode, setActiveCard]
  );

  const handleNodeDragStop = useCallback(
    (_e: unknown, node: Node) => {
      updateCardPosition(node.id, node.position);
    },
    [updateCardPosition]
  );

  const defaultViewport = useMemo(() => ({ x: 0, y: 0, zoom: 0.85 }), []);

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={defaultViewport}
        minZoom={0.25}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#26262f" />
        <Controls showInteractive={false} />
      </ReactFlow>

      <RootFinderBar />

      {activeCardId && (
        <NodeDrawer cardId={activeCardId} onClose={() => setActiveCard(null)} />
      )}
    </div>
  );
}

export default function GraphView() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
