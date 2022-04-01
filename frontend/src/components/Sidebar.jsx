import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../utils/Auth';

import Logout from './Logout';

import { Offcanvas, Collapse, Container, Row, Col, Nav } from 'react-bootstrap';

const OffcanvasStyled = styled(Offcanvas)`
  width: 150px;
`;

const Sidebar = () => {
  const { token, sidebarOpen, setSidebarOpen } = useAuth();

  return (
    <Collapse in={sidebarOpen}>
      <div>
        <OffcanvasStyled show={sidebarOpen} onHide={() => setSidebarOpen(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>BigBrain</Offcanvas.Title>
          </Offcanvas.Header>
          <Container fluid>
            <Row>
              <Col>
                <Nav>
                  <Nav.Item>
                    { token && <Logout/> }
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
