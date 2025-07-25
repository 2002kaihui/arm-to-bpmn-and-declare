import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape"; // A graph visualization library
import edgeStyles from "./edgeStyle"; // Custom styles for edges in the graph
import { getConstraintEdges } from "./constraintMap"; // Function to generate visual edges based on Declare constraints
import { DeclareModel } from "../types/types"; // Type definition for the Declare model
import cola from 'cytoscape-cola';
cytoscape.use(cola);

// Props type: expects a parsed Declare model
type Props = {
  declareModel: DeclareModel;
};

const DeclareVisualizer: React.FC<Props> = ({ declareModel }) => {
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the DOM container where the graph will render
  const cyRef = useRef<cytoscape.Core | null>(null); // Reference to the Cytoscape instance (the graph engine)


  useEffect(() => {
    // Ensure all required data is present before rendering
    if (!containerRef.current || !declareModel || !Array.isArray(declareModel.activities)) return;


    // Initialize Cytoscape instance with container and styles
    const cy = cytoscape({
      container: containerRef.current,
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            width: 80,
            height: 40,
            shape: 'roundrectangle',
            'background-color': '#f0f0f0',
            'border-width': 1.5,
            'border-color': '#333',
            'font-size': 12,
            'font-weight': 'bold'
          }
        },
        {
          // Special style for init-nodes
          selector: 'node.init-node',
          style: {
            'label': 'init',                         // Always shows 'init'
            'text-valign': 'top',                    // Show label above the node
            'text-halign': 'center',
            'background-color': '#ffffff',           // White background
            'border-width': 0,
            'font-size': 18,
            'z-compound-depth': 'bottom',
          }
        },
        ...edgeStyles // Add custom edge styles
      ]
    });
    cy.minZoom(0.1);
    cy.maxZoom(3);
    cyRef.current = cy;

    // Find the init activity if any
    const initActivity = declareModel.unary?.find(u => u.constraint === "init")?.activity;
    const fixedInitPosition = { x: 0, y: 0 };

    // Create a Cytoscape node for each Declare activity
    const nodes = declareModel.activities.map(act => {
      if (act === initActivity) {
        return {
          data: { id: act, label: act },
          position: fixedInitPosition,
          locked: true,
        };
      } else {
        return { data: { id: act, label: act } };
      }
    });


    // Containers for "init" nodes and edges (unary constraints)
    const initNodes: cytoscape.ElementDefinition[] = [];
    const initEdges: cytoscape.ElementDefinition[] = [];

    // If unary constraints exist, extract and handle "init" constraints
    if ("unary" in declareModel) {
      declareModel.unary.forEach((u, idx) => {
        if (u.constraint === "init") {
          const initNodeId = `init-${u.activity}`;


          // Create a new "init" node visually linked to the actual activity
          initNodes.push({
            data: { id: initNodeId },
            position: fixedInitPosition, // use same position as activity node
            locked: true,
            classes: "init-node"
          });


          // Create an edge from the init node to the target activity node
          initEdges.push({
            data: {
              id: `edge-init-${u.activity}`,
              source: initNodeId,
              target: u.activity,
              constraint: "init"
            }
          });
        }
      });
    }

    // Add all activity nodes and "init" nodes to the graph
    cy.add([...nodes, ...initNodes]);

    // Convert Declare constraints (binary) into visual edges
    const edges = declareModel.constraints.flatMap((c, i) =>
      getConstraintEdges(c.constraint, c.source, c.target, i)
    );

    // Add constraint edges and init edges to the graph
    cy.add([...edges, ...initEdges]);

    // auto-layout using cytoscape-cola
    const edgeCount = declareModel.constraints.length;
    const nodeSpacingValue = edgeCount > 7 ? 150 : 40;

    cy.layout({
      name: 'cola',
      edgeLength: function (edge: any) {
        const constraint = edge.data("constraint");
        return constraint === "succession" ? 500 : 250;
      },
      avoidOverlap: true,
      animate: true,
      randomize: false,
      maxSimulationTime: 1500,
    } as any).run();

    // Manually reposition "init" nodes
    cy.nodes(".init-node").forEach(n => {
      const target = cy.getElementById(n.id().replace("init-", ""));
      const pos = target.position();
      n.position({ x: pos.x - 0, y: pos.y - 0 });
    });

    // Clean up the Cytoscape instance on unmount or re-render
    return () => cy.destroy();
  }, [declareModel]);

  return (
    <div>
      <h2 className="text-center my-4 text-xl font-semibold">Declare Model Visualization</h2>


      {/* Buttons for exporting the Declare model */}
      <div className="flex justify-center gap-4 mb-4">
        {/* Download the Declare model as JSON */}
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(declareModel, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "declareModel.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex gap-2 items-center bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Download JSON
        </button>


        {/* Download the current graph as a PNG image */}
        <button
          onClick={() => {
            if (cyRef.current) {
              const png = cyRef.current.png({ full: true });
              const a = document.createElement("a");
              a.href = png;
              a.download = "declareModel_graph.png";
              a.click();
            }
          }}
          className="flex gap-2 items-center bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
        >
          Download PNG
        </button>
      </div>


      {/* Container for Cytoscape graph */}
      <div
        ref={containerRef}
        style={{ width: "100%", height: "700px", border: "1px solid #ccc", backgroundColor: 'white' }}
      />
    </div>
  );
};


export default DeclareVisualizer;