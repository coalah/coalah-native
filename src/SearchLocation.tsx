import React from 'react'
import qs from 'qs'
import { Text, ActivityIndicator, NativeSyntheticEvent, ScrollView, StyleProp, TextInput, TextInputFocusEventData, TouchableOpacity, View, ViewStyle } from "react-native";
import { Icon } from 'react-native-elements';
import Axios from 'axios';

interface Location{
    longitude : number;
    latitude : number;
    longitudeDelta? : number;
    latitudeDelta? : number;
    place_id : string;
    name : string;
    formatted_address : string;
    disponible? : boolean;
}

interface FocusFunction{
    (e : NativeSyntheticEvent<TextInputFocusEventData>) : void
}
interface SearchLocationResultProps{
    place_id: string
    title : string
    subtitle : string
}
interface OnErrorProps{

}
interface OnErrorFunction{
    (params : OnErrorProps) : void
}
interface Options{
    MAPS_API_KEY : string
    lang : string
}
interface StringsProps{
    SEARCH_LOCATION_PLACEHOLDER: string;
    NO_LOCATION_FOUND: string;
}
interface ThemeProps{
    background? : string
    textColor? : string
    backgroundTwo? : string
    searchLocationResultBackground? : string
    searchLocationResultTextColor? : string
}
interface SetLocationFunction{
    (value : Location) : void
}
interface SearchLocationProps{
    onFocusInput? : FocusFunction
    onBlurInput? : FocusFunction
    setLocation : SetLocationFunction
    location : Location
    style? : StyleProp<ViewStyle>
    placeholder? : string
    loading? : boolean
    country? : string
    onError : OnErrorFunction
    options : Options
    strings : StringsProps
    theme : ThemeProps
}
export default function SearchLocation(params : SearchLocationProps){
    const {
        onError, 
        options,
        strings = {
            SEARCH_LOCATION_PLACEHOLDER: "Buscar localização",
            NO_LOCATION_FOUND: "Nenhuma localização encontrada",
        }, 
        theme = {
            background: "#FAFAFA",
            backgroundTwo: "#FAFAFA",
            textColor: "#FAFAFA",
            searchLocationResultBackground: "#FAFAFA",
            searchLocationResultTextColor: "#4a4a4a",
        }
    } = params
    const {MAPS_API_KEY, lang = "PT"} = options
    
    const {onFocusInput, onBlurInput, setLocation, style, placeholder = strings.SEARCH_LOCATION_PLACEHOLDER} = params

    const [results, setResults] = React.useState({})
    const [loadingResults, setLoadingResults] = React.useState({})
    const [searchText, setSearchText] = React.useState<string>("")

    const searchInputRef = React.useRef<TextInput>()

    const handleSearch = () => {
        const keyword = searchText
        if(keyword.length > 0){
            setLoadingResults(lr => ({...lr, [keyword]: true}))
            
            let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?' + qs.stringify({
                input: searchText,
                key: MAPS_API_KEY,
                language: lang,
                components: params.country ? `country:${params.country}` : ''
            })
            console.log({url})
            
            Axios.get(url, {headers: {
                'Accept': 'application/json',
                "Content-Type": 'application/json',
            }})
            .then(res => {
                setLoadingResults(lr => ({...lr, [keyword]: false}))
                setResults(r => ({
                    ...r, 
                    [keyword]: res.data.predictions.map(item => ({
                        place_id: item.place_id,
                        title: item.structured_formatting.main_text,
                        subtitle: item.description,
                    }))
                }))
            })
            .catch(err => {
                console.log({err})
                onError && onError({type: 'message', error: `Falha ao buscar localização - ${err.message}`})
                setLoadingResults(lr => ({...lr, [keyword]: false}))
                setResults(r => ({...r, [keyword]: []}))
            })
        }
    }

    const chooseLocation = item => {
        const {place_id, latitude, longitude} = item;

        searchInputRef.current.blur && searchInputRef.current.blur()
        const url = place_id 
            ? 'https://maps.googleapis.com/maps/api/place/details/json?' + qs.stringify({
                key: MAPS_API_KEY,
                placeid: place_id,
                language: 'pt-BR',
            })
            : 'https://maps.googleapis.com/maps/api/geocode/json?' + qs.stringify({
                latlng: latitude + ',' + longitude,
                key: MAPS_API_KEY,
                language: 'pt-BR',
            })

        Axios.get(url, {headers: {"Content-Type": 'application/json'}})
        .then(res => {
            if(place_id){
                const data = res.data.result
                setLocation({
                    longitude: data.geometry.location.lng,
                    latitude: data.geometry.location.lat,
                    place_id: data.place_id,
                    name: data.name,
                    formatted_address: data.formatted_address,
                })
            }else{
                const data = res.data.results[0]
                if(data){
                    setLocation({
                        longitude: data.geometry.location.lng,
                        latitude: data.geometry.location.lat,
                        place_id: data.place_id,
                        name: data.address_components[0].long_name,
                        formatted_address: data.formatted_address,
                    })
                }
            }
        })
        .catch(err => {
            onError && onError({type: 'message', error: `Falha ao carregar localização - ${err.message}`})
        })
    }

    React.useEffect(handleSearch, [searchText])
    React.useEffect(() => {
        if(params.location) setSearchText(params.location.formatted_address);
    }, [params.location])

    return <View style={[{flex: 1, paddingHorizontal: 30, paddingTop: 30, backgroundColor: theme.background}, style]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: theme.textColor}}>
            <TextInput 
                value={searchText}
                placeholder={placeholder}
                style={{flex: 1, fontFamily: 'helveticaneue', color: theme.backgroundTwo, paddingVertical: 10, fontSize: 17}}
                onChangeText={text => setSearchText(text)}
                selectionColor={theme.backgroundTwo}
                placeholderTextColor={theme.textColor}
                returnKeyType="search"
                onFocus={onFocusInput}
                onBlur={onBlurInput}
                ref={searchInputRef}
            />
            <TouchableOpacity onPress={() => { setSearchText(""); searchInputRef.current.focus()}} style={{paddingVertical: 10, paddingLeft: 10}}>
                <Icon name="close" size={22} color={theme.textColor} />
            </TouchableOpacity>

        </View>
        <ScrollView 
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 20}}
            keyboardShouldPersistTaps="handled"
        >
            {
                loadingResults[searchText]
                ? <ActivityIndicator size="small" style={{padding: 10}} />
                : [
                    ...(results[searchText] || []),
                ].length === 0
                    ? <Text 
                        style={{padding: 20, textAlign: 'center', fontSize: 13, color: theme.textColor}} 
                    >{strings.NO_LOCATION_FOUND}</Text>
                    : null
            }
            {[
                ...(results[searchText] || []),
            ].map(result => 
                <TouchableOpacity 
                    key={`${result.place_id};${result.latitude};;${result.longitude}`}
                    style={{
                        marginBottom: 10, 
                        backgroundColor: theme.searchLocationResultBackground,
                        borderRadius: 10,
                        padding: 10,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    onPress={e => chooseLocation(result)}
                >
                    <View style={{flex: 1}}>
                        <Text style={{color: theme.searchLocationResultTextColor, fontSize: 15}}>{result.title}</Text>
                        <Text style={{color: theme.searchLocationResultTextColor, fontSize: 13}}>{result.subtitle}</Text>
                    </View>
                    <View style={{}}>
                        <Icon color={theme.searchLocationResultTextColor} name="keyboard-arrow-right" />
                    </View>
                </TouchableOpacity>
            )}
        </ScrollView>
    </View>
}