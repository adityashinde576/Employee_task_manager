import { useState } from "react";

export default function UserForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullname":
        if (!value.trim()) error = "Full name is required";
        break;
      case "username":
        if (!value.trim()) error = "Username is required";
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = "Username can only contain letters, numbers, and underscores";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "phone":
        if (value && !/^\+?[\d\s-()]+$/.test(value)) error = "Invalid phone number format";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submit triggered with data:", form);
    const newErrors = {};
    Object.keys(form).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
        console.log(`Validation error for ${key}: ${error}`);
      }
    });
    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("No validation errors, calling onSubmit");
      onSubmit(form);
      setForm({ fullname: "", username: "", email: "", password: "", phone: "", gender: "", role: "user" });
      setErrors({});
    } else {
      console.log("Validation errors found, not submitting");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={form.fullname}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullname ? 'border-red-500' : ''}`}
          required
        />
        {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
      </div>
      <div>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : ''}`}
          required
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
          required
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
          required
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <div>
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>
      <div>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : ''}`}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
      </div>
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="user">Employee</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}
