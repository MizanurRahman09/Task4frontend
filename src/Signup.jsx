import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import Validation from "./SignupValidation";

export default function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = Validation(values);
        setErrors(formErrors);

        if (!formErrors.name && !formErrors.email && !formErrors.password) {
            axios.post('https://backend-zeta-mocha.vercel.app/signup', values)
                .then(res => {
                    console.log('Signup successful:', res.data);
                    navigate('/');
                })
                .catch(err => {
                    console.error('Signup error:', err);
                    if (err.response && err.response.status === 403) {
                        setErrorMessage('Blocked users cannot register again');
                    } else {
                        setErrorMessage('An error occurred during signup. Please try again.');
                    }
                });
        }
    };
    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'password' || name === 'confirmPassword') {
            setErrors(prev => ({
                ...prev,
                confirmPassword: name === 'password' && values.confirmPassword !== value
                    ? "Passwords do not match"
                    : name === 'confirmPassword' && value !== values.password
                        ? "Passwords do not match"
                        : "",
            }));
        }
    };
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-primary">
            <div className="bg-white p-3 rounded" style={{ width: '300px' }}>
                <h2 className="text-center">Sign-Up</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="fw-bold">Name</label>
                        <input type="text" onChange={handleInput} className="form-control" placeholder="Enter your name" name="name" />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="fw-bold">Email</label>
                        <input type="email" onChange={handleInput} className="form-control" name="email" placeholder="Enter email" />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="fw-bold">Password</label>
                        <input type="password" onChange={handleInput} className="form-control" placeholder="Enter Password" name="password" />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="fw-bold">Confirm Password</label>
                        <input type="password" onChange={handleInput} className="form-control" placeholder="Confirm Password" name="confirmPassword" />
                        {errors.confirmPassword && <span className="text-danger">{errors.confirmPassword}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Sign up</button>
                    <p className="text-center mt-3">You agree with our terms</p>
                    <Link to="/" className="btn btn-secondary w-100 fw-bold">Sign in</Link>
                </form>
            </div>
        </div>
    );
}
