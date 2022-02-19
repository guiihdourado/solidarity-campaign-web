import React, { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser, FiMail } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';

import SyncLoader from 'react-spinners/SyncLoader';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import useForm from '../../hooks/useForm';

import InputClean from '../../components/InputClean';
import InputSelectClean from '../../components/InputSelectClean';
import Button from '../../components/Button';

import {
  Container,
  ContainerLoading,
  AnimationContainer,
  BackButton,
  SelectDiv
} from './styles';

interface UserFormData {
  name: string;
  email: string;
  role: string;
}

interface RouteParams {
  userId: string;
}

const EditUser: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);

  const { userId } = useParams<RouteParams>();

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
    formState: { errors },
    setValue
  } = useForm<UserFormData>(schema);

  const selectRoleOptions = useMemo(
    () => [
      {
        value: 'admin',
        label: 'Administrador'
      },
      {
        value: 'user',
        label: 'Usuário'
      }
    ],
    []
  );

  useEffect(() => {
    api.get(`users/${userId}`).then(({ data }) => {
      setValue('name', data.name);
      setValue('email', data.email);
      setValue('role', data.role);

      setTimeout(() => {
        setLoading(false);
      }, 1);
    });
  }, [selectRoleOptions, setValue, userId]);

  if (loading) {
    return (
      <ContainerLoading>
        <SyncLoader size={30} color="#FFF" />
      </ContainerLoading>
    );
  }

  return (
    <Container>
      <BackButton to={`/users`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Editar usuário</h1>
      <AnimationContainer>
        <form
          onSubmit={handleSubmit(async data => {
            try {
              await api.put(`users/${userId}`, data);

              addToast({
                type: 'success',
                title: 'Usuário',
                description: 'Usuário editado com sucesso.'
              });

              history.push(`/users`);
            } catch (err) {
              addToast({
                type: 'error',
                title: 'Usuário',
                description: 'Erro ao editar um usuário. Tente novamente.'
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
              options={[
                {
                  value: 'user',
                  label: 'Usuário'
                }
              ]}
              {...register('role')}
            />
          </SelectDiv>
          <Button type="submit">Editar Usuário</Button>
        </form>
      </AnimationContainer>
    </Container>
  );
};

export default EditUser;
