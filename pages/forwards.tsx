import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetForwardsQuery } from 'src/graphql/queries/__generated__/getForwards.generated';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { ForwardType } from 'src/graphql/types';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GET_FORWARDS } from 'src/graphql/queries/getForwards';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
  SmallButton,
  SingleLine,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ForwardCard } from '../src/views/forwards/ForwardsCard';
import { ForwardBox } from '../src/views/home/reports/forwardReport';

const timeMap: { [key: string]: string } = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  threeMonths: 'these past 3 months',
};

const ForwardsView = () => {
  const [time, setTime] = useState('week');
  const [indexOpen, setIndexOpen] = useState(0);

  const { loading, data } = useGetForwardsQuery({
    ssr: false,
    variables: { time },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getForwards) {
    return <LoadingCard title={'Forwards'} />;
  }

  const renderButton = (selectedTime: string, title: string) => (
    <SmallButton onClick={() => setTime(selectedTime)}>{title}</SmallButton>
  );

  const renderNoForwards = () => (
    <Card>
      <p>{`Your node has not forwarded any payments ${timeMap[time]}.`}</p>
    </Card>
  );

  return (
    <>
      <ForwardBox />
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Forwards</SubTitle>
          <SingleLine>
            {renderButton('day', 'D')}
            {renderButton('week', '1W')}
            {renderButton('month', '1M')}
            {renderButton('threeMonths', '3M')}
          </SingleLine>
        </CardTitle>
        {data?.getForwards?.forwards &&
          data.getForwards.forwards.length <= 0 &&
          renderNoForwards()}
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          {data?.getForwards?.forwards?.map((forward, index) => (
            <ForwardCard
              forward={forward as ForwardType}
              key={index}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
            />
          ))}
        </Card>
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <ForwardsView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, [GET_FORWARDS]);
}
