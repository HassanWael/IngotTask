import axios from 'axios';
import React, { useEffect, useState } from 'react'
import FamilyTree from './FamilyTree';
import { Button } from '@mui/material';


export default function SelectedUser({ user }) {
    const [treeData, setTreeData] = useState({});
    const [layers, setLayers] = useState(2);
    useEffect(() => {

        if (user && user.is_admin) {

            axios.get(`http://localhost:9000/public/api/user`, {
                params: {
                    api_token: user.api_token,
                    user_id: user.id,
                    layers: layers
                }
            }).then((res) => {
                console.log('this is americxa', res.data)
                let myFam = res.data.children.map((child) => destroyChild(child))
                console.log('destr', myFam)
                setTreeData(res.data)
            });
        }

    }, [user,layers])

    const destroyChild = (child) => {
        child.name = child.user.name

        if (child.children && child.children.length > 0) {
            child.children.map((chi) => destroyChild(chi))
        }
        return child
    }
    const addMoreLayer = () => {
        setLayers(prev =>  prev + 1 )
    }

    return (
        <div>
            {treeData != {} ?
                <FamilyTree treeData={treeData} /> :
                "No Family yet"
            }
            <Button onClick={addMoreLayer} > Layer +</Button>
        </div>
    )
}
