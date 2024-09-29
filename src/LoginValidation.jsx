export default function Validation(values) {
    let errors = {};
    if (!values.email.trim()) {
        errors.email = "Email should not be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        errors.email = "Invalid email format";
    }
    if (!values.password.trim()) {
        errors.password = "Password should not be empty";
    }
    return errors;
}
