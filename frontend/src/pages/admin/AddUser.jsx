import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function AddUser() {
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const form = e.target;

  const data = {
    fullname: form.fullname.value.trim(),
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    password: form.password.value.trim(),
    phone: form.phone.value.trim(),
    gender: form.gender.value,
    role: form.role.value,
  };

  if (!data.fullname || !data.username || !data.email || !data.password) {
    toast.error("Please fill all required fields");
    setLoading(false);
    return;
  }

  try {
    await api.post("/api/add_user", data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    toast.success("User added successfully");
    form.reset();
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to add user");
  } finally {
    setLoading(false);
  }
};


  return (
    <form
      onSubmit={submit}
      className="p-6 bg-white rounded shadow space-y-3 max-w-md mx-auto"
    >
      <input
        name="fullname"
        placeholder="Full Name"
        className="input w-full"
      />
      <input name="username" placeholder="Username" className="input w-full" />
      <input name="email" placeholder="Email" className="input w-full" />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input w-full"
      />
      <input name="phone" placeholder="Phone" className="input w-full" />

      <select name="gender" className="input w-full">
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <select name="role" className="input w-full">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="btn-primary w-full mt-2"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}
