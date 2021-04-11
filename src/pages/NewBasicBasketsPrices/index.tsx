import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { FiArrowLeft } from 'react-icons/fi';
import { FaRegMoneyBillAlt, FaRegAddressCard } from 'react-icons/fa';
import { Form } from '@unform/web';
import { useHistory, useParams } from 'react-router-dom';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import { Container, AnimationContainer, BackButton } from './styles';

interface CompanyFormData {
  place_name: string;
  place_localization: string;
  price: string;
}

interface RouteParams {
  campaignId: string;
}

const NewBasicBasketsPrices: React.FC = () => {
  const { campaignId } = useParams<RouteParams>();

  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async (data: CompanyFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          place_name: Yup.string().required('Nome do local obrigatório'),
          place_localization: Yup.string().required(
            'Endereço do local obrigatório'
          ),
          price: Yup.string().required('Preço cotado obrigatório')
        });

        await schema.validate(data, {
          abortEarly: false
        });

        await api.post('basic-baskets-prices', {
          ...data,
          campaign_id: campaignId,
          user_id: user.id
        });

        addToast({
          type: 'success',
          title: 'Cotação',
          description: 'Cotação cadastrada com sucesso.'
        });

        history.push(`/campaigns/${campaignId}/basic-baskets-prices`);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Cotação',
          description: 'Erro ao cadastrar uma cotação. Tente novamente.'
        });
      }
    },
    [addToast, campaignId, history, user.id]
  );

  return (
    <Container>
      <BackButton to={`/campaigns/${campaignId}/basic-baskets-prices`}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Cotação Cesta Básica</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="place_name" placeholder="Nome do local" />
          <Input
            name="place_localization"
            placeholder="Endereço do local"
            icon={FaRegAddressCard}
          />
          <Input
            icon={FaRegMoneyBillAlt}
            name="price"
            placeholder="Preço cotado"
          />
          <Button type="submit">Cadastrar Cotação</Button>
        </Form>
      </AnimationContainer>
    </Container>
  );
};

export default NewBasicBasketsPrices;
