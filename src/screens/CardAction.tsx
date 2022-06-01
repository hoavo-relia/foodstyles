import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import {BlurView} from '@react-native-community/blur';
import {useMutation} from '@apollo/client';
import CardItem from '../components/card/CardItem';
import IconShare from '../assets/images/share.png';
import IconDuplicate from '../assets/images/duplicate.png';
import IconDelete from '../assets/images/delete.png';

import {GET_CARDS, DELETE_CARD, DUPLICATE_CARD, SHARE_CARD} from '../graphql';

enum ACTION_TYPE {
  SHARE = 'Share',
  DUPLICATE = 'Duplicate',
  DELETE = 'Delete',
}

const ACTION_BUTTONS = [
  {title: 'Share', icon: IconShare, actionType: ACTION_TYPE.SHARE},
  {title: 'Duplicate', icon: IconDuplicate, actionType: ACTION_TYPE.DUPLICATE},
  {title: 'Delete', icon: IconDelete, actionType: ACTION_TYPE.DELETE},
];

const MENU_SIZE = 160;
const windowHeight = Dimensions.get('window').height;

const ActionButton: React.FC<{
  title: string;
  icon: ImageSourcePropType;
  actionType: string;
  onAction: Function;
}> = ({title, icon, actionType, onAction}) => {
  return (
    <TouchableOpacity
      style={styles.actionButtonContainer}
      onPress={() => {
        onAction(actionType);
      }}>
      <Text style={styles.actionButtonText}>{title}</Text>
      <Image
        source={icon}
        style={{
          width: 54,
          height: 54,
        }}
      />
    </TouchableOpacity>
  );
};

const CardActionModal: React.FC<{
  data: Item;
  onClose: Function;
}> = ({data, onClose}) => {
  const [deleteCard] = useMutation(DELETE_CARD);
  const [duplicateCard] = useMutation(DUPLICATE_CARD);
  const [shareCard] = useMutation(SHARE_CARD);

  const {id, name, positionY, height} = data;
  const positionMenu =
    windowHeight / 2 < positionY
      ? {top: -MENU_SIZE - height - 10}
      : {bottom: -height + 50};
  const onAction = async (actionType: string) => {
    switch (actionType) {
      case ACTION_TYPE.DELETE:
        Alert.alert(
          'Confirm delete',
          'This will delete the Food Style and all its settings.',
          [
            {
              text: 'Delete',
              onPress: () => {
                deleteCard({
                  variables: {id},
                  update(cache, {errors}) {
                    if (!errors) {
                      const data: any = cache.readQuery({query: GET_CARDS});
                      const newData = data.cards.filter(
                        (itm: {id: string}) => itm.id !== id,
                      );
                      cache.writeQuery({
                        query: GET_CARDS,
                        data: {cards: newData},
                      });
                    }
                  },
                });
                onClose();
              },
              style: 'destructive',
            },
            {
              text: 'Cancel',
            },
          ],
        );

        break;

      case ACTION_TYPE.DUPLICATE:
        duplicateCard({
          variables: {id},
          update(cache, {data: {duplicateCard}}) {
            const data: any = cache.readQuery({query: GET_CARDS});
            cache.writeQuery({
              query: GET_CARDS,
              data: {cards: [...data.cards, duplicateCard]},
            });
          },
        });
        onClose();
        break;

      case ACTION_TYPE.SHARE:
        shareCard({
          variables: {id},

          onCompleted: async ({shareCard}) => {
            await Share.open({
              message: name,
              url: `https://cards.foodstyles.com/${shareCard}`,
            });
          },
        });

        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <BlurView style={styles.absolute} blurType="light" blurAmount={15} />
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.absolute, {top: positionY - 20}]}>
          <CardItem data={{name}} isShowing={true} onPress={onClose} />
          <View
            style={[
              {
                flexDirection: 'column',
                ...positionMenu,
              },
            ]}>
            {ACTION_BUTTONS.map((itm, index) => (
              <ActionButton key={index} {...itm} onAction={onAction} />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButtonText: {
    fontFamily: 'Proxima Nova A',
    fontSize: 15,
    fontWeight: '600',
    fontStyle: 'normal',
    letterSpacing: 0,
    textAlign: 'right',
    color: '#11b777',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default CardActionModal;
