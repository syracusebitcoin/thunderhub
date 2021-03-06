import React from 'react';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { Version } from 'src/components/version/Version';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GET_NODE_INFO } from 'src/graphql/queries/getNodeInfo';
import { NetworkInfo } from '../src/views/home/networkInfo/NetworkInfo';
import { AccountInfo } from '../src/views/home/account/AccountInfo';
import { QuickActions } from '../src/views/home/quickActions/QuickActions';
import { FlowBox } from '../src/views/home/reports/flow';
import { ForwardBox } from '../src/views/home/reports/forwardReport';
import { LiquidReport } from '../src/views/home/reports/liquidReport/LiquidReport';
import { ConnectCard } from '../src/views/home/connect/Connect';

const HomeView = () => {
  return (
    <>
      <Version />
      <AccountInfo />
      <ConnectCard />
      <QuickActions />
      <FlowBox />
      <LiquidReport />
      <ForwardBox />
      <NetworkInfo />
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <HomeView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, [GET_NODE_INFO]);
}
