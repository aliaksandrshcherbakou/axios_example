export enum ROUTES {
  DASHBOARD = 'DASHBOARD',
  AXIOS = 'AXIOS',
  MARKET = 'MARKET',
  DATA = 'DATA',
  CHART = 'CHART',
}

export type RootStackParamList = {
  [ROUTES.DASHBOARD]: undefined;
} & TabBarStackParamList

export type TabBarStackParamList = {
  [ROUTES.AXIOS]: undefined;
  [ROUTES.MARKET]: undefined;
  [ROUTES.DATA]: undefined;
  [ROUTES.CHART]: undefined;
}

