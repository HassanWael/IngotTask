import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function SearchUsers({users,setSelectedUser}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [localUser,setLocalUser] = useState();
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUserChange = (event, value) => {
        setSelectedUser(value);
        setLocalUser(value)
    };

    const customFilter = (option, inputValue) => {
        const nameMatches = option.name.toLowerCase().includes(inputValue.toLowerCase());
        const emailMatches = option.email.toLowerCase().includes(inputValue.toLowerCase());
        return nameMatches || emailMatches;
    };

    const filteredUsers = users.filter((user) => customFilter(user, searchTerm));
    const customFilterOptions = (options, { inputValue }) => {
        return options.filter((option) => {
          const nameMatches = option.name.toLowerCase().includes(inputValue.toLowerCase());
          const emailMatches = option.email.toLowerCase().includes(inputValue.toLowerCase());
          return nameMatches || emailMatches;
        });
      };
        return (
            <Autocomplete
                options={users}
                getOptionLabel={(user) => user.name}
                value={localUser}
                onChange={handleUserChange}
                filterOptions={customFilterOptions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search users"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                )}
            />
        );
    }