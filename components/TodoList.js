import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';
import PropTypes from 'prop-types'

const { height, width } = Dimensions.get('window');

class TodoList extends Component {
    constructor(props){
        super(props);
        this.state = {
            isEditing: false,
            isCompleted: false,
            todoValue: '',
            

        };
    }
    static propTypes = {
      textValue: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool.isRequired,
      deleteTodo: PropTypes.func.isRequired,
      id: PropTypes.string.isRequired,
      inCompleteTodo: PropTypes.func.isRequired,
      completeTodo: PropTypes.func.isRequired,
      updateTodo: PropTypes.func.isRequired,
    };

  toggleItem = () => {
      const { isCompleted, inCompleteTodo, completeTodo, id } = this.props;
      this.setState(prevState => {
        return{
          isCompleted: !prevState.isCompleted
        }
      })
      if (isCompleted) {
        inCompleteTodo(id);
      } else {
        completeTodo(id);
      }
    };
  startEditing = () => {
    const { textValue } = this.props;
    this.setState({
        isEditing: true,
        todoValue: textValue
    });
  }
 
  finishEditing = () => {
    const { todoValue } = this.state;
    const { id, updateTodo } = this.props;
    updateTodo(id, todoValue);
    this.setState({
      isEditing: false
    });
  };
	
  controlInput = textValue => {
    this.setState({ todoValue: textValue });
  };
  render() {
    const { isEditing, isCompleted, todoValue } = this.state;
    const { textValue, id, deleteTodo } = this.props;
    return (
         <View style={styles.container}>
        <View style={styles.rowContainer}>
        <TouchableOpacity onPress={this.toggleItem}>
        <View style={[styles.circle, isCompleted ? styles.completeCircle : styles.incompleteCircle]}>
        </View>
      </TouchableOpacity>
      {
            isEditing ? (
                <TextInput
                value={todoValue}
                style={[
                    styles.text,
                    styles.input,
                    isCompleted ? styles.strikeText : styles.unstrikeText
                ]}
                multiline={true}
                returnKeyType={'done'}
                onBlur={this.finishEditing}
                onChangeText={this.controlInput}
                />
            ) : (
                <Text
                style={[
                    styles.text,
                    isCompleted ? styles.strikeText : styles.unstrikeText
                ]}
                >
                {this.props.textValue}
                </Text>
            )
        }
        </View>
        {isEditing ? (
          <View style={styles.buttons}>
          <TouchableOpacity onPressOut={this.finishEditing}>
            <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>✅</Text>
            </View>
          </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttons}>
          <TouchableOpacity onPressOut={this.startEditing}>
            <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>✏</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPressOut={() => deleteTodo(id)}>
            <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>❌</Text>
            </View>
          </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 20
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    // remove borderColor property from here
    borderWidth: 3,
    marginRight: 20
  },
  completeCircle: {
    borderColor: '#bbb'
  },
  incompleteCircle: {
    borderColor: '#DA4453'
  },
  strikeText: {
    color: '#bbb',
    textDecorationLine: 'line-through'
  },
  unstrikeText: {
    color: "#29323c"
  },
  rowContainer: {
    flexDirection: 'row',
    width: width / 2,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttons: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input: {
    marginVertical: 15,
    width: width / 2,
    paddingBottom: 5
  }
});

export default TodoList;