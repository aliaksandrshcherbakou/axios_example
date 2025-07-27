import Typography from '@Components/Typography';
import {SIZES} from '@Constants/style.constants';
import {TLocationInfo} from '@Types/index';
import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {headerText} from 'src/mockData';

const Table = ({data}: {data: TLocationInfo}) => {
  const selectedValues = data ? Object.keys(data).map(key => data[key as keyof TLocationInfo]) : [];
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {headerText.map(header => (
          <Typography element="h3" style={styles.text} key={header}>
            {header}
          </Typography>
        ))}
      </View>
      {data && (
        <View style={styles.row}>
          {selectedValues.map(it => (
            <Typography element="caption" style={styles.text} key={it}>
              {it}
            </Typography>
          ))}
        </View>
      )}
    </View>
  );
};

export default memo(Table);
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: SIZES.width * 0.9,
    marginTop: 25,
  },

  row: {flexDirection: 'row', marginTop: 5},
  text: {flex: 1, textAlign: 'center'},
});
