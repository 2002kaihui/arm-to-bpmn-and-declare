// Maps Declare constraints to Cytoscape edge class combinations
import cytoscape from 'cytoscape';


/**
 * Generates Cytoscape edge(s) based on a Declare constraint type between a source and target node.
 *
 * Each edge is assigned class names for visual styling (e.g., arrows, circles)
 * that are defined in external style files named `edgeStyle.ts`.
 *
 * @function
 * @param {string} constraint - The Declare constraint type (e.g., 'succession', 'response')
 * @param {string} source - The ID of the source node in the graph
 * @param {string} target - The ID of the target node in the graph
 * @param {number} index - An index to ensure uniqueness of edge IDs
 * @returns {cytoscape.ElementDefinition[]} Array of Cytoscape edge definitions with styling classes
 *
 */
export function getConstraintEdges(constraint: string, source: string, target: string, index: number): cytoscape.ElementDefinition[] {
    //Normalizes the constraint name
    const normalized = constraint.toLowerCase().replace(/[\s-]/g, '_');
    //Creates a unique id for each edge
    const idPrefix = `${source}->${target}-${normalized}-${index}`;


    switch (normalized) {
        case 'succession':
            return [
                /*
                {
                data: { id: `${idPrefix}`, source, target },
                classes: 'succession-combo'
                }
                 */
                /*
                {
                data: { id: `${idPrefix}-triangle`, source, target },
                classes: 'succession-triangle'
                },
                {
                data: { id: `${idPrefix}-circle`, source, target },
                classes: 'succession-circle-back'
                }
                */
                {
                data: { id: `${idPrefix}-main`, source, target },
                classes: 'succession-main'
                },
                {
                data: { id: `${idPrefix}-sourcecircle`, source, target },
                classes: 'succession-source-circle'
                },
                {
                data: { id: `${idPrefix}-targettriangle`, source, target },
                classes: 'succession-target-triangle'
                },
                {
                data: { id: `${idPrefix}-targetcircle`, source, target },
                classes: 'succession-target-circle'
                }
            ];
           
        case 'precedence':
            return [
                {
                    data: { id: `${idPrefix}-triangle`, source, target },
                    classes: 'precedence-arrow',
                },
                {
                    data: { id: `${idPrefix}-circle`, source, target },
                    classes: 'precedence-circle-offset',
                }
        ];
        case 'response':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-single source-circle-target-triangle'
                }
            ];
        case 'neg_precedence':
            return [
                {
                    data: { id: `${idPrefix}-circle`, source, target },
                    classes: 'line-negative compound-arrow-circle'
                },
                {
                    data: { id: `${idPrefix}-triangle`, source, target },
                    classes: 'line-negative compound-arrow-triangle'
                }
            ];
        case 'neg_response':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-negative source-circle-target-triangle'
                }
            ];
        case 'not_coexistence':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-negative both-circle'
                }
            ];
        case 'resp_absence':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-negative source-circle'
                }
            ];
        case 'coexistence':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-single both-circle'
                }
            ];
        case 'chain_succession':
            return [
                {
                    data: { id: `${idPrefix}-1`, source, target },
                    classes: 'line-triple-1'
                },
                {
                    data: { id: `${idPrefix}-2`, source, target },
                    classes: 'line-triple-2 source-circle compound-arrow-circle'
                },
                {
                    data: { id: `${idPrefix}-2`, source, target },
                    classes: 'line-triple-2 compound-arrow-triangle'
                },
                {
                    data: { id: `${idPrefix}-3`, source, target },
                    classes: 'line-triple-3'
                }
            ];
        case 'chain_response':
            return [
                {
                    data: { id: `${idPrefix}-1`, source, target },
                    classes: 'line-triple-1'
                },
                {
                    data: { id: `${idPrefix}-2`, source, target },
                    classes: 'line-triple-2 source-circle-target-triangle'
                },
                {
                    data: { id: `${idPrefix}-3`, source, target },
                    classes: 'line-triple-3'
                }
            ];
        case 'chain_precedence':
            return [
                {
                    data: { id: `${idPrefix}-1`, source, target },
                    classes: 'line-triple-1'
                },
                {
                    data: { id: `${idPrefix}-2`, source, target },
                    classes: 'line-triple-2 compound-arrow-circle'
                },
                {
                    data: { id: `${idPrefix}-2`, source, target },
                    classes: 'line-triple-2 compound-arrow-triangle'
                },
                {
                    data: { id: `${idPrefix}-3`, source, target },
                    classes: 'line-triple-3'
                }
            ];
        case 'resp_existence':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-single source-circle'
                }
            ];
        case 'choice':
            return [
                {
                    data: { id: `${idPrefix}`, source, target },
                    classes: 'line-choice'
                }
            ];
        default:   //If there is an undefined constraint, it is shown with just a solid line and its label.
            return [
                {
                    data: { id: `${idPrefix}`, source, target, label: normalized },
                    classes: 'line-single'
                }
            ];
    }
}
