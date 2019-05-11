import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

export class MyComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <Text>Mycomponent count:{this.props.count}</Text>
            </View>
        )
    }
}