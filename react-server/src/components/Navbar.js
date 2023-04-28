import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar';
import '../static/css/Navbar.css'
import logo from '../logo.png';


function Navbar() {
    const [showBlack, setShowDark] = useState(false);

    const navbartransition = () => {
      if (window.scrollY > 100){
        setShowDark(true);
      } else {
        setShowDark(false)
      }
    }

    useEffect(()=>{
        window.addEventListener("scroll", navbartransition)
        return () => window.removeEventListener("scroll", navbartransition)
      }, [])

    return (
        <div className={`nav ${showBlack && "navBlack"}`}>
            <Sidebar />
            <div className="navContent">
                <img className='logo' src={logo} alt="MovieMaster" />
                <img className='avatar' src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Avatar" />
            </div>
        </div>
    );
}

export default Navbar