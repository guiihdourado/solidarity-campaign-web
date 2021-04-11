import React, { useEffect, useState, useCallback } from 'react';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import { FaRegBuilding } from 'react-icons/fa';
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
  CardContainer,
  Menus,
  MenuLink
} from './styles';

interface Quotations {
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
}

interface RouteParams {
  campaignId: string;
}

const Quotations: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { campaignId } = useParams<RouteParams>();

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign>({} as Campaign);

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
                setCampaign(({ campaign, ...restData }) => {
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
    api.get(`/campaigns/${campaignId}`).then(({ data }) => {
      setCampaign(data);
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
      <h1>{campaign.name}</h1>
      {user.role === 'admin' && (
        <Menus>
          <MenuLink to={`/campaigns/${campaign.id}/new-location`}>
            <FaRegBuilding />
            Cadastrar Locais
          </MenuLink>
        </Menus>
      )}
    </Container>
  );
};

export default Quotations;
