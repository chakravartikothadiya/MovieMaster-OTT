import React, {useEffect, useState} from 'react'
import { Drawer as MuiDrawer, ListItem, ListItemText, List, ListItemButton, ListItemIcon } from '@mui/material' 
import { Link } from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import '../static/css/Sidebar.css'
const API_KEY = process.env.REACT_APP_TMDC_API_KEY


function Sidebar() {
    const [genre, setGenre] = useState([]);

    const [isOpen, setIsOpen] = useState(false);

    const handleSidebar = () => {
      setIsOpen(!isOpen);
    };

    useEffect(() => {
        async function fetchData() {
          const request = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
          setGenre(request.data.genres);
          console.log(genre)
          return request;
        }
        fetchData();
      }, []);

    return (
        <div>
        <Button  onClick={handleSidebar} aria-label='menu'><MenuIcon sx={{ color: 'red' }} className='menu' /></Button>
        <MuiDrawer open={isOpen} onClose={handleSidebar} anchor='left' elevation={16}>
            <div className='Sidebar'>
                <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleSidebar}>
                        <ListItemIcon>
                        <CloseIcon sx = {{color: "white"}} />
                        </ListItemIcon>
                        <ListItemText primary='Close' />
                    </ListItemButton>
                </ListItem>
                {genre.map((item) => (
                <ListItem key={item.id} disablePadding>
                    <ListItemButton onClick={handleSidebar}>
                        <ul>
                            <li>
                                <Link to={`/genre/${item.id}/`}>
                                    <ListItemText primary={item.name} />
                                </Link>
                            </li>
                        </ul>
                    </ListItemButton>
                </ListItem>
                ))}
                </List>
            </div>
        </MuiDrawer>
        </div>
    );
}

export default Sidebar