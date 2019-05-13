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
    FlatList,
    ScrollView
} from 'react-native';
import uuidv1 from 'uuid/v1';
import Swipeable from 'react-native-swipeable';
import {Text, Input, CheckBox, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';


type Props = {};
export default class TodoApp extends Component<Props> {

    constructor(props) {
        const itemList = [
            {id: uuidv1(), 'name': 'rushik', 'isCompleted': false},
            {id: uuidv1(), 'name': 'karan', 'isCompleted': false},
            {id: uuidv1(), 'name': 'abhi', 'isCompleted': false}
        ];
        super(props);
        this.state = {
            name: '',
            todos: itemList,
            visibleTodos: itemList,
            visibleMode: 'All',
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
                todos: [{id: uuidv1(), name: this.state.name, isCompleted: false}, ...state.todos],
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

    getTodos = () => {
        const {visibleMode} = this.state;
        let todos;
        if (visibleMode === 'All')
            todos = this.state.todos;
        else if (visibleMode === 'Active') {
            todos = this.state.todos.filter((todo) => todo.isCompleted === false);
        } else
            todos = this.state.todos.filter((todo) => todo.isCompleted === true);

        return todos;
    };

    render() {
        const styles = StyleSheet.create({
            app: {
                justifyContent: "center"
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

        const line = (
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                }}
            />
        );
        return (
            <View>
                <View style={styles.app}>
                    <Input
                        onSubmitEditing={this.handleOnAdd}
                        value={this.state.name}
                        inputStyle={{height: 100, fontSize: 30}}
                        placeholder="Enter Item"
                        onChangeText={this.handleOnChange}
                    />
                    <ScrollView style={{height: 350}}>
                        <FlatList
                            data={this.getTodos()}
                            keyExtractor={(todo) => 'todo_' + todo.id}
                            renderItem={(todo) =>
                                <View>
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onEdit={(todo) => this.handleOnEdit(todo)}
                                        onDelete={(todo) => this.handleOnDelete(todo)}>
                                    </TodoItem>
                                    {line}
                                </View>
                            }
                        />
                    </ScrollView>

                </View>

                <View style={{flexDirection: 'row'}}>
                    <Button titleStyle={{fontSize: 30}} title='All' onPress={this.handleOnAllPress}/>
                    <Button titleStyle={{fontSize: 30}} title='Active' color='green'
                            onPress={this.handleOnActivePress}/>
                    <Button titleStyle={{fontSize: 30}} title='Completed' onPress={this.handleOnCompleted}/>
                </View>
            </View>
        );
    }

    handleOnAllPress = () => this.setState({visibleMode: 'All'});
    handleOnActivePress = () => this.setState({visibleMode: 'Active'});
    handleOnCompleted = () => this.setState({visibleMode: 'Completed'});


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
        const todo = {
            ...this.props.todo.item,
            name: this.state.newname,
            isCompleted: !this.state.todo.isCompleted
        };
        this.props.onEdit(todo);
        this.setState({todo: todo});
    };

    handleOnEdit = () => {
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
                alignItems: 'center',
                height: 60,
                width: 60,
                justifyContent: 'center'
            },
            btnFont: {
                fontSize: 30, color: 'white'
            }
        };

        return (
            <View>
                <Swipeable
                    onRightButtonsOpenRelease={()=>{console.log('onRightButtonsOpenRelease')}}
                    onDelete={(todo) => this.handleOnDelete(todo)}
                    rightButtonWidth={50}
                    rightButtons={[
                        <View style={[style.rightSwipeItem, {backgroundColor: 'green'}]}>
                            <Icon
                                name='edit'
                                size={30}
                                color='white'
                                onPress={this.handleOnEdit}
                            />
                        </View>
                        ,
                        <View style={[style.rightSwipeItem, {backgroundColor: 'red'}]}>
                            <Icon
                                name='delete'
                                size={30}
                                color='white'
                                onPress={() => this.handleOnDelete(todo)}
                            />
                        </View>
                    ]}
                >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <CheckBox checked={isCompleted} onPress={this.handelCompleted}/>
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
                    style={{fontSize: 30, flex: 1}}
                    placeholder="Edit Item"
                    onChangeText={this.handleOnChange}/>
                <Icon
                    name='check'
                    size={40}
                    color='green'
                    onPress={this.handleOnSave}
                />
                <Icon
                    name='close'
                    size={40}
                    color='red'
                    onPress={this.handleOnCancel}
                />
            </View>
        )
    }

    render() {
        return this.state.displayButtonFlag ? this.renderSaveCancel() : this.renderEditDelete()
    }
}
