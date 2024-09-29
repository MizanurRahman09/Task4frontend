export default function Validation(values) {
    let errors = {};
    errors.email = !values.email.trim()
        ? "Email should not be empty"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
        ? "Invalid email format"
        : null;
    errors.password = !values.password.trim()
        ? "Password should not be empty"
        : null;
    errors.confirmPassword = !values.confirmPassword.trim()
        ? "Confirm Password should not be empty"
        : values.confirmPassword !== values.password
        ? "Passwords do not match"
        : null;
    errors.name = !values.name.trim()
        ? "Name should not be empty"
        : null;
    Object.keys(errors).forEach(key => errors[key] === null && delete errors[key]);
    return errors;
}
