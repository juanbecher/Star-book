import { signIn, signOut, useSession } from "next-auth/react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { Button, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';

const NavbarUser = () => {
    const {data : session} = useSession()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!session) {
    return <Button onClick={() => signIn()}>Sign in</Button>
  }

    return(
        <div className="flex items-center">
        {session?.user?.image &&  
        <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar alt={session?.user?.email || ""} src={session?.user?.image} />

      </Button> }
        
        <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        // PaperProps={{
        //   elevation: 0,
        //   sx: {
        //     overflow: 'visible',
        //     border: "azure",
        //     filter: 'drop-shadow(0px 2px 8px #00000051)',
        //     mt: 1.5,
        //     '& .MuiAvatar-root': {
        //       width: 32,
        //       height: 32,
        //       ml: -0.5,
        //       mr: 1,
        //     },
        //     '&:before': {
        //       content: '""',
        //       display: 'block',
        //       position: 'absolute',
        //       top: 0,
        //       right: 14,
        //       width: 10,
        //       height: 10,
        //       bgcolor: 'background.paper',
        //       transform: 'translateY(-50%) rotate(45deg)',
        //       zIndex: 0,
        //     },
        //   },
        // }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
        <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

        {/* {session ? <div>Hello {session.user?.name}<button onClick={() => signOut()}>Log out</button></div> : <div><button onClick={() => signIn()}>Log in</button></div>} */}
      
      </div>
    )
}

export default NavbarUser;