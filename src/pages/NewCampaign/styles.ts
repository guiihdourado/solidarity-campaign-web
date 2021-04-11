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

export const ContainerItens = styled.div`
  > h3 {
    margin: 30px 0px 15px;
    border-bottom: 1px solid #ff872c;
  }
`;

export const Itens = styled.div`
  display: flex;
  flex-wrap: wrap;

  > div {
    padding: 10px 0px 10px 20px;
    flex: 0 0 33.333333%;

    > div {
      margin-bottom: 15px;
    }
  }
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
