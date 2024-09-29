import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import Validation from "./LoginValidation";

export default function Login() {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = Validation(values);
        setErrors(formErrors);
        if (!formErrors.email && !formErrors.password) {
            axios.post('https://backend-zeta-mocha.vercel.app/login', values)
                .then(res => {
                    if (res.data.success) {
                        console.log('Login successful:', res.data.user);
                        navigate('/home');
                    } else {
                        console.error('Login error:', res.data.message);
                        setLoginError(res.data.message);
                    }
                })
                .catch(err => {
                    console.error('Login error:', err);
                    setLoginError('Error logging in');
                });
        }
    };
    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-primary">
            <div className="bg-white p-3 rounded" style={{ width: '300px' }}>
                <h2 className="text-center">Sign-In</h2>
                {loginError && <div className="alert alert-danger">{loginError}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="fw-bold">Email</label>
                        <input type="email" onChange={handleInput} className="form-control" placeholder="Enter email" name="email" value={values.email} />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="fw-bold">Password</label>
                        <input type="password" onChange={handleInput} className="form-control" name="password" placeholder="Your password" value={values.password} />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold">Login</button>
                    <p className="text-center mt-3">You agree with our terms</p>
                    <Link to="/signup" type="button" className="btn btn-secondary w-100 fw-bold">Create account</Link>
                </form>
            </div>
        </div>
    );
}
