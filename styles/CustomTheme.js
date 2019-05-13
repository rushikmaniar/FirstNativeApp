import React from 'react';
import {Text, TouchableHighlight, View} from "react-native";

export const COLORS = {
    default: '#f4f9f5',
    primary: '#87efe9',
    success: '#5aef49',
    warning: '#fad71f',
    danger: '#ef6f53',
    light: '#FFFFFF',
    dark: '#000000',
};

export const PADDING = {
    sm: 10,
    md: 20,
    lg: 30,
    xl: 40
};

export const FONTS = {

    sm: {fontSize: 20},
    md: {fontSize: 25},
    lg: {fontSize: 30},

    primary: {color: COLORS.primary},
    success: {color: COLORS.success},
    warning: {color: COLORS.warning},
    danger: {color: COLORS.danger},

    fontFamily: 'Arial',
    defaultSize: 25
};

export class RenderButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {btntitle, ...props} = this.props;


        let textStyle = {
            backgroundColor: props.backgroundColor,
            width: props.width,
            height: props.height,
            color: props.color,
            fontSize: props.fontSize,
            justifyContent: props.justifyContent,
            textAlign: props.textAlign
        };



        return (
            <TouchableHighlight onPress={() => {
                console.log('ca')
            }} style={{width:textStyle.width,height:textStyle.height}}>
                <View>
                    <Text style={textStyle}>{btntitle}</Text>
                </View>
            </TouchableHighlight>
        )
    }
}

RenderButton.defaultProps = {
    color: COLORS.light,
    backgroundColor: COLORS.primary,
    width: 100,
    height: 40,
    fontSize: FONTS.defaultSize,
    justifyContent: 'center',
    textAlign: 'center'
};






