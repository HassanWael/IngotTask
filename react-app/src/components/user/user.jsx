import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import Navbar from './navbar';
import FamilyTree from './familyTree';
import members from "./family";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import SelectedUser from '../admin/SelectedUser';
import Divider from '@mui/material/Divider';
export default function User() {

    const [userDetails, setUserDetails] = useState(null);
    const navigate = useNavigate();
    const { setUser, setIsLoggedIn, user } = useContext(AuthContext);
    useEffect(() => {

        if (sessionStorage.getItem('token')) {

            let data = {
                api_token: sessionStorage.getItem('token'),
            };

            axios.get('http://localhost:9000/public/api/user', { params: data }).then((res) => {
                setUserDetails(res.data);
                setIsLoggedIn(true)
                setUser(res.data)
            });
        } else {
            navigate('/signin')
        }

    }, [])
    return (
        <>
            <Navbar />

            <div className="text-center mt-5"><h1>{userDetails ? userDetails.name : ""}</h1></div>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-lg-5">
                        <div className='container-fluid '>
                            {
                                userDetails && userDetails.name ?

                                    <>
                                        <div className="row justify-content-center mt-3">
                                            <div className="col-6">
                                                <TextField id="filled-basic" label="Name" variant="filled" value={userDetails.name} disabled />

                                            </div>
                                            <div className="col-6">
                                                <TextField id="filled-basic" label="Email" variant="filled" value={userDetails.email} disabled />

                                            </div>
                                        </div>
                                        <div className="row justify-content-center mt-3">
                                            <div className="col-4">
                                                <TextField id="filled-basic" label="Birth Date" variant="filled" value={userDetails.birthdate} disabled />

                                            </div>
                                            <div className="col-4">
                                                <TextField id="filled-basic" label="Phone Number" variant="filled" value={userDetails.phone_number} disabled />

                                            </div>
                                            <div className="col-4">
                                                <TextField id="filled-basic" label="Unique Visitors" variant="filled" value={userDetails.uniq_visitors} disabled />

                                            </div>
                                        </div>
                                        <div className="row justify-content-center mt-3">
                                            <div className="col-4">
                                                <TextField id="filled-basic" label="Points" variant="filled" value={userDetails.points} disabled />

                                            </div>
                                            <div className="col-4">
                                                <TextField id="filled-basic" label="Number of Referrals" variant="filled" value={userDetails.children.length} disabled />

                                            </div>
                                            <div className="col-4">
                                                <TextField id="filled-basic" label="Joined at" variant="filled" value={userDetails.created_at} disabled />

                                            </div>
                                        </div>
                                    </>
                                    : ""
                            }
                        </div>
                    </div>
                    <div className="col-lg-2">
                        <Divider orientation="vertical" flexItem>

                        </Divider>
                    </div>
                    <div className="col-lg-5">

                        {
                            userDetails ?
                                <>
                                    {/* <FamilyTree users={[userDetails]} members={members} />
                         */}
                                    <SelectedUser user={userDetails} />

                                </> : "No Tree Yet"
                        }
                    </div>
                </div>
            </div>

        </>
    )
}
