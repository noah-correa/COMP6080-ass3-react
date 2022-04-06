import { Card } from 'react-bootstrap';
import styled from 'styled-components';

export const BodyWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #46178f;
    min-height: calc(100vh - 100px);
`;

export const FooterCard = styled.footer`
    background-color: #25076b;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 50px;
`;

export const AuthCard = styled(Card)`
    width: 60%;
    min-width: 300px;
    max-width: 450px;
    text-align: center;
`;

export const CardHeading = styled.h1`
    text-align: center;
`;

export const CardSubHeading = styled.h4`
    text-align: center;
`;
