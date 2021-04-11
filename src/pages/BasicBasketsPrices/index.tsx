import React, { useEffect, useState, useCallback } from 'react';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import SyncLoader from 'react-spinners/SyncLoader';
import { isBefore } from 'date-fns';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import Button from '../../components/Button';

import {
  Container,
  BackButton,
  CreateQuotation,
  ContainerLoading,
  CardContainer
} from './styles';

interface BasicBasketsPrices {
  id: string;
  price: number;
  place_name: string;
  place_localization: string;
  user: {
    name: string;
  };
  can_buy: number;
  change: number;
}

export interface Campaign {
  id: string;
  name: string;
  begin_date: Date;
  end_date: Date;
  is_open: boolean;
  available_value: string;
  best_option_id: string;
}

interface Data {
  campaign: Campaign;
  basicBasketsPrices: BasicBasketsPrices[];
}

interface RouteParams {
  campaignId: string;
}

const BasicBasketsPrices: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { campaignId } = useParams<RouteParams>();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data>({} as Data);

  const closeCampaign = useCallback(() => {
    confirmAlert({
      message: 'Tem certeza que gostaria de fechar a campanha?',
      buttons: [
        {
          label: 'Sim',
          onClick: async () => {
            api
              .patch(`/campaigns/${campaignId}/update-status`)
              .then(() => {
                setData(({ campaign, ...restData }) => {
                  const { is_open, ...restCampaign } = campaign;
                  return {
                    ...restData,
                    campaign: {
                      ...restCampaign,
                      is_open: !is_open
                    }
                  };
                });
                addToast({
                  type: 'success',
                  title: 'Campanha',
                  description: 'Campanha fechada com sucesso !'
                });
              })
              .catch(() => {
                addToast({
                  type: 'error',
                  title: 'Campanha',
                  description: 'Erro ao fechar a campanha. Tente novamente.'
                });
              });
          }
        },
        {
          label: 'Não',
          onClick: () => {}
        }
      ]
    });
  }, [addToast, campaignId]);

  useEffect(() => {
    api
      .get('/basic-baskets-prices', {
        params: {
          campaignId
        }
      })
      .then(({ data: response }) => {
        setData(response);
        setTimeout(() => {
          setLoading(false);
        }, 1);
      });
  }, [campaignId]);

  const formatValue = useCallback((value: number) => {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  const showCreateQuotation = useCallback((isOpen: boolean, endDate: Date) => {
    const beforeNow = isBefore(new Date(Date.now()), new Date(endDate));

    return !!isOpen && beforeNow;
  }, []);

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
      <h1>{data.campaign.name}</h1>
      {data.campaign.is_open && user.role === 'admin' && (
        <Button onClick={() => closeCampaign()}>Fechar Campanha</Button>
      )}
      {showCreateQuotation(data.campaign.is_open, data.campaign.end_date) && (
        <CreateQuotation
          to={`/campaigns/${data.campaign.id}/basic-baskets-prices/new-quotation`}
        >
          <FiPlusCircle />
          Criar nova cotação
        </CreateQuotation>
      )}
      {data.basicBasketsPrices.map(basicBasketPrice => (
        <CardContainer
          key={basicBasketPrice.id}
          bestOption={
            !data.campaign.is_open &&
            data.campaign.best_option_id === basicBasketPrice.id
          }
        >
          <div>
            <h1>{basicBasketPrice.place_name}</h1>
            <h4>{basicBasketPrice.place_localization}</h4>
            <p>Valor: {formatValue(basicBasketPrice.price)}</p>
            <span>Inserido por {basicBasketPrice.user.name}</span>

            {user.role === 'admin' && (
              <strong>
                Posso comprar <span>{basicBasketPrice.can_buy}</span> unidades e
                sobra <span>{formatValue(basicBasketPrice.change)}</span>
              </strong>
            )}
          </div>
        </CardContainer>
      ))}
    </Container>
  );
};

export default BasicBasketsPrices;
