import React from "react";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Mainplot from "./components/Mainplot";

import "./App.css";

function App() {
  const mainref = Mainplot();
  
  return (
    <div className="App">
      <AppBar position="static" sx={{width: "100%", height: '90px', backgroundColor: "#060017"}}>
        <Toolbar sx={{ height: '90px'}}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ marginLeft: 2, fontSize: "2rem", lineHeight: 2.5, height: '90px' }}>
            VisRPW
          </Typography>
        </Toolbar>
      </AppBar>  
      <div style={{ width: "100%"}}>    
        <Mainplot />  
      </div> 
    </div>
  );
}

export default App;

// "#003458"