import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock,faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
    const [users, setUsers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const navigate = useNavigate();
    const updateStatuses = (userIds, status) => {
        setUsers(users.map(user =>
            userIds.includes(user.id) ? { ...user, status } : user
        ));
    };
    useEffect(() => {
        fetchUsers();
    }, [users]); 
    const fetchUsers = () => {
        axios.get('https://backend-zeta-mocha.vercel.app/users')
            .then(response => {
                console.log('Users fetched:', response.data);
                setUsers(response.data);
            })
            .catch(error => console.error('Error fetching users:', error));
    };
    const handleBlock = () => {
        axios.put(`https://backend-zeta-mocha.vercel.app/users/block`, { userIds: selectedIds })
            .then(response => {
                console.log('Users blocked successfully:', response.data);
                updateStatuses(selectedIds, 'blocked');
            })
            .catch(error => console.error('Block users error:', error));
    };  
    const handleUnblock = () => {
        axios.put(`https://backend-zeta-mocha.vercel.app/users/unblock`, { userIds: selectedIds })
            .then(response => {
                console.log('Users unblocked successfully:', response.data);
                updateStatuses(selectedIds, 'active');
            })
            .catch(error => console.error('Unblock users error:', error));
    };
    const handleDelete = () => {
        axios.delete('https://backend-zeta-mocha.vercel.app/users', { data: { userIds: selectedIds } })
            .then(response => {
                console.log('Users deleted successfully:', response.data);
                // Update state to remove the deleted users from the users array
                setUsers(users.filter(user => !selectedIds.includes(user.id)));
                setSelectedIds([]); // Clear selectedIds after deletion
            })
            .catch(error => console.error('Delete users error:', error));
    };
    const handleLogout = () => {
        axios.post('https://backend-zeta-mocha.vercel.app/logout')
            .then(() => {
                navigate('/');
            })
            .catch(error => console.error('Logout error:', error));
    };
    const handleCheckboxChange = (userId) => {
        setSelectedIds(prevState =>
            prevState.includes(userId) ? prevState.filter(id => id !== userId) : [...prevState, userId]
        );
    };
    const handleMasterCheckboxChange = (event) => {
        if (event.target.checked) {
            setSelectedIds(users.map(user => user.id));
        } else {
            setSelectedIds([]);
        }
    };
    return (
        <div className="container bg-light py-4">
            <div className="d-flex justify-content-between align-items-center my-3">
                <h1 className="text-center">User Management System</h1>
                <button className="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
            </div>
            <div className="d-flex justify-content-start my-3">
                <button className="btn btn-danger mx-1" onClick={handleBlock}>
                    <FontAwesomeIcon icon={faLock} className="mr-2" /> Block
                </button>
                <button className="btn btn-success mx-1" onClick={handleUnblock}>
                    <FontAwesomeIcon icon={faUnlockAlt} className="mr-2" /> Unblock
                </button>
                <button className="btn btn-secondary mx-1" onClick={() => handleDelete(selectedIds)}>Delete</button>
            </div>
            <table className="table table-bordered table-striped">
                <thead className="thead-light">
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={handleMasterCheckboxChange}
                                checked={selectedIds.length === users.length && users.length !== 0}
                            />
                        </th>
                        <th>id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Last Login</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(user.id)}
                                    checked={selectedIds.includes(user.id)}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.logintime}</td>
                            <td style={{ color: user.status === 'active' ? 'green' : 'inherit' }}>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
        </table>
    </div>
    );
}