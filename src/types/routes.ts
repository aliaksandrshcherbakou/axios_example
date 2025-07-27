export enum ROUTES {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  MAIN = 'MAIN',
  STATISTICS = 'STATISTICS',
  PROFILE = 'PROFILE',
}

export type RootStackParamList = {
  [ROUTES.AUTH]: undefined;
  [ROUTES.DASHBOARD]: undefined;
} & TabBarStackParamList;

export type TabBarStackParamList = {
  [ROUTES.MAIN]: undefined;
  [ROUTES.STATISTICS]: undefined;
  [ROUTES.PROFILE]: undefined;
};
