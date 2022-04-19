import { Card } from 'react-bootstrap';
import styled from 'styled-components';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';

export const AuthCard = styled(Card)`
    width: 60%;
    min-width: 300px;
    max-width: 450px;
    text-align: center;
`;

export const CardSubHeading = styled.h4`
    text-align: center;
`;

export const CorrectIcon = styled(HiOutlineCheckCircle)`
  color: limegreen;
`;

export const IncorrectIcon = styled(HiOutlineXCircle)`
  color: red;
`;
