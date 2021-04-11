import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import { Container, AnimationContainer, BackButton } from './styles';

interface ProductFormData {
  name: string;
}

const NewProduct: React.FC = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProductFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório')
        });

        await schema.validate(data, {
          abortEarly: false
        });

        await api.post('products', data);

        addToast({
          type: 'success',
          title: 'Produto',
          description: 'Produto cadastrado com sucesso.'
        });

        history.push(`/products`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Product',
          description: 'Erro ao cadastrar um produto. Tente novamente.'
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <BackButton to={`/products`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Novo produto</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Nome do produto" icon={FiUser} />
          <Button type="submit">Cadastrar Produto</Button>
        </Form>
      </AnimationContainer>
    </Container>
  );
};

export default NewProduct;
