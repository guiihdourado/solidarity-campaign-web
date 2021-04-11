import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';

import Dashboard from '../pages/Dashboard';
import NewCampaign from '../pages/NewCampaign';
import EditCampaign from '../pages/EditCampaign';

import BasicBasketsPrices from '../pages/BasicBasketsPrices';
import NewBasicBasketsPrices from '../pages/NewBasicBasketsPrices';

import ListUsers from '../pages/ListUsers';
import NewUser from '../pages/NewUser';
import EditUser from '../pages/EditUser';

import ListProducts from '../pages/ListProducts';
import NewProduct from '../pages/NewProduct';
import EditProduct from '../pages/EditProduct';

import Quotations from '../pages/Quotations';

import NewLocation from '../pages/NewLocation';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/new-campaign" component={NewCampaign} isPrivate />
    <Route
      path="/edit-campaign/:campaignId"
      component={EditCampaign}
      isPrivate
    />

    <Route
      path="/campaigns/:campaignId/quotations"
      component={Quotations}
      isPrivate
    />

    <Route
      path="/campaigns/:campaignId/new-location"
      component={NewLocation}
      isPrivate
    />

    <Route
      path="/campaigns/:campaignId/basic-baskets-prices/new-quotation"
      component={NewBasicBasketsPrices}
      isPrivate
    />
    <Route
      path="/campaigns/:campaignId/basic-baskets-prices"
      component={BasicBasketsPrices}
      isPrivate
    />

    <Route path="/users" component={ListUsers} isPrivate />
    <Route path="/new-user" component={NewUser} isPrivate />
    <Route path="/edit-user/:userId" component={EditUser} isPrivate />

    <Route path="/products" component={ListProducts} isPrivate />
    <Route path="/new-product" component={NewProduct} isPrivate />
    <Route path="/edit-product/:productId" component={EditProduct} isPrivate />
  </Switch>
);

export default Routes;
