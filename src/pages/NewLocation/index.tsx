import React, { useRef, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { useHistory, useParams } from 'react-router-dom';
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

interface ParamTypes {
  campaignId: string;
}

const NewLocation: React.FC = () => {
  const formRef = useRef<FormHandles>(null as FormHandles);
  const history = useHistory();
  const { campaignId } = useParams<ParamTypes>();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  const handleSubmit: SubmitHandler<Location> = useCallback(
    async (data, { reset }) => {
      try {
        formRef.current.setErrors({});
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

        reset({
          place_name: '',
          place_localization: '',
          user_id: []
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current.setErrors(errors);

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
      <BackButton to={`/campaigns/${campaignId}/quotations`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Novo local</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
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
          <Button type="submit">Adicionar Local</Button>
        </Form>
      </AnimationContainer>
      <Locations>
        {locations.map((location, key) => (
          <div key={key}>
            <h4>{location.place_name}</h4>
            <p>{location.place_localization}</p>
            <span>{location.user_id}</span>
          </div>
        ))}
      </Locations>
    </Container>
  );
};

export default NewLocation;
