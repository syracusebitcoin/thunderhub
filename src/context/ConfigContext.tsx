import React, { createContext, useContext, useReducer, useEffect } from 'react';
import getConfig from 'next/config';
import Cookies from 'js-cookie';
import omit from 'lodash.omit';

const themeTypes = ['dark', 'light', 'night'];
const currencyTypes = ['sat', 'btc', 'fiat'];

export type channelBarStyleTypes =
  | 'normal'
  | 'compact'
  | 'ultracompact'
  | 'balancing';
export type channelBarTypeTypes = 'balance' | 'fees' | 'size' | 'proportional';
export type channelSortTypes =
  | 'none'
  | 'age'
  | 'local'
  | 'balance'
  | 'deviation'
  | 'feeRate'
  | 'partnerName'
  | 'size';
export type sortDirectionTypes = 'increase' | 'decrease';
export type subBarType = 'fees' | 'none';

type State = {
  currency: string;
  theme: string;
  sidebar: boolean;
  fetchFees: boolean;
  fetchPrices: boolean;
  displayValues: boolean;
  hideFee: boolean;
  hideNonVerified: boolean;
  maxFee: number;
  chatPollingSpeed: number;
  channelBarStyle: channelBarStyleTypes;
  channelBarType: channelBarTypeTypes;
  channelSort: channelSortTypes;
  sortDirection: sortDirectionTypes;
  subBar: subBarType;
};

type ConfigInitProps = {
  initialConfig: string;
};

type ActionType =
  | {
      type: 'change' | 'initChange';
      currency?: string;
      theme?: string;
      sidebar?: boolean;
      fetchFees?: boolean;
      fetchPrices?: boolean;
      displayValues?: boolean;
      hideFee?: boolean;
      hideNonVerified?: boolean;
      maxFee?: number;
      chatPollingSpeed?: number;
      channelBarStyle?: channelBarStyleTypes;
      channelBarType?: channelBarTypeTypes;
      channelSort?: channelSortTypes;
      sortDirection?: sortDirectionTypes;
      subBar?: subBarType;
    }
  | { type: 'themeChange'; theme: string };

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const { publicRuntimeConfig } = getConfig();
const {
  defaultTheme: defT,
  defaultCurrency: defC,
  fetchPrices,
  fetchFees,
} = publicRuntimeConfig;

const initialState: State = {
  currency: currencyTypes.indexOf(defC) > -1 ? defC : 'sat',
  theme: themeTypes.indexOf(defT) > -1 ? defT : 'dark',
  sidebar: true,
  fetchFees,
  fetchPrices,
  displayValues: true,
  hideFee: false,
  hideNonVerified: false,
  maxFee: 20,
  chatPollingSpeed: 1000,
  channelBarStyle: 'normal',
  channelBarType: 'balance',
  channelSort: 'none',
  sortDirection: 'decrease',
  subBar: 'none',
};

const stateReducer = (state: State, action: ActionType): State => {
  const { type, ...settings } = action;
  switch (type) {
    case 'initChange': {
      return {
        ...state,
        ...settings,
      };
    }
    case 'change': {
      const newState = {
        ...state,
        ...settings,
      };
      localStorage.setItem('config', JSON.stringify(omit(newState, 'theme')));
      return newState;
    }
    case 'themeChange': {
      if (settings.theme) {
        Cookies.set('theme', settings.theme, {
          expires: 365,
          sameSite: 'strict',
        });
        return {
          ...state,
          theme: settings.theme,
        };
      }
      return state;
    }
    default:
      return state;
  }
};

const ConfigProvider: React.FC<ConfigInitProps> = ({
  children,
  initialConfig,
}) => {
  const [state, dispatch] = useReducer(stateReducer, {
    ...initialState,
    theme: themeTypes.indexOf(initialConfig) > -1 ? initialConfig : 'dark',
  });

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('config') || '{}');
    dispatch({ type: 'initChange', ...savedConfig });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useConfigState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useConfigState must be used within a ConfigProvider');
  }
  return context;
};

const useConfigDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useConfigDispatch must be used within a ConfigProvider');
  }
  return context;
};

export { ConfigProvider, useConfigState, useConfigDispatch };
