import React from 'react';
import useAppContext from '../utils/Context';
import styled from 'styled-components';

import Logout from './Logout';

import { Offcanvas, Collapse, Container, Row, Col, Nav } from 'react-bootstrap';

const OffcanvasStyled = styled(Offcanvas)`
  width: 150px;
`;

const Sidebar = () => {
  const { getters, setters } = useAppContext();

  return (
    <Collapse in={getters.sidebarOpen}>
      <div>
        <OffcanvasStyled show={getters.sidebarOpen} onHide={() => setters.setSidebarOpen(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>BigBrain</Offcanvas.Title>
          </Offcanvas.Header>
          <Container fluid>
            <Row>
              <Col>
                <Nav>
                  <Nav.Item>
                    { getters.loggedIn && <Logout/> }
                  </Nav.Item>
                </Nav>
              </Col>
            </Row>
          </Container>

        </OffcanvasStyled>
      </div>
    </Collapse>
  );
}

export default Sidebar;
