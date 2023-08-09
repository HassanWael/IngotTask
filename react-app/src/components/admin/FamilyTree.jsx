import React, { useEffect } from 'react';
import Tree from 'react-d3-tree';

export default function FamilyTree({ treeData }) {
    const nodeProps = {
        nodeSvgShape: {
            shape: 'circle',
            shapeProps: {
                r: 10,
                fill: 'lightblue',
                stroke: 'blue'
            }
        },
        textLayout: {
            textAnchor: "start",
            x: 20,
            y: 0,
            transform: undefined
        },
        foreignObjectWrapper: {
            y: -20,
            x: -20
        }
    };

    useEffect(()=>{console.log('my reet ',treeData)},[])
    const handleNodeClick = (node)=>{
        console.log(node.data.id)
    }
    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Tree data={treeData} orientation='vertical' nodeProps={nodeProps} onNodeClick={handleNodeClick}/>
        </div>
    );
}