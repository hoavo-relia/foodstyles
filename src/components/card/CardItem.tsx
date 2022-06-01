import React, {useRef} from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import IconOption from '../../assets/images/options.png';
import IconClose from '../../assets/images/close.png';

const CardItem: React.FC<{
  data: {name: string};
  isShowing?: boolean;
  onPress?: Function;
}> = ({data, isShowing = false, onPress = () => {}}) => {
  const {name} = data;
  const ref = useRef<View>(null);
  const pressItem = () => {
    if (isShowing) {
      return onPress(data);
    }
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      onPress({...data, positionY: pageY, height});
    });
  };
  return (
    <View style={styles.container} ref={ref}>
      <Text style={styles.title}>{name}</Text>
      <TouchableOpacity style={{marginLeft: 14}} onPress={pressItem}>
        <Image
          source={isShowing ? IconClose : IconOption}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingLeft: 18,
    paddingRight: 15,
    marginBottom: 6,
    borderRadius: 6,
    backgroundColor: 'white',
    shadowColor: 'rgba(176, 176, 176, 0.4)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 7,
    shadowOpacity: 1,
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Proxima Nova A',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 22,
    letterSpacing: 0,
    color: 'rgb(67, 67, 67)',
    flex: 1,
  },
});
