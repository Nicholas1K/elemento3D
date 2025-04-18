import React from 'react'
import './App.css'

import ReactDOM from "react-dom";
import Scene from './components/Scene';
import SceneTwo from './components/SceneTwo';
import SceneThree from './components/SceneThree';
import SceneLogo from './components/SceneLogo';


function App() {

  return (
    <>
      <div style={{width:'100%', height:'500px',backgroundColor:'black'}}>
        <SceneLogo />
      </div>
      <h1>TEST DI ELEMENTO IN 3D</h1>
      
    </>
  )
}

export default App
