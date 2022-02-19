import React, { useMemo } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser, FiMail } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import useForm from '../../hooks/useForm';

import InputClean from '../../components/InputClean';
import InputSelectClean from '../../components/InputSelectClean';
import Button from '../../components/Button';

import { Container, AnimationContainer, BackButton, SelectDiv } from './styles';

interface UserFormData {
  name: string;
  email: string;
  role: string;
}

const NewUser: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();

  const schema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      email: Yup.string()
        .email('Digite um email válido')
        .required('Email obrigatório'),
      role: Yup.string().required('O tipo de usuário é obrigatório')
    });
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<UserFormData>(schema);

  return (
    <Container>
      <BackButton to={`/users`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Novo usuário</h1>
      <AnimationContainer>
        <form
          onSubmit={handleSubmit(async data => {
            try {
              await api.post('users', data);
              addToast({
                type: 'success',
                title: 'Usuário',
                description: 'Usuário cadastrado com sucesso.'
              });
              history.push(`/users`);
            } catch (err) {
              addToast({
                type: 'error',
                title: 'Usuário',
                description: 'Erro ao cadastrar um usuário. Tente novamente.'
              });
            }
          })}
        >
          <InputClean
            placeholder="Nome do usuário"
            icon={FiUser}
            error={errors.name?.message}
            {...register('name')}
          />
          <InputClean
            placeholder="E-mail do usuário"
            icon={FiMail}
            error={errors.email?.message}
            {...register('email')}
          />
          <SelectDiv>
            <InputSelectClean
              placeholder="Selecione o tipo de usuário"
              defaultValue="user"
              options={[
                {
                  value: 'user',
                  label: 'Usuário'
                }
              ]}
              {...register('role')}
            />
          </SelectDiv>
          <Button type="submit">Cadastrar Usuário</Button>
        </form>
      </AnimationContainer>
    </Container>
  );
};

export default NewUser;
