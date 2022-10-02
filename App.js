import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';

export default function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyAy5II5Y-6kQBY-ToseEyQR_aqOdnJEDYA",
    authDomain: "ostoslistafirebase-b99a6.firebaseapp.com",
    databaseURL: "https://ostoslistafirebase-b99a6-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ostoslistafirebase-b99a6",
    storageBucket: "ostoslistafirebase-b99a6.appspot.com",
    messagingSenderId: "54172507736751"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  ref(database,'items/')

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');  
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();    
      setItems(Object.values(data));  
    })
  }, []);

  const saveItem = () => {  
    push(    
      ref(database, 'items/'),    
      { 'product': product, 'amount': amount });
  }
    const deleteItem = () => {  
      remove(    
        ref(database, 'items/'),    
        { 'product': product, 'amount': amount });
  }
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  }; 

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}/>  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.id)}> delete</Text></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
