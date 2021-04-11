import React, { useEffect, useState } from 'react';
import { FiPlusCircle, FiArrowLeft, FiEdit } from 'react-icons/fi';
import SyncLoader from 'react-spinners/SyncLoader';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import {
  Container,
  BackButton,
  CreateProduct,
  ContainerLoading,
  CardContainer,
  ActionButtons
} from './styles';

interface Product {
  id: string;
  name: number;
}

const ListProducts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products').then(({ data }) => {
      setProducts(data);
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
      <h1>Produtos</h1>
      <CreateProduct to={`/new-product`}>
        <FiPlusCircle />
        Criar novo produto
      </CreateProduct>
      {products.map(product => (
        <CardContainer key={product.id}>
          <div>
            <h1>{product.name}</h1>
          </div>

          <ActionButtons>
            <Link to={`/edit-product/${product.id}`}>
              <FiEdit size={30} />
            </Link>
          </ActionButtons>
        </CardContainer>
      ))}
    </Container>
  );
};

export default ListProducts;
