import React, { useRef, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import InputSelect from '../../components/InputSelect';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import { Container, AnimationContainer, BackButton, SelectDiv } from './styles';

interface UserFormData {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface RouteParams {
  userId: string;
}

const EditUser: React.FC = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();
  const { userId } = useParams<RouteParams>();

  useEffect(() => {
    api.get(`users/${userId}`).then(({ data }) => {
      formRef.current.setData(data);
    });
  }, [userId]);

  const handleSubmit = useCallback(
    async (data: UserFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .email('Digite um email válido')
            .required('Email obrigatório'),
          role: Yup.string().required('Tipo de usuário obrigatório.')
        });

        await schema.validate(data, {
          abortEarly: false
        });

        await api.put(`users/${userId}`, data);

        addToast({
          type: 'success',
          title: 'Usuário',
          description: 'Usuário editado com sucesso.'
        });

        history.push(`/users`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Usuário',
          description: 'Erro ao editar um usuário. Tente novamente.'
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <BackButton to={`/users`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Novo usuário</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Nome do usuário" icon={FiUser} />
          <Input name="email" placeholder="E-mail do usuário" icon={FiMail} />
          <SelectDiv>
            <InputSelect
              name="role"
              placeholder="Selecione o tipo de usuário"
              styles={{
                container: provided => {
                  return { ...provided, width: '100%' };
                }
              }}
              options={[
                {
                  value: 'admin',
                  label: 'Administrador'
                },
                {
                  value: 'user',
                  label: 'Usuário'
                }
              ]}
            />
          </SelectDiv>
          <Button type="submit">Editar Usuário</Button>
        </Form>
      </AnimationContainer>
    </Container>
  );
};

export default EditUser;
