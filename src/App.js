import React, { useContext } from "react";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Mainplot from "./components/Mainplot";

import "./App.css";
import DataProvider from "./common/DataContext";

function App() {
  return (
    <div className="App">
      <AppBar position="static" sx={{width: "100%", height: '80px', backgroundColor: "#060017"}}>
        <Toolbar sx={{ height: '80px'}}>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography 
            variant="h1" 
            component="div" 
            sx={{ 
              marginLeft: 2, 
              fontSize: "2.4rem", 
              lineHeight: 2, 
              height: '80px', 
              fontFamily: 'Pretendard',
              fontWeight:'600' 
            }
          }>
            VisRPW
          </Typography>
        </Toolbar>
      </AppBar> 
      <DataProvider>
        <div style={{ width: "100%"}}>    
          <Mainplot /> 
        </div>
      </DataProvider>
    </div>
  );
}

export default App;

// "#003458"