import React from "react";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Mainplot from "./components/Mainplot";
import Button from '@material-ui/core/Button';

import "./App.css";

function App() {
  const mainref = Mainplot();

  function uploadbuttonclick(filehandle)
  {
    console.log(filehandle.target.value)
  }

  return (
    <div className="App">
      <AppBar position="static" sx={{width: "100%", height: 80, backgroundColor: "#060017"}}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2, fontSize: "2rem", lineHeight: 5 }}>
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
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>
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