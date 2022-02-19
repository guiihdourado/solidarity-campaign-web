/* eslint-disable @typescript-eslint/ban-types */
import React, {
  useState,
  useCallback,
  forwardRef,
  SelectHTMLAttributes
} from 'react';

import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

type Option = {
  label: string;
  value: string;
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
  options?: Option[];
}

const Select = (
  { icon: Icon, error, options = [], ...rest }: SelectProps,
  ref: React.MutableRefObject<HTMLSelectElement>
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!ref.current?.value);
  }, [ref]);

  return (
    <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}
      <select
        {...rest}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={ref}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default forwardRef(Select);
