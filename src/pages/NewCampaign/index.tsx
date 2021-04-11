import React, { useRef, useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { Form } from '@unform/web';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import keys from 'lodash/keys';
import includes from 'lodash/includes';
import filter from 'lodash/filter';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import InputCheckbox from '../../components/InputCheckbox';
import InputMask from '../../components/InputMask';
import Button from '../../components/Button';

import getValidationErrors from '../../utils/getValidationsErrors';

import {
  Container,
  AnimationContainer,
  ContainerItens,
  Itens,
  BackButton
} from './styles';

interface ItemCheckbox {
  [key: string]: any;
  quantity_we_have: string;
}

interface CampaignFormData {
  name: string;
  begin_date: string;
  end_date: string;
  available_value: number;
  products: ItemCheckbox[];
}

interface Product {
  id: string;
  name: string;
}

const NewCampaign: React.FC = () => {
  const formRef = useRef(null);
  const history = useHistory();
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get<Product[]>('/products').then(({ data }) => {
      setProducts(data);
    });
  }, []);

  const formatDate = useCallback((date: string): string => {
    const datePart = date.match(/\d+/g);
    if (!datePart) {
      return '';
    }

    const year = datePart[2];
    const month = datePart[1];
    const day = datePart[0];

    return `${year}-${month}-${day}`;
  }, []);

  const handleSubmit = useCallback(
    async (data: CampaignFormData) => {
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

        const { begin_date, end_date, products: productsItens, ...rest } = data;

        const mapProducts = filter(
          productsItens.map(({ quantity_we_have, ...product }) => {
            if (includes(product, true)) {
              return {
                quantity_we_have: parseInt(quantity_we_have, 10),
                product_id: keys(product)[0]
              };
            }

            return null;
          }),
          product => product
        );

        const beginDateFormatted = formatDate(begin_date);
        const endDateFormatted = formatDate(end_date);

        await api.post('campaigns', {
          ...rest,
          begin_date: format(new Date(beginDateFormatted), 'yyyy-MM-dd'),
          end_date: format(new Date(endDateFormatted), 'yyyy-MM-dd'),
          products: mapProducts
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
    [addToast, formatDate, history]
  );

  return (
    <Container>
      <BackButton to={'/dashboard'}>
        <FiArrowLeft />
        Voltar
      </BackButton>
      <h1>Nova campanha</h1>
      <AnimationContainer>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="name" placeholder="Nome da campanha" />
          <InputMask
            name="begin_date"
            mask="99/99/9999"
            maskPlaceholder={null}
            placeholder={'Início da campanha'}
            icon={FiCalendar}
          />
          <InputMask
            name="end_date"
            mask="99/99/9999"
            maskPlaceholder={null}
            placeholder={'Fim da campanha'}
            icon={FiCalendar}
          />
          <Input
            icon={FaRegMoneyBillAlt}
            name="available_value"
            placeholder="Valor disponível"
          />

          <ContainerItens>
            <h3>Selecione os itens a serem cotados</h3>

            <Itens>
              {products.map((product, key) => (
                <div key={product.id}>
                  <InputCheckbox
                    name={`products[${key}].${product.id}`}
                    label={product.name}
                  />
                  <Input
                    name={`products[${key}].quantity_we_have`}
                    placeholder={`Quantidade que já temos de ${product.name}`}
                    defaultValue={0}
                    type="number"
                  />
                </div>
              ))}
            </Itens>
          </ContainerItens>
          <Button type="submit">Cadastrar Campanha</Button>
        </Form>
      </AnimationContainer>
    </Container>
  );
};

export default NewCampaign;
