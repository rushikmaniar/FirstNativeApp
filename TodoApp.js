/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Button,
    Text,
    FlatList,
    CheckBox,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import uuidv1 from 'uuid/v1';
import Swipeable from 'react-native-swipeable';

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        const itemList = [
            {id: uuidv1(), 'name': 'rushik', 'isCompleted': false},
            {id: uuidv1(), 'name': 'karan', 'isCompleted': false},
            {id: uuidv1(), 'name': 'abhi', 'isCompleted': false}
        ];
        super(props);
        this.state = {
            name: '',
            todos: itemList
        };
    }


    handleOnChange = (value) => {
        this.setState({name: value})
    };

    handleOnAdd = () => {
        this.addTodo();
    };


    /*adds new Todoinlist */
    addTodo() {
        this.setState((state) => {
            return {
                todos: [{id: uuidv1(), name: this.state.name}, ...state.todos],
                name: ''
            }
        });
    }

    handleOnDelete(todo) {
        this.delete(todo)
    }

    handleOnEdit(todo) {
        this.edit(todo)
    }


    delete(todo) {
        this.setState({
            todos: this.state.todos.filter(todos => todos.id !== todo.id)
        });
    };


    edit(todo) {
        this.setState((state) => {
            return {
                todos: state.todos.map((item) => {
                    return item.id === todo.id ? todo : item
                })
            }
        });
    };

    render() {
        const styles = StyleSheet.create({
            app: {
                flex: 1,
                justifyContent: "center",
            },
            container: {
                paddingTop: 60,
                alignItems: 'center'
            },
            button: {
                marginBottom: 30,
                width: 260,
                alignItems: 'center',
                backgroundColor: '#2196F3'
            },
            buttonText: {
                padding: 20,
                color: 'white'
            }
        });

        const {todos} = this.state;

        return (
            <View style={styles.app}>
                <Text style={{fontSize: 30}}>TodoApp React Native</Text>
                <TextInput
                    value={this.state.name}
                    style={{height: 100, fontSize: 30}}
                    placeholder="Enter Item"
                    onChangeText={this.handleOnChange}
                />
                <Button title="add" onPress={this.handleOnAdd} style={{fontSize: 20}} color="blue"/>

                <FlatList
                    data={todos}
                    keyExtractor={(todo) => 'todo_' + todo.id}
                    renderItem={(todo) =>
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onEdit={(todo) => this.handleOnEdit(todo)}
                            onDelete={(todo) => this.handleOnDelete(todo)}>
                        </TodoItem>
                    }
                />

            </View>
        );


    }
}

class TodoItem extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            displayButtonFlag: false,
            todo: this.props.todo.item,
            newname: this.props.todo.item.name
        };
    }


    edit() {
        const todo = {...this.props.todo.item, name: this.state.newname};
        this.props.onEdit(todo);
        this.setState({displayButtonFlag: false});
    }

    handelCompleted = (value) => {
        console.log(value);
        const todo = {
            ...this.props.todo.item,
            name: this.state.newname,
            isCompleted: !this.state.todo.isCompleted
        };
        this.props.onEdit(todo);
        this.setState({todo: todo});
    };

    handleOnEdit = (event) => {
        this.setState({displayButtonFlag: true})
    };

    handleOnCancel = () => {
        this.setState({displayButtonFlag: false})
    };

    handleOnDelete(todo) {
        this.props.onDelete(todo);
    };

    handleOnChange = (value) => {
        this.setState({newname: value});
    };

    handleOnSave = () => {
        this.edit();
    };

    renderEditDelete() {
        const {todo} = this.state;
        const {name} = this.props.todo.item;

        const visibleContent = (isCompleted) => {
            return (
                (isCompleted) ?
                    <Text style={strike}>{name}</Text>
                    : <Text style={{fontSize: 30, flex: 3}}>{name}</Text>
            )
        };
        const {isCompleted} = this.state.todo;
        const strike = {textDecorationLine: 'line-through', textDecorationStyle: 'solid', flex: 3, fontSize: 30};
        const style = {
            rightSwipeItem: {
                flex: 1,
                justifyContent: 'center',
                paddingLeft: 40,
                flexDirection: 'row'
            },
            btnFont: {
                fontSize: 30, color: 'white'
            }
        };

        return (
            <View>
                <Swipeable
                    onDelete={(todo) => {
                        this.handleOnDelete(todo)
                    }}
                    rightButtonWidth={150}
                    rightButtons={[
                        <TouchableOpacity style={[style.rightSwipeItem]} onPress={this.handleOnEdit}>
                            <View style={{flex: 2, justifyContent: 'center', backgroundColor: 'green'}}>
                                <Text style={style.btnFont}>Edit</Text>
                            </View>
                        </TouchableOpacity>,
                        <TouchableOpacity style={[style.rightSwipeItem]} onPress={() => this.props.onDelete(todo)}>
                            <View style={{flex: 2, backgroundColor: 'red', justifyContent: 'center'}}>
                                <Text style={style.btnFont}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    ]}
                >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <CheckBox value={isCompleted} onChange={this.handelCompleted}/>
                        {visibleContent(isCompleted)}
                    </View>
                </Swipeable>
            </View>
        )
    }


    renderSaveCancel() {
        return (
            <View key={this.props.id} style={{flex: 1, flexDirection: 'row'}}>
                <TextInput
                    value={this.state.todo.name}
                    style={{fontSize: 20, flex: 1}}
                    placeholder="Edit Item"
                    onChangeText={this.handleOnChange}/>
                <Button color='green' style={{flex: 1}} title="Save" onPress={this.handleOnSave}/>
                <Button color='red' style={{flex: 1}} title="Cancel" onPress={this.handleOnCancel}/>
            </View>
        )
    }

    render() {
        return this.state.displayButtonFlag ? this.renderSaveCancel() : this.renderEditDelete()
    }
}
