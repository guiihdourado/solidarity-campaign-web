import React, { useRef, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import { Container, AnimationContainer, BackButton, SelectDiv } from './styles';

interface ProductFormData {
  name: string;
}

interface RouteParams {
  productId: string;
}

const EditProduct: React.FC = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();
  const { productId } = useParams<RouteParams>();

  useEffect(() => {
    api.get(`products/${productId}`).then(({ data }) => {
      formRef.current.setData(data);
    });
  }, [productId]);

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

        await api.put(`products/${productId}`, data);

        addToast({
          type: 'success',
          title: 'Produto',
          description: 'Produto editado com sucesso.'
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
          title: 'Produto',
          description: 'Erro ao editar um produto. Tente novamente.'
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
          <Button type="submit">Editar Produto</Button>
        </Form>
      </AnimationContainer>
    </Container>
  );
};

export default EditProduct;
