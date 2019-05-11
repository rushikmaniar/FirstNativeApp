/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import {COLORS, FONTS, RenderButton} from './styles/CustomTheme';

type Props = {};
const btnColor = COLORS.primary;
const btntitle = 'Button';
const btnwidth = 100;
const btnheight = 40;
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
    }


    render() {
        const viewStyle = {
            backgroundColor: COLORS.primary,
            width: 100,
            height: 40
        };

        const textStyle = {
            color: COLORS.light,
            backgroundColor: COLORS.primary,
            width: 100,
            height: 40,
            fontSize: FONTS.defaultSize,
            justifyContent: 'center',
            textAlign: 'center'
        };

        const btntitle = 'Button';
        return (
            <View styles={{flex: 1}}>

                <Text style={[FONTS.primary, FONTS.sm]}>Primary Text</Text>
                <Text style={[FONTS.warning, FONTS.md]}>Warning Text</Text>
                <Text style={[FONTS.danger, FONTS.lg]}>Danger Text</Text>

                <View>
                    <RenderButton btntitle='Button'>

                    </RenderButton>
                </View>

            </View>
        );
    }
}
