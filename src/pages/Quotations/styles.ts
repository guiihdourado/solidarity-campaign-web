import styled, { css } from 'styled-components';
import { shade } from 'polished';

import { Link } from 'react-router-dom';

interface CardContainerProps {
  bestOption: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;

  > h1 {
    border-bottom: 1px solid #ff872c;
    margin-bottom: 20px;
  }

  button {
    margin-top: 30px;
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

export const CreateQuotation = styled(Link)`
  display: flex;
  text-decoration: none;
  align-items: center;
  padding: 20px 0 0px;
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

export const ContainerLoading = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  place-content: center;
`;

export const CardContainer = styled.div<CardContainerProps>`
  display: flex;
  align-items: center;
  place-content: center;
  justify-content: space-between;

  background: #3e3b47;
  border-radius: 10px;
  height: 100%;
  max-height: 200px;
  padding: 15px 20px;

  margin-top: 30px;

  ${props =>
    props.bestOption &&
    css`
      border: 3px solid #ff872c;
    `}

  div:first-child {
    display: flex;
    flex-direction: column;
    h1 {
      font-style: normal;
      font-weight: 500;
      font-size: 1.5rem;
      line-height: 32px;
    }

    h4 {
      font-style: normal;
      font-weight: normal;
      font-size: 1rem;
      padding-bottom: 10px;
    }

    p {
      color: #ff9000;
      padding-bottom: 10px;
    }

    > span {
      font-style: italic;
    }

    strong {
      padding-top: 20px;

      ${props =>
        props.bestOption &&
        css`
          span {
            font-size: 20px;
            color: #ff9000;
          }
        `}
    }
  }

  & + div {
    margin-top: 10px;
  }

  a {
    color: #ff9000;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.3, '#ff9000')};
    }
  }
`;

export const Menus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const MenuLink = styled(Link)`
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
