import React, { ReactNode } from 'react'
import {View, Text, TouchableOpacity, ActivityIndicator, TouchableOpacityProps, TextProps, StyleProp, TextStyle, ViewStyle} from 'react-native'

interface NoParamsFunction{
    () : void
}
export interface FullButtonProps{
    onPress : NoParamsFunction
    disabled? : boolean
    style? : StyleProp<ViewStyle>
    loading? : boolean
    backgroundColor? : string
    leftIcon? : string
    size? : number
    color? : string
    textStyle? : StyleProp<TextStyle>
    title? : string
    children? : ReactNode
    textWeight? : "bold" | "light"
    theme? : ThemeProps
}   

interface ThemeProps{
    disabledContrast : string
    primaryContrast : string
    disabled : string
    primary : string
}

export default function FullButton(props : FullButtonProps){
    var {
        onPress, 
        disabled, 
        style, 
        loading = false,
        backgroundColor = null,
        leftIcon, 
        size = 16, 
        color, 
        title, 
        children,
        theme = {
            disabledContrast: "#CACACA",
            primaryContrast: "#CACACA",
            disabled: "#4a4a4a",
            primary: "#4a4aAA",
        }
    } = props
    const activeColor = color || (disabled ? theme.disabledContrast : theme.primaryContrast)
    disabled = disabled || loading

    return <View>
        <TouchableOpacity 
            disabled={Boolean(disabled)}
            onPress={onPress} 
            style={[{
                backgroundColor: backgroundColor || (disabled ? theme.disabled : theme.primary), 
                paddingVertical: 18,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            }, style]}
        >
            {
                (leftIcon || loading) &&
                <View>
                    {loading
                    ? <ActivityIndicator size="small" color={activeColor} /> 
                    : leftIcon}
                </View>
            }
            
            <Text 
                style={[{
                    color: activeColor,
                    paddingHorizontal: 20,
                    fontSize: size,
                    textAlign: 'center'
                }, style]}
            >{(title || children)}</Text>
        </TouchableOpacity>
    </View>
}