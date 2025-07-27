export enum ROUTES {
  DASHBOARD = 'DASHBOARD',
  MAIN = 'MAIN',
  STATISTICS = 'STATISTICS',
  PROFILE = 'PROFILE',
}

export type RootStackParamList = {
  [ROUTES.DASHBOARD]: undefined;
} & TabBarStackParamList;

export type TabBarStackParamList = {
  [ROUTES.MAIN]: undefined;
  [ROUTES.STATISTICS]: undefined;
  [ROUTES.PROFILE]: undefined;
};
