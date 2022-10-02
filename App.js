import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, remove, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAy5II5Y-6kQBY-ToseEyQR_aqOdnJEDYA",
  authDomain: "ostoslistafirebase-b99a6.firebaseapp.com",
  databaseURL: "https://ostoslistafirebase-b99a6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ostoslistafirebase-b99a6",
  storageBucket: "ostoslistafirebase-b99a6.appspot.com",
  messagingSenderId: "172507736751",
  appId: "1:172507736751:web:ff37da815f21cea875025a",
  measurementId: "G-F3M46KVE3P"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
ref(database,'items/')

export default function App() {
  
  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const item = snapshot.val();
      const items = item ? Object.keys(item).map(key => ({ key, ...item[key] })) : [];
      setItems(items); 
    });
  }, []);

  const saveItem = () => {  
    push(    
      ref(database, 'items/'),    
      { 'product': product, 'amount': amount });
      setProduct('');
      setAmount('');
  }
  const deleteItem = (key) => {
    remove(
      ref(database, `items/${key}`)
    )
  };
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
      <Button onPress={saveItem} title="Save"/> 
      <Text style={{marginTop: 30, marginBottom: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.key.toString()} 
        data={items}
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item.key)}> delete</Text>
        </View>} 
        
      />    
      <StatusBar style="auto" />  
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 40,
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});
