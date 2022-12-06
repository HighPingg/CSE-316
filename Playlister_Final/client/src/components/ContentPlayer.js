import React, { useContext, useState } from "react";
import GlobalStoreContext from "../store";

import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";

export default function ContentPlayer() {
    const [ value, setValue ] = useState(0);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
    }
    
    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function handleChangeTab(event, newValue) {
        console.log(newValue)
        setValue(newValue);
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (<Box sx={{ height: '65vh', width: '38vw', position: 'relative', marginLeft: '10px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="Player" {...a11yProps(0)} />
                <Tab label="Comments" {...a11yProps(1)} />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            Player
        </TabPanel>
        <TabPanel value={value} index={1}>
            Comments
        </TabPanel>
    </Box>);
}