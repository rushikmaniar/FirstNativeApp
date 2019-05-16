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
import {Text, Input, CheckBox, Button} from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import BottomNavigation, {FullTab} from 'react-native-material-bottom-navigation'


type Props = {};

export class TodoApp extends Component<Props> {

    constructor(props) {

        super(props);
        this.state = {
            name: '',
            todos: [],
            visibleTodos: [],
            visibleMode: 'All',
            isLoading: true
        };

        this.retrieveTodos();
    }

    retrieveTodos() {
        this.getData('todos').then((response) => {
            if (response) {
                this.state.todos = JSON.parse(response);
                this.state.visibleTodos = JSON.parse(response);
            }
            return response;
        }).catch((error) => {
            return error;
        });
    }

    storeTodo() {
        const {todos} = this.state;
        this.storeData('todos', JSON.stringify(todos)).then((response) => {
            return response;
        }).catch((error) => {
            return error;
        })
    };

    getData = async (key) => {
        try {
            const value = await AsyncStorage.getItem('@' + key);
            if (value !== null) {
                // value previously stored
                return value;
            }
        } catch (e) {
            // error reading value
            return e;
        }
    };

    storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem('@' + key, value)
        } catch (e) {
            // saving error
            console.error(e);
        }
    };

    handleOnChange = (value) => {
        this.setState({name: value})
    };

    handleOnAdd = () => {
        this.addTodo();
    };

    addTodo() {
        this.setState((state) => {
            return {
                todos: [{id: uuidv1(), name: this.state.name, isCompleted: false}, ...state.todos],
                name: ''
            }
        }, () => {
            this.storeTodo();
        });

    }

    handleOnDelete(todo) {
        this.delete(todo);
    }

    handleOnEdit(todo) {
        this.edit(todo);
    }


    delete(todo) {
        this.setState({
            todos: this.state.todos.filter(todos => todos.id !== todo.id)
        }, () => {
            this.storeTodo();
        });
    };


    edit(todo) {
        this.setState((state) => {
            return {
                todos: state.todos.map((item) => {
                    return item.id === todo.id ? todo : item
                })
            }
        }, () => {
            this.storeTodo();
        });
    };

    getFilteredTodos = () => {
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

    renderIcon = icon => ({ isActive }) => (
        <FeatherIcon size={30} color="white" name={icon} />
    );

    renderTab = ({ tab, isActive }) => (
        <FullTab
            isActive={isActive}
            key={tab.key}
            label={tab.label}
            renderIcon={this.renderIcon(tab.icon)}
        />
    );
     tabs = [
        {
            key: 'All',
            icon: 'list',
            label: 'All',
            barColor: '#8b9bff',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'Active',
            icon: 'trending-up',
            label: 'Pending',
            barColor: '#fad71f',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
            key: 'Completed',
            icon: 'check-circle',
            label: 'Completed',
            barColor: '#388E3C',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
    ];

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

        if (this.state.isLoading) {
            return <SplashScreen toggleIsLoading={(flag) => {
                this.setState({isLoading: flag})
            }}/>;
        }


        return (
            <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
                <View style={{flex: 1}}>
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
                            data={this.getFilteredTodos()}
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

                <BottomNavigation
                    onTabPress={newTab => this.setState({ visibleMode: newTab.key })}
                    renderTab={this.renderTab}
                    tabs={this.tabs}
                />

                {/*<View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: '#8b9bff',
                    bottom: 0
                }}>

                    <View style={{flex: 1}}>
                        <FeatherIcon
                            name='list'
                            size={30}
                            color='white'
                            onPress={this.handleOnAllPress}
                        /><Text style={{fontSize: 30, color: 'white'}}>All</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <FeatherIcon
                            name='circle'
                            size={30}
                            color='white'
                            onPress={this.handleOnActivePress}
                        />
                        <Text style={{fontSize: 30, color: 'white'}}>Active</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <MaterialIcons
                            name='done-all'
                            size={30}
                            color='white'
                            onPress={this.handleOnCompleted}
                        />
                        <Text style={{fontSize: 30, color: 'white'}}>completed</Text>
                    </View>
                </View>*/}
            </View>
        );
    }

    handleOnAllPress = () => this.setState({visibleMode: 'All'});
    handleOnActivePress = () => this.setState({visibleMode: 'Pending'});
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
                fontFamily: 'Lato',
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
                            <AntIcon
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
                        <AntIcon
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
                        <AntIcon
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
        return this.state.displayButtonFlag ? this.renderSaveCancel() : this.renderEditDelete();
    }
}

class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.toggleIsLoading(false);
        }, 2000)
    }

    render() {
        const viewStyles = {flex: 1, backgroundColor: '#8b9bff', justifyContent: 'center', alignItems: 'center'};
        const textStyles = {
            color: 'white',
            fontSize: 40,
            fontWeight: 'bold'
        };

        return (
            <View style={viewStyles}>
                <Text style={textStyles}>
                    My TodoApp
                </Text>
            </View>
        );
    }
}
