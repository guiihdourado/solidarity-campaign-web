import React, { useEffect, useState } from 'react';
import { FiPlusCircle, FiArrowLeft, FiEdit } from 'react-icons/fi';
import SyncLoader from 'react-spinners/SyncLoader';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import {
  Container,
  BackButton,
  CreateUser,
  ContainerLoading,
  CardContainer,
  ActionButtons
} from './styles';

interface User {
  id: string;
  name: number;
  email: string;
  role: 'admin' | 'user';
}

const ListUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/users').then(({ data }) => {
      setUsers(data);
      setTimeout(() => {
        setLoading(false);
      }, 1);
    });
  });

  if (loading) {
    return (
      <ContainerLoading>
        <SyncLoader size={30} color="#FFF" />
      </ContainerLoading>
    );
  }

  return (
    <Container>
      <BackButton to={`/dashboard`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Usuários</h1>
      <CreateUser to={`/new-user`}>
        <FiPlusCircle />
        Criar novo usuário
      </CreateUser>
      {users.map(user => (
        <CardContainer key={user.id}>
          <div>
            <h1>{user.name}</h1>
            <h4>{user.email}</h4>
            <p>{user.role}</p>
          </div>

          <ActionButtons>
            <Link to={`/edit-user/${user.id}`}>
              <FiEdit size={30} />
            </Link>
          </ActionButtons>
        </CardContainer>
      ))}
    </Container>
  );
};

export default ListUsers;
