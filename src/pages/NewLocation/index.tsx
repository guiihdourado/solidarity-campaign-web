import React, { useRef, useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import filter from 'lodash/filter';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import InputSelect from '../../components/InputSelect';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import {
  Container,
  AnimationContainer,
  BackButton,
  SelectDiv,
  Locations
} from './styles';

interface Location {
  place_name: string;
  place_localization: string;
  user_id: string;
  name: string;
}

interface User {
  id: string;
  name: number;
  email: string;
}

interface UserOption {
  value: string;
  label: string;
}

const NewLocation: React.FC = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();

  const [users, setUsers] = useState<UserOption[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    api.get<User[]>('/users').then(({ data }) => {
      const mapUsers = data.map(user => ({
        value: user.id,
        label: `${user.name} || ${user.email}`
      }));
      setUsers([{ value: '', label: 'Selecione um usuário' }, ...mapUsers]);
    });
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      const userIds = locations.map(location => location.user_id);

      const filteredUsers = users.filter(user => !userIds.includes(user.value));

      setUsers(filteredUsers);
    }
  }, [locations]);

  const handleSubmit = useCallback(
    async (data: any) => {
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

  const handleAddLocation = useCallback(
    async (data: Location) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          place_name: Yup.string().required('Nome do local obrigatório'),
          place_localization: Yup.string().required(
            'Endereço do local obrigatório'
          ),
          user_id: Yup.string().required('O Usuário é obrigatório')
        });

        await schema.validate(data, {
          abortEarly: false
        });

        const findUser = users.find(user => user.value === data.user_id);

        if (findUser) {
          Object.assign(data, { name: findUser.label });
        }

        setLocations(oldState => [...oldState, data]);

        formRef?.current?.setFieldValue('user_id', '');
        formRef?.current?.reset();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Local',
          description: 'Erro ao adicionar um local. Tente novamente.'
        });
      }
    },
    [addToast, users]
  );

  return (
    <Container>
      <BackButton to={`/products`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Novo produto</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleAddLocation}>
          <Input name="place_name" placeholder="Nome do Local" icon={FiUser} />
          <Input
            name="place_localization"
            placeholder="Endereço do Local"
            icon={FiUser}
          />
          <SelectDiv>
            <InputSelect
              name="user_id"
              placeholder="Selecione o usuário"
              styles={{
                container: provided => {
                  return { ...provided, width: '100%' };
                }
              }}
              options={users}
            />
          </SelectDiv>
          <Button type="submit">Adicionar Produto</Button>
        </Form>
        <Locations>
          {locations.map((location, key) => (
            <div key={key}>
              <h4>{location.place_name}</h4>
              <p>{location.place_localization}</p>
              <span>{location.name}</span>
            </div>
          ))}
        </Locations>
      </AnimationContainer>
    </Container>
  );
};

export default NewLocation;
