import React, {
  InputHTMLAttributes,
  useState,
  useCallback,
  forwardRef
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';

import { Container, Error } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
}

const Input = (
  { icon: Icon, error, ...rest }: InputProps,
  ref: React.MutableRefObject<HTMLInputElement>
): JSX.Element => {
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
      <input
        {...rest}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        ref={ref}
      />

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default forwardRef(Input);
