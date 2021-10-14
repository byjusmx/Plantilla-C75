import React from 'react';
import { StyleSheet, Text, View ,FlatList,ScrollView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import {Header} from 'react-native-elements';
import db from '../config'




export default class ReadStoryScreen extends React.Component {
  constructor(){
    super();
    this.state ={
      allStories:[],
      dataSource:[],
      search : ''
    }
  }
  componentDidMount(){
    this.retrieveStories()
  }

  updateSearch = search => {
    this.setState({ search });
  };


  retrieveStories=()=>{
    try {
      var allStories= []
      var stories = db.collection("stories")
        .get().then((querySnapshot)=> {
          querySnapshot.forEach((doc)=> {
              // doc.data() nuca esta indefinida para las consultas de doc instantáneas
              
              allStories.push(doc.data())
              console.log('estas son las historias',allStories)
          })
          this.setState({allStories})
        })
    }
    catch (error) {
      console.log(error);
    }
  };


  SearchFilterFunction(text) {
    //pasando el texto insertado en textinput
    const newData = this.state.allStories.filter((item)=> {
      //aplicando filtro para el texto insertado en la barra de búsqueda
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //estableciendo el filtrado de newData en datasource
      //Después de configurar los datos, volverá a renderizar automáticamente la vista
      dataSource: newData,
      search: text,
    });
  }

    render(){
      return(
        <View style ={styles.container}>
           <Header 
                backgroundColor = {'pink'}
                centerComponent = {{
                    text : 'Historias para Dormir',
                    style : { color: 'white', fontSize: 15}
                }}
            />
          <View styles ={{height:20,width:'100%'}}>
              <SearchBar
              placeholder="Escribe aqui..."
              onChangeText={text => this.SearchFilterFunction(text)}
              onClear={text => this.SearchFilterFunction('')}
              value={this.state.search}
            />
          </View>
          
          <FlatList
                data={this.state.search === "" ?  this.state.allStories: this.state.dataSource}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text>  Título: {item.title}</Text>
                    <Text>  Autor : {item.author}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                /> 
          
          
          
        </View>  
      );      
    }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: 'pink',
    padding:10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  itemContainer: {
    height: 80,
    width:'100%',
    borderWidth: 2,
    borderColor: 'pink',
    justifyContent:'center',
    alignSelf: 'center',
  }
});
