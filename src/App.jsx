import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import ReactDOM from "react-dom";
import Scene from './components/Scene';
import SceneTwo from './components/SceneTwo';


function App() {

  return (
    <>
      <div style={{width:'100%', height:'500px',backgroundColor:'gray'}}>
        <SceneTwo />
      </div>
      <h1>TEST DI ELEMENTO IN 3D</h1>
      
    </>
  )
}

export default App
