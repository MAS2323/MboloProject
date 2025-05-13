// components/menu/MenuScreen.js
import React from 'react';
import {FlatList} from 'react-native';
import MenuItem from './MenuItem';
import styles from './styles/MenuScreen.styles';

const menuItems = [
  {
    id: '1',
    title: 'Información',
    items: ['Alquiler', 'Ventas'],
  },
  {
    id: '2',
    title: 'Ministerios',
    items: ['ONGs', 'Educación'],
  },
  {
    id: '3',
    title: 'Servicios',
    items: ['Turismo', 'Sanidad'],
  },
  {
    id: '4',
    title: 'Servicios',
    items: ['Turismo', 'Sanidad'],
  },
  {
    id: '5',
    title: 'Servicios',
    items: ['Turismo', 'Sanidad'],
  },
  {
    id: '6',
    title: 'Servicios',
    items: ['Turismo', 'Sanidad'],
  },
];

const MenuScreen = () => {
  return (
    <FlatList
      data={menuItems}
      renderItem={({item}) => (
        <MenuItem title={item.title} items={item.items} />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MenuScreen;
