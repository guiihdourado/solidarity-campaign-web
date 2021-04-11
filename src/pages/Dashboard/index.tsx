import React, { useCallback, useEffect, useState } from 'react';
import {
  FiPlusCircle,
  FiArrowRightCircle,
  FiLogOut,
  FiUsers,
  FiEdit,
  FiTrash
} from 'react-icons/fi';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import api from '../../services/api';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import {
  Container,
  Menus,
  MenuLink,
  CardContainer,
  OpenCampaign,
  ActionButtons,
  ActionButton
} from './styles';

export interface Campaign {
  id: string;
  name: string;
  begin_date: Date;
  end_date: Date;
  is_open: boolean;
  available_value: string;
}

const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { signOut, user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    api.get('/campaigns').then(({ data }) => {
      setCampaigns(data);
    });
  }, []);

  const formatValue = useCallback(value => {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }, []);

  const openCampaign = useCallback(
    campaignId => {
      confirmAlert({
        message: 'Tem certeza que gostaria de abrir a campanha?',
        buttons: [
          {
            label: 'Sim',
            onClick: async () => {
              api
                .patch(`/campaigns/${campaignId}/update-status`)
                .then(() => {
                  setCampaigns(state => {
                    return state.map(campaign => {
                      if (campaign.id === campaignId) {
                        return {
                          ...campaign,
                          is_open: true
                        };
                      }

                      return campaign;
                    });
                  });
                  addToast({
                    type: 'success',
                    title: 'Campanha',
                    description: 'Campanha aberta com sucesso !'
                  });
                })
                .catch(() => {
                  addToast({
                    type: 'error',
                    title: 'Campanha',
                    description: 'Erro ao abrir a campanha. Tente novamente.'
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
    },
    [addToast]
  );

  const deleteCampaign = useCallback(
    campaignId => {
      confirmAlert({
        message:
          'Todos os dados cadastrados dessa campanha você irá perder. Tem certeza que gostaria de excluir a campanha?',
        buttons: [
          {
            label: 'Sim',
            onClick: async () => {
              api
                .delete(`/campaigns/${campaignId}`)
                .then(() => {
                  setCampaigns(state => {
                    return state.filter(campaign => {
                      return campaign.id !== campaignId;
                    });
                  });
                  addToast({
                    type: 'success',
                    title: 'Campanha',
                    description: 'Campanha deletada com sucesso !'
                  });
                })
                .catch(() => {
                  addToast({
                    type: 'error',
                    title: 'Campanha',
                    description: 'Erro ao deletar a campanha. Tente novamente.'
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
    },
    [addToast]
  );

  return (
    <Container>
      <div>
        <h1>Campanhas Solidárias</h1>
        <button onClick={signOut}>
          <FiLogOut />
        </button>
      </div>
      {user.role === 'admin' && (
        <Menus>
          <MenuLink to={'/new-campaign'}>
            <FiPlusCircle />
            Criar nova campanha
          </MenuLink>
          <MenuLink to={'/users'}>
            <FiUsers />
            Usuários
          </MenuLink>
          <MenuLink to={'/products'}>
            <FiUsers />
            Produtos
          </MenuLink>
        </Menus>
      )}
      {campaigns.map(campaign => (
        <CardContainer key={campaign.id} isOpen={campaign.is_open}>
          <div>
            <h1>{campaign.name}</h1>
            <p>
              Inicia em: {format(new Date(campaign.begin_date), 'dd/MM/yyyy')}
            </p>
            <p>
              Termina em: {format(new Date(campaign.end_date), 'dd/MM/yyyy')}
            </p>
            <span>
              Valor Disponível: {formatValue(campaign.available_value)}
            </span>

            {!campaign.is_open && (
              <OpenCampaign onClick={() => openCampaign(campaign.id)}>
                Abrir campanha
              </OpenCampaign>
            )}

            {user.role === 'admin' && (
              <ActionButtons>
                <Link to={`/edit-campaign/${campaign.id}`}>
                  <FiEdit size={30} />
                </Link>
                <ActionButton onClick={() => deleteCampaign(campaign.id)}>
                  <FiTrash size={30} />
                </ActionButton>
              </ActionButtons>
            )}
          </div>
          <Link to={`/campaigns/${campaign.id}/quotations`}>
            <FiArrowRightCircle size={30} />
          </Link>
        </CardContainer>
      ))}
    </Container>
  );
};

export default Dashboard;
