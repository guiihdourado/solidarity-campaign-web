import styled from 'styled-components';

import Tooltip from '../Tooltip';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  position: relative;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-right: 10px;

  &before {
    content: '';
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
  }

  &:checked:before {
    content: '';
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background-color: #ff9000;
  }

  &:checked:after {
    content: '';
    display: block;
    width: 5px;
    height: 10px;
    border: solid #f4ede8;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    position: absolute;
    top: 2px;
    left: 6px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
