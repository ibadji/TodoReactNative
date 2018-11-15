import React, {Component} from 'react';
import {StatusBar,Platform, StyleSheet, Text, View,TextInput,Dimensions,ScrollView,AsyncStorage} from 'react-native';
import TodoList from './components/TodoList'
import LinearGradient from 'react-native-linear-gradient';
import uuidv1 from 'uuid/v1';

const { heigh, width } = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      newTodoItem: '',
      dataIsReady: false,
      todos: {}
    };
}
  componentDidMount = () => {
    this.loadTodos();
  };

  loadTodos = () => {
    this.setState({ dataIsReady: true });
  };
  addTodo = () => {
    const { newTodoItem } = this.state;
  
    if (newTodoItem !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            textValue: newTodoItem,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodoItem: '',
          todos: {
            ...prevState.todos,
            ...newToDoObject
          }
        };
        this.saveTodos(newState.todos);
        return { ...newState };
      });
    }
  };
  deleteTodo = id => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };
  inCompleteTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };
  
  completeTodo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };
  updateTodo = (id, textValue) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            textValue: textValue
          }
        }
      };
      this.saveTodos(newState.todos);
      return { ...newState };
    });
  };
  saveTodos = newToDos => {
    const saveTodos = AsyncStorage.setItem('todos', JSON.stringify(newToDos));
  };
  loadTodos = async () => {
    try {
      const getTodos = await AsyncStorage.getItem('todos');
      const parsedTodos = JSON.parse(getTodos);
      this.setState({ dataIsReady: true, todos: parsedTodos || {} });
    } catch (err) {
      console.log(err);
    }
  };
  render() {
    const { newTodoItem, dataIsReady, todos } = this.state;
    if (!dataIsReady) {
      return <Text>Loading...</Text>;
    }
    return (
      <LinearGradient style={styles.container} colors={['#42d9f4', '#1c266b']}>
      <StatusBar barStyle="light-content" />
        <TextInput
          style={styles.input}
          placeholder={'Add an item!'}
          value={this.state.newTodoItem}
          onChangeText={(newTodoItem)=> this.setState({newTodoItem})}
          placeholderTextColor={'#999'}
          onSubmitEditing={this.addTodo}
          autoCorrect={false}
        />
        <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.listContainer}>
          {Object.values(todos).map(todo =><TodoList
                key={todo.id}
                {...todo}
                deleteTodo={this.deleteTodo}
                inCompleteTodo={this.inCompleteTodo}
                completeTodo={this.completeTodo}
                updateTodo={this.updateTodo} // add this
              />)}
        </ScrollView>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f23657'  
  },
  appTitle: {
    color: '#fff',
    fontSize: 30,
    marginTop: 20,
    marginBottom: 30,
    fontWeight: '300'
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    width: width - 25,
    margin:50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 10
      }
    })
  },
  input: {
    padding: 20,
    color: '#ffff',
    borderBottomColor: '#ffff',
    borderBottomWidth: 2,
    fontSize: 20
  },
  listContainer: {
    alignItems: 'center',
  }
});
