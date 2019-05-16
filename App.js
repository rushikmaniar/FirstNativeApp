/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import { Button, ThemeProvider,Text,Avatar } from 'react-native-elements';
import {TodoApp} from "./TodoApp";



type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <ThemeProvider>
                <TodoApp/>
            </ThemeProvider>
        );
    }

}
