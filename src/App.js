import React, { useContext } from "react";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Mainplot from "./components/Mainplot";
import Button from '@material-ui/core/Button';

import "./App.css";
import DataProvider from "./common/DataContext";

function App() {
  function uploadbuttonclick(filehandle)
  {
    console.log(filehandle.target.value)
  }

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
              fontWeight:'600',
              flexGrow: 1, 
            }
          }>
            VisRPW
          </Typography>
          <input
            type="file"
            accept=".json,.bin"
            style={{ display: 'none' }}
            id="contained-button-file"
            onChange={uploadbuttonclick}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary">
              Upload
            </Button>
          </label>
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