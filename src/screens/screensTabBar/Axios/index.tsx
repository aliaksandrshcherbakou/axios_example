import GradientBackground from '@Components/GradientBackground';
import Typography from '@Components/Typography';
import {SIZES} from '@Constants/style.constants';
import {Button} from '@ui-kitten/components';
import React, {memo} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useAddMutation, useAllQuery} from 'src/api/user';

const Axios = () => {
  const {data, isSuccess, refetch} = useAllQuery();
  const [addObject, {data: dataAdd, isSuccess: isSuccessAdd}] = useAddMutation();

  const handlePress = () => {
    refetch();
  };
  const handleAdd = () => {
    addObject({
      name: 'Apple MacBook Pro 16',
      data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground style={styles.spacing}>
        <Typography element="h1">Query:</Typography>
        {isSuccess && data.slice(0, 2).map(it => <Typography element="h3">name: {it.name}</Typography>)}
        <Button onPress={handlePress}>refetch</Button>
        <Typography element="h1">Mutation:</Typography>
        <Typography element="h3">id: {isSuccessAdd && dataAdd.id}</Typography>
        <Typography element="h3">name: {isSuccessAdd && dataAdd.name}</Typography>
        <Button onPress={handleAdd}>add</Button>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default memo(Axios);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spacing: {paddingVertical: 25},
  alignCenter: {
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SIZES.width * 0.9,
    marginTop: 20,
  },
});
