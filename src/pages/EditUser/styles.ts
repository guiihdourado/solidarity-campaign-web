import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import { Link } from 'react-router-dom';

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;

  > h1 {
    margin-bottom: 30px;
    border-bottom: 1px solid #ff872c;
  }
`;

export const ContainerLoading = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  place-content: center;
`;

export const BackButton = styled(Link)`
  display: flex;
  text-decoration: none;
  align-items: center;
  padding: 0 0 20px;
  color: #ff9000;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${shade(0.2, '#ff9000')};
    text-decoration: underline;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`
  animation: ${appearFromLeft} 1s;
`;

export const SelectDiv = styled.div`
  .react-select__control {
    background-color: transparent;
    border: none;
  }

  .react-select__menu-list {
    background: #232129;
  }

  .react-select__option {
    color: #666360;
  }

  .react-select__single-value {
    color: #f4ede8;
  }

  .react-select__option--is-focused {
    background: none;
  }

  .react-select__option--is-selected {
    background: #ff9000;
    color: #f4ede8;
  }
`;
