import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  useColorScheme,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useQuery, useMutation} from '@apollo/client';
import CardItem from '../components/card/CardItem';
import Logo from '../assets/images/logo.png';
import IconAdd from '../assets/images/iconPlus.png';
import BackgroundGradient from '../components/BackgroundGradient';
import CardActionModal from './CardAction';
import {GET_CARDS, ADD_CARD} from '../graphql';

const Cards = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [itemSelected, setItemSelected] = useState<Item | null>(null);
  const {loading, data, refetch} = useQuery(GET_CARDS);
  const [addCard] = useMutation(ADD_CARD);

  const onPressItem = (item: Item) => {
    setIsVisibleModal(true);
    setItemSelected(item);
  };
  const onClose = () => {
    setIsVisibleModal(false);
    setItemSelected(null);
  };
  const renderItem = ({item}: {item: Item}) => (
    <CardItem data={item} onPress={onPressItem} />
  );
  const onPressAdd = () => {
    addCard({
      variables: {name: `My Food Style ${data?.cards.length + 1}`},
      update(cache, {data: {createCard}}) {
        const data: any = cache.readQuery({query: GET_CARDS});
        cache.writeQuery({
          query: GET_CARDS,
          data: {cards: [...data.cards, createCard]},
        });
      },
    });
  };
  const onRefresh = () => {
    refetch({});
  };

  return (
    <View style={styles.container}>
      <BackgroundGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        height={157 + getStatusBarHeight()}
        colors={['rgb(250, 119, 69)', 'rgb(243, 196, 66)']}>
        <SafeAreaView style={{flex: 1, justifyContent: 'space-between'}}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Image
            source={Logo}
            style={{width: 22, height: 26, marginLeft: 18}}
          />
          <BackgroundGradient
            height={80}
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(253, 253, 253, 0.2)',
              'rgba(249, 249, 249, 0.85)',
              'rgb(248, 248, 248)',
            ]}
          />
        </SafeAreaView>
      </BackgroundGradient>
      <View style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            onRefresh={onRefresh}
            refreshing={loading}
            data={data?.cards}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={{
              top: -90,
              backgroundColor: 'transparent',
              paddingHorizontal: 18,
              flex: 1,
              marginBottom: -90,
            }}
          />
        )}
      </View>
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.bottomContainer}>
          <View style={styles.bottom}></View>
          <TouchableOpacity style={styles.bottomButton} onPress={onPressAdd}>
            <Image
              source={IconAdd}
              style={{width: 20, height: 20, marginRight: 10}}
            />
            <Text style={styles.bottomButtonText}>New Food Style</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Modal visible={isVisibleModal} animationType="fade" transparent={true}>
        {itemSelected && (
          <CardActionModal data={itemSelected} onClose={onClose} />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(248, 248, 248)',
  },
  bottomContainer: {
    height: 56,
    flexDirection: 'column-reverse',
  },
  bottom: {
    height: 40,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowOpacity: 1,
  },
  bottomButton: {
    borderRadius: 6,
    backgroundColor: 'white',
    shadowColor: 'rgba(176, 176, 176, 0.4)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    top: 0,
    marginHorizontal: 18,
    shadowRadius: 7,
    shadowOpacity: 1,
    paddingVertical: 12,
    paddingHorizontal: 18,
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  bottomButtonText: {
    fontFamily: 'Proxima Nova A',
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    letterSpacing: 0,
    color: 'rgb(67, 67, 67)',
  },
});

export default Cards;
