import { Link } from 'react-router-dom'

import { Button, Typography } from "@mui/material";

export default function SplashScreen() {
    let buttonStyle = {color: "#ffffff", borderColor: "#ffffff", margin: "10px"}

    return (
        <div id="splash-screen">
            <span>Playlister</span>
            <Typography style={{fontSize: "3vw"}}>Welcome to Playlister!</Typography>
            <Typography style={{marginTop: "10px"}}>Create Playlists, Edit Playlists, Add and Share Songs All In One App.</Typography>
            <div sx={{top: "50px"}}>
                <Link to='/login/'><Button variant="outlined" style={buttonStyle} >Login</Button></Link>
                <Link to={'/register/'}><Button variant="outlined" style={buttonStyle}>Register</Button></Link>
                <Button variant="outlined" style={buttonStyle}>Continue as Guest</Button>
            </div>

            <Typography style={{position: "absolute", bottom: "10%", left: "43%"}}>Created By Vincent Zheng</Typography>
        </div>
    )
}