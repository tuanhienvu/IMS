'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(window.localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const loggedIn = window.localStorage.getItem('isLoggedIn') === 'true';
    console.log("error")
    setIsLoggedIn(loggedIn);
debugger
    if (!loggedIn) {
      console.log("a")
      router.push("/Login");
      
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
    router.push("/Login"); // Điều hướng về trang login
  };
console.log("e");


  return (
    <div>
      <h1>Chào mừng bạn đến với Trang Chủ!</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
