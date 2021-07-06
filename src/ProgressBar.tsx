import React from 'react'
import {View} from 'react-native'

interface ProgressBarProps{
    percentage : number
    color : string
}
export default function ProgressBar(props : ProgressBarProps){
    let [array, setArray] = React.useState([])

    React.useEffect(() => {
        let res = []
        for (let i = 0; i < 100; i++) {
            res.push(res.length)
        }
        setArray(res)
    }, [])

    return <View style={{flexDirection: 'row'}}>
        {
            array.map(index => 
                index > props.percentage
                ? <View key={`${index}`} style={{flex: 1, height: 8, backgroundColor: '#EFEFEF'}}></View>
                : <View key={`${index}`} style={{flex: 1, height: 8, backgroundColor: props.color || "#6a6a6a"}}></View>
            )
        }
    </View>
}