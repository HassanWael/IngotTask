import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../user/navbar';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CustomTabPanel from './CustomTabPanel';
import SearchUsers from './SearchUsers';
import SelectedUser from './SelectedUser';
import { Avatar, TextField } from '@mui/material';
import BarChart from '../charts/barChart';
import PieChart from '../charts/pieChart';
import LineChart from '../charts/lineChart';
import { UserData } from "./Data";

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AdminUser() {

    // init states 
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    const { setUser, setIsLoggedIn, user, isLoggedIn } = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [barChartData, setBarChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const [userData, setUserData] = useState({
        labels: UserData.map((data) => data.year),
        datasets: [
            {
                label: "Users Gained",
                data: UserData.map((data) => data.userGain),
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0",
                ],
                borderColor: "black",
                borderWidth: 2,
            },
        ],
    });

    useEffect(() => {

        if (!sessionStorage.getItem('token')) {
            navigate('/signin')
        }
        if (Object.keys(user).length === 0 && sessionStorage.getItem('token')) {

            let data = {
                api_token: sessionStorage.getItem('token'),
            };

            axios.get('http://localhost:9000/public/api/user', { params: data }).then((res) => {
                setIsLoggedIn(true)
                setUser(res.data)

                // check if the user is not admin
                if (res.data.is_admin != 1) {
                    navigate('/signup')
                }

            });
        }

        // get all users for the table
        axios.get('http://localhost:9000/public/api/users',
            {
                params: {
                    api_token: sessionStorage.getItem('token')
                }
            }).
            then((res) => {
                setUsers(res.data)
                // use this api for pie chart data
                const convertData = {
                    labels: res.data.slice(0, 10).map((data) => data.name),
                    datasets: [
                        {
                            label: "Users Gained",
                            data: res.data.slice(0, 10).map((data) => data.points),
                            backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                        },
                    ],
                }
                setPieChartData(convertData)

            });

        // get barchart data
        axios.get('http://localhost:9000/public/api/getRefferChart',
            {
                params: {
                    api_token: sessionStorage.getItem('token')
                }
            }).
            then((res) => {
                const convertData = {
                    labels: res.data.slice(0, 14).map((data) => data.day_date),
                    datasets: [
                        {
                            label: "Users Gained",
                            data: res.data.slice(0, 14).map((data) => data.total),
                            backgroundColor: [
                                "rgba(75,192,192,1)",
                                "#ecf0f1",
                                "#50AF95",
                                "#f3ba2f",
                                "#2a71d0",
                            ],
                            borderColor: "black",
                            borderWidth: 2,
                        },
                    ],
                }
                setBarChartData(convertData)
            });
    }, [])

    useEffect(() => {
        console.log(selectedUser)
    }, [selectedUser])
    // handle change for react tabs
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // columns for the users data grid  table 
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: ' Full name', width: 130 },
        { field: 'email', headerName: ' E-mail', width: 130 },
        { field: 'created_at', headerName: 'Registration Date,', width: 130 },
        { field: 'noOfReferred', headerName: 'Number of Referred Users', width: 130 },
        { field: 'points', headerName: 'Points', width: 130 },
        {
            field: "link",
            headerName: "link",
            width: 150,
            renderCell: (params) => {
                return <a href={params.value}>{params.value}</a>
            }
        },
        { field: 'uniq_visitors', headerName: 'Uniq.Visitors', width: 130 },
        { field: 'all_visitors', headerName: 'All Visitors', width: 130 },
    ];

    // rows for the users grid table 
    const rows = users.map((user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            noOfReferred: user.children.length,
            points: user.points,
            link: `http://localhost:3000/signup/${user.reffer_code}`,
            uniq_visitors: user.uniq_visitors,
            all_visitors: user.all_visitors,

        }
    });


    return (
        <div>
            <Navbar />
            <h1>
                {/* Welcome {user.name} */}
            </h1>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', textAlign: "center" }}>
                <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Users" {...a11yProps(0)} />
                    <Tab label="Search" {...a11yProps(1)} />
                    <Tab label="Dashboard" {...a11yProps(2)} />
                </Tabs>
            </Box>


            <div className='container-fluid'>
                <div className="row">
                    <div className="col-lg-1"></div>
                    <div className="col-lg-10">
                        <CustomTabPanel value={value} index={0} style={{ textAlign: 'center' }}>
                            <DataGrid
                                rows={rows}
                                style={{ textAlign: "center" }}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection

                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <div className="row">
                                <SearchUsers users={users} setSelectedUser={setSelectedUser} />

                            </div>
                            <div className="row mt-5">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className='text-center'>
                                                {
                                                    selectedUser && selectedUser.user_image ?
                                                        <img className='rounded-circle' width={"120px"} height={'120px'} src={`http://localhost:9000/public/images/${selectedUser.user_image}`} alt="" /> : ""
                                                }
                                            </div>
                                            {
                                                selectedUser && selectedUser.name ?


                                                    <div className='container-fluid '>
                                                        <div className="row justify-content-center mt-3">
                                                            <div className="col-6">
                                                                <TextField id="filled-basic" label="Name" variant="filled" value={selectedUser.name} disabled />

                                                            </div>
                                                            <div className="col-6">
                                                                <TextField id="filled-basic" label="Email" variant="filled" value={selectedUser.email} disabled />

                                                            </div>
                                                        </div>
                                                        <div className="row justify-content-center mt-3">
                                                            <div className="col-4">
                                                                <TextField id="filled-basic" label="Birth Date" variant="filled" value={selectedUser.birthdate} disabled />

                                                            </div>
                                                            <div className="col-4">
                                                                <TextField id="filled-basic" label="Phone Number" variant="filled" value={selectedUser.phone_number} disabled />

                                                            </div>
                                                            <div className="col-4">
                                                                <TextField id="filled-basic" label="Unique Visitors" variant="filled" value={selectedUser.uniq_visitors} disabled />

                                                            </div>
                                                        </div>
                                                        <div className="row justify-content-center mt-3">
                                                            <div className="col-4">
                                                                <TextField id="filled-basic" label="Points" variant="filled" value={selectedUser.points} disabled />

                                                            </div>
                                                            <div className="col-4">
                                                                <TextField id="filled-basic" label="Number of Referrals" variant="filled" value={selectedUser.children.length} disabled />

                                                            </div>
                                                            <div className="col-4">
                                                                <TextField id="filled-basic" label="Joined at" variant="filled" value={selectedUser.created_at} disabled />

                                                            </div>
                                                        </div>
                                                    </div> : ""
                                            }
                                        </div>

                                        <div className="col-lg-6">
                                            <SelectedUser user={selectedUser} />

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-5">
                                        {barChartData ?
                                            <BarChart chartData={barChartData} /> : ""

                                        }
                                    </div>
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-5">
                                        {
                                            barChartData ?
                                                <LineChart chartData={barChartData} /> : ""

                                        }

                                    </div>
                                </div>

                                <div className="row mt-5">
                                    <div className="col-lg-4">
                                        {
                                            pieChartData ?
                                                <PieChart chartData={pieChartData} /> : ""

                                        }

                                    </div>
                                </div>

                            </div>
                        </CustomTabPanel>
                    </div>
                    <div className="col-lg-1"></div>
                </div>

            </div>




        </div>
    )
}
