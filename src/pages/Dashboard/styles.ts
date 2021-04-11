import styled, { css } from 'styled-components';
import { shade } from 'polished';

import { Link } from 'react-router-dom';

interface CardContainerProps {
  isOpen: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;

  div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    border-bottom: 1px solid #ff872c;

    button {
      background: none;
      border: none;
      transition: color 0.2s;
      color: #ff872c;
      &:hover {
        color: ${shade(0.2, '#ff9000')};
      }

      > svg {
        width: 30px;
        height: 30px;
      }
    }
  }
`;

export const Menus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const CardContainer = styled.div<CardContainerProps>`
  display: flex;
  align-items: center;
  place-content: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #ff872c;

  background: #3e3b47;
  border-radius: 10px;
  height: 100%;
  padding: 20px 20px 0px;

  ${props =>
    !props.isOpen &&
    css`
      opacity: 0.3;
    `}

  div:first-child {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-bottom: none;

    h1 {
      font-style: normal;
      font-weight: 500;
      font-size: 1.2rem;
      line-height: 32px;
      padding-bottom: 10px;
    }

    p {
      color: #ff872c;
    }

    p:last-of-type {
      padding-bottom: 10px;
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

export const OpenCampaign = styled.button`
  background: none;
  padding-top: 10px;
  border: none;
  text-decoration: none;
`;

export const ActionButtons = styled.div`
  padding-top: 20px;
`;

export const ActionButton = styled.button`
  padding-right: 10px;
`;
