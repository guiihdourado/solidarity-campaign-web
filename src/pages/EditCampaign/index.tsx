import React, { useRef, useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { Form } from '@unform/web';
import { useHistory, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import InputMask from '../../components/InputMask';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import { Container, AnimationContainer, BackButton } from './styles';

export interface Campaign {
  id: string;
  name: string;
  begin_date: string;
  end_date: string;
  is_open: boolean;
  available_value: string;
}

interface RouteParams {
  campaignId: string;
}

const EditCampaign: React.FC = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();
  const { campaignId } = useParams<RouteParams>();

  useEffect(() => {
    api.get(`campaigns/${campaignId}`).then(({ data }) => {
      const { name, available_value, begin_date, end_date, ...restData } = data;
      const campaignData = {
        name,
        available_value,
        begin_date: format(new Date(begin_date), 'dd/MM/yyyy'),
        end_date: format(new Date(end_date), 'dd/MM/yyyy'),
        ...restData
      };

      formRef.current.setData(campaignData);
    });
  }, [campaignId]);

  const formatDate = useCallback((date: string) => {
    const datePart = date.match(/\d+/g);
    const year = datePart[2];
    const month = datePart[1];
    const day = datePart[0];

    return `${year}-${month}-${day}`;
  }, []);

  const handleSubmit = useCallback(
    async (data: Campaign) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          begin_date: Yup.string().required('Data inicial obrigatório'),
          end_date: Yup.string().required('Data final obrigatório'),
          available_value: Yup.string().required('Valor disponível obrigatório')
        });

        await schema.validate(data, {
          abortEarly: false
        });

        const { begin_date, end_date, ...rest } = data;
        const beginDateFormatted = formatDate(begin_date);
        const endDateFormatted = formatDate(end_date);

        await api.put(`campaigns/${campaignId}`, {
          ...rest,
          begin_date: format(new Date(beginDateFormatted), 'yyyy-MM-dd'),
          end_date: format(new Date(endDateFormatted), 'yyyy-MM-dd')
        });

        addToast({
          type: 'success',
          title: 'Campanha',
          description: 'Campanha cadastrada com sucesso.'
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Campanha',
          description: 'Erro ao cadastrar uma campanha. Tente novamente.'
        });
      }
    },
    [addToast, campaignId, formatDate, history]
  );

  return (
    <Container>
      <BackButton to={'/dashboard'}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Editar campanha</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Nome da campanha" />
          <InputMask
            name="begin_date"
            mask="99/99/9999"
            placeholder={'Início da campanha'}
            icon={FiCalendar}
          />
          <InputMask
            name="end_date"
            mask="99/99/9999"
            placeholder={'Fim da campanha'}
            icon={FiCalendar}
          />
          <Input
            icon={FaRegMoneyBillAlt}
            name="available_value"
            placeholder="Valor disponível"
            type="number"
          />
          <Button type="submit">Editar Campanha</Button>
        </Form>
      </AnimationContainer>
    </Container>
  );
};

export default EditCampaign;
