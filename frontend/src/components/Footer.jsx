import React from 'react';
import styled from 'styled-components';

const FooterCard = styled.footer`
  background-color: #25076b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 50px;
`;

const Footer = () => {
  return (
    <FooterCard>
      <p>&copy; BigBrain 2022</p>
    </FooterCard>
  );
}

export default Footer;
