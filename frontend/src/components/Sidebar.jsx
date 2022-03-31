import React from 'react';
import useAppContext from '../utils/Context';

import Logout from './Logout';

import { Offcanvas, Collapse } from 'react-bootstrap';

const Sidebar = () => {
  const { getters } = useAppContext();

  return (
    <Collapse in={getters.sidebarOpen}>
      <div>
        <Offcanvas>
          { getters.loggedIn && <Logout/> }
        </Offcanvas>
      </div>
    </Collapse>
  );
}

export default Sidebar;
