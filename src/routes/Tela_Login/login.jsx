import './login.css'
//import React, { useState} from "react";
import { TextField, Button, Typography, Divider,Box} from "@mui/material";
function Login() {
  //const[email,setEmail] = useState("");
  //const[password,setPassword] = useState("");

  return (
    <div className='Container'>
      <div className='LeftContainer'>
        <Typography></Typography>
        <Typography>Bem vindo de volta</Typography>
        <Typography>Preencha os campos com as suas informações de login</Typography>
        <form>
          <Box>
          <label></label>
          <TextField></TextField>
          <label></label>
          <TextField></TextField>
          <button></button>
          </Box>
        </form>
        <Box>
        <Typography></Typography>
        <a href='/register'></a>
        </Box>
      </div>
      <div className='RightContainer'>

      </div>
    </div>
  )
}

export default Login
