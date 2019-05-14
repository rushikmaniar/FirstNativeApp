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
    ScrollView,
    TouchableHighlight
} from 'react-native';
import uuidv1 from 'uuid/v1';
import Swipeable from 'react-native-swipeable';
import {Text, Input, CheckBox, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';


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

        const Line = props => (
            <View
                style={{
                    borderBottomColor: '#d9d9d9',
                    borderBottomWidth: 0.5,
                }}
            />
        );

        return (
            <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
                <View>
                    <TextInput
                        onSubmitEditing={this.handleOnAdd}
                        value={this.state.name}
                        style={{height: 60, fontSize: 30, backgroundColor: '#FEFEFE'}}
                        placeholder="Enter Item"
                        onChangeText={this.handleOnChange}
                    />
                    <View
                        style={{
                            borderBottomColor: '#d9d9d9',
                            borderBottomWidth: 1.5,
                        }}
                    />
                    <ScrollView>
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
                                    <Line/>
                                </View>
                            }
                        />
                    </ScrollView>

                </View>

                <View style={{position: 'absolute', bottom: 0, flexDirection: 'row', justifyContent: 'space-between',backgroundColor:'#8b9bff'}}>
                    <Button
                        containerStyle={{paddingLeft: 0}}
                        type='outline' titleStyle={{color:'white',fontSize: 30}} title='All'
                        onPress={this.handleOnAllPress}/>
                    <Button
                        containerStyle={{paddingLeft:60}}
                        type='outline' titleStyle={{color:'white',fontSize: 30}} title='Active' color='green'
                        onPress={this.handleOnActivePress}/>
                    <Button
                        containerStyle={{paddingLeft: 60}}
                        type='outline' titleStyle={{color:'white',fontSize: 30}} title='Completed'
                        onPress={this.handleOnCompleted}/>
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
            newName: this.props.todo.item.name
        };
    }


    edit() {
        const todo = {...this.props.todo.item, name: this.state.newName};
        this.props.onEdit(todo);
        this.setState({displayButtonFlag: false});
    }

    handelCompleted = (value) => {
        const todo = {
            ...this.props.todo.item,
            name: this.state.newName,
            isCompleted: !this.state.todo.isCompleted
        };
        this.props.onEdit(todo);
        this.setState({todo: todo});
    };

    handleOnEdit(todo) {
        this.setState({displayButtonFlag: true, newName: todo.name})
    };

    handleOnCancel = () => {
        this.setState({displayButtonFlag: false})
    };

    handleOnDelete(todo) {
        this.props.onDelete(todo);
    };

    handleOnChange = (value) => {
        this.setState({newName: value});
    };

    handleOnSave = () => {
        this.edit();
    };


    renderEditDelete() {

        const {todo} = this.state;
        const {name} = this.props.todo.item;
        const {isCompleted} = this.state.todo;


        const RenderCheckbox = (props) => {
            const checked = (
                <FeatherIcon
                    name='check-circle'
                    size={30}
                    color='black'
                />
            );
            const unChecked = (
                <FeatherIcon
                    name='circle'
                    size={30}
                    color='black'
                />
            );
            return (
                <View>
                    <CheckBox
                        {...props}
                        uncheckedIcon={unChecked}
                        checkedIcon={checked}
                        checked={isCompleted}
                        onPress={this.handelCompleted}/>
                </View>
            )
        };

        const style = {
            rightSwipeItem: {
                flex: 1,
                paddingLeft: 20,
                paddingRight: 20,
                height: 60,
                justifyContent: 'center'
            },
            btnFont: {
                fontSize: 30, color: 'white'
            },
            listStyle: {
                flexDirection: 'row',
                alignItems: 'center',
                height: 80
            },
            strike: {
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                fontSize: 30,
                color: '#f2f2f2'
            }

        };

        const VisibleContent = (props) => {
            const contentStyle = (props.isCompleted) ? style.strike : {fontSize: 30};
            return (
                <View style={style.listStyle}>
                    <RenderCheckbox/>
                    <TouchableHighlight onPress={() => this.handleOnEdit(todo)}>
                        <Text style={contentStyle}>{name}</Text>
                    </TouchableHighlight>
                </View>
            )
        };


        return (
            <View>
                <Swipeable
                    onDelete={(todo) => this.handleOnDelete(todo)}
                    rightButtonWidth={60}
                    rightButtons={[
                        <View style={[style.rightSwipeItem, {backgroundColor: '#ff8882'}]}>
                            <Icon
                                name='delete'
                                size={30}
                                color='white'
                                onPress={() => this.handleOnDelete(todo)}
                            />
                        </View>
                    ]}
                >
                    <VisibleContent isCompleted={isCompleted}/>

                </Swipeable>
            </View>
        )
    }


    renderSaveCancel() {
        return (
            <View key={this.props.id} style={{flex: 1, flexDirection: 'row'}}>
                <TextInput
                    value={this.state.newName}
                    style={{fontSize: 30, flex: 1}}
                    placeholder="Edit Item"
                    onChangeText={this.handleOnChange}/>
                <Button
                    type='outline'
                    icon={
                        <Icon
                            name='check'
                            size={40}
                            color='#84f992'
                            onPress={this.handleOnSave}
                        />
                    }
                />
                <Button
                    type='outline'
                    icon={
                        <Icon
                            name='close'
                            size={40}
                            color='#ff8882'
                            onPress={this.handleOnCancel}
                        />
                    }
                />
            </View>
        )
    }

    render() {
        return this.state.displayButtonFlag ? this.renderSaveCancel() : this.renderEditDelete()
    }
}
