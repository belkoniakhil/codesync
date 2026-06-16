import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Editor from "./pages/Editor";



function App() {
return (
  <BrowserRouter>
  <Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="/editor/:roomId" element={<Editor />} />

  </Routes>
  
  </BrowserRouter>
 )
  
}

export default App
