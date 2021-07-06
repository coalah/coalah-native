import React from 'react'
import {View, Text} from 'react-native'
import ReactNativeModal from 'react-native-modal';
import FullButton from './FullButton';

type NoParamsFunction = {
    () : any
};
interface ThemeProps{
    cancelBackground : string
    cancelTextColor : string
    okBackground : string
    okTextColor : string
}
interface StringsProps{
    CANCEL : string
    CONFIRM : string
    OK : string
}

export interface PopUpProps{
    id? : string;
    type : "confirm" | "message";
    title : string;
    body : string;
    cancelText? : string;
    okText? : string;
    onConfirm? : NoParamsFunction;
    onCancel? : NoParamsFunction;
    theme? : ThemeProps;
    strings? : StringsProps;
}

export default function PopUp(params : PopUpProps){
    const {
        id,
        type,
        title,
        body,
        cancelText = "CANCEL",
        okText = "OK",
        onConfirm = () => {},
        onCancel = () => {},
        theme = {
            cancelBackground: "#E4E4E4",
            cancelTextColor: "#DB5A35",
            okBackground: "#00BFA6",
            okTextColor: "#FFFFFF"
        },
        strings = {
            CANCEL: "CANCELAR",
            CONFIRM: "CONFIRMAR",
            OK: "OK",
        }
    } = params

    return <ReactNativeModal
        isVisible={!!id}
        onBackButtonPress={onCancel}
        onBackdropPress={onCancel}
    >
        <View style={{backgroundColor: 'white', borderRadius: 10}}>
            <View style={{padding: 30}}>
                <Text style={{padding: 10, color: "black", fontWeight: 'bold', fontSize: 22}}>{title}</Text>
                <Text style={{padding: 10, color: "#8a8a8a", fontSize: 16}}>{body}</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
                {type === 'confirm' && <View style={{flex: 1}}>
                    <FullButton 
                        style={{
                            borderBottomLeftRadius: 10, 
                            borderBottomRightRadius: type === 'confirm' ? 0 : 10,
                        }}
                        backgroundColor={theme.cancelBackground}
                        color={theme.cancelTextColor}
                        title={cancelText || strings.CANCEL}
                        onPress={onCancel}
                    />
                </View>}
                <View style={{flex: 1}}>
                    <FullButton 
                        style={{
                            borderBottomLeftRadius: type === 'confirm' ? 0 : 10, 
                            borderBottomRightRadius: 10,
                        }}
                        backgroundColor={theme.okBackground}
                        color={theme.okTextColor}
                        title={okText || (type === 'confirm' ? strings.CONFIRM : strings.OK)}
                        onPress={onConfirm}
                    />
                </View>
            </View>
        </View>
    </ReactNativeModal>
}
