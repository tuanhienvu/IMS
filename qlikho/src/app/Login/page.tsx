'use client';
import '../../components/css.css';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [user, setuser] = useState('');{/* line 7-20 xử lý login */}
  const [password, setpassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    {/* tránh quay về form login e.preventDefault(); */}
    window.localStorage.setItem('isLoggedIn', 'true'); // Lưu trạng thái đăng nhập
   

    try{
      if (user === 'admin123' && password === '123456') {
      router.push("/")
    } 
    }
    catch(error){  
     alert(error);
    }
  };

  return (
    <div className="login-page" >
      <div className="wrapper-login">
        <form >
          <h1>Login Form</h1>
          <div className="input-field">
            <input
              value={user}
              onChange={(e) => setuser(e.target.value)}
              type="text"
              required
            />
            <label>User</label>
          </div>
          <div className="input-field">
            <input
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              type="password"
              required
            />
            <label>Password</label>
          </div>
          <div className="forget">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" /> <p>Remember me</p>
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button onClick={handleLogin} type="submit">
            Log In
          </button>
          <div className="register">
            <p>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
