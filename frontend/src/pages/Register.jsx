import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

function Register() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [strength, setStrength] = useState('');
const [rememberMe, setRememberMe] = useState(false);
const [errorMsg, setErrorMsg] = useState('');
const [successMsg, setSuccessMsg] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const checkPasswordStrength = (value) => {
let score = 0;
if (value.length >= 8) score++;
if (/[A-Z]/.test(value)) score++;
if (/[0-9]/.test(value)) score++;
if (/[^A-Za-z0-9]/.test(value)) score++;

if (score <= 1) setStrength('Weak');
else if (score <= 3) setStrength('Medium');
else setStrength('Strong');
};

const handlePasswordChange = (e) => {
const value = e.target.value;
setPassword(value);
checkPasswordStrength(value);
};

const handleRegister = async (e) => {
e.preventDefault();
setErrorMsg('');
setSuccessMsg('');
setLoading(true);
try {
const response = await axios.post(
'http://localhost:3000/auth/register',
{ name, email, password },
{ withCredentials: true }
);
  if (response.data?.userId) {
    setSuccessMsg("User registered successfully!");
    setName('');
    setEmail('');
    setPassword('');
    setTimeout(() => navigate("/login"), 1000);
  }

} catch (error) {
  if (error.response) {
    const { status, data } = error.response;
    if (status === 400) {
      setErrorMsg(data.message || "Email already in use.");
    } else if (status === 500) {
      setErrorMsg("Server error, please try again later.");
    } else {
      setErrorMsg(data.message || "Unexpected error occurred.");
    }
  } else if (error.request) {
    setErrorMsg("No response from server. Check your network.");
  } else {
    setErrorMsg("Error: " + error.message);
  }
} finally {
  setLoading(false);
}
};

const handleGoogleLogin = () => {
alert("Google login feature coming soon.");
};

return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-96">
<h2 className="text-xl font-bold mb-4 text-center">Register</h2>


    {errorMsg && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3 text-sm">{errorMsg}</div>}
    {successMsg && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-3 text-sm">{successMsg}</div>}

    <input
      type="text"
      placeholder="Name"
      className="w-full mb-3 p-2 border rounded"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
    <input
      type="email"
      placeholder="Email"
      className="w-full mb-3 p-2 border rounded"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <div className="relative mb-1">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password"
        className="w-full p-2 border rounded pr-10"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <span
        className="absolute right-3 top-2 cursor-pointer text-gray-500"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? '🙈' : '👁️'}
      </span>
    </div>

    {password && (
      <p className={`text-sm mb-3 ${
        strength === 'Weak' ? 'text-red-500' :
        strength === 'Medium' ? 'text-yellow-600' :
        'text-green-600'
      }`}>
        Password Strength: {strength}
      </p>
    )}

    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        id="remember"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
        className="mr-2"
      />
      <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
    </div>

    <button
      type="submit"
      className={`w-full p-2 rounded text-white ${
        loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
      }`}
      disabled={loading}
    >
      {loading ? 'Registering...' : 'Register'}
    </button>

    <div className="mt-4">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-100"
      >
        🔐 Continue with Google
      </button>
    </div>

    <p className="mt-3 text-sm text-center">
      Already have an account?{' '}
      <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
    </p>
  </form>
</div>
);
}

export default Register;