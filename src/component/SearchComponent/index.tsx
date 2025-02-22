import React, {useState, useEffect} from 'react';
import {View, FlatList, BackHandler, TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from './styles';
import {useDebounce} from '../../hook/useDebounce';
import DappRow from '../../screen/U2UEcoDashboardScreen/FeatureTab/DappRow';
import TextInput from '../TextInput';
import Icon from '../Icon';
import { getPhonePaddingTop } from '../../util/platform';
import { usePreferenceStore } from '../../state/preferences';
import { darkTheme, lightTheme } from '../../theme/color';
import Text from '../Text';
import { useNetwork } from '../../hook/useNetwork';
import { useTranslation } from 'react-i18next';
// Define the types
type SearchResult = {
  // id: number;
  title: string;
};

type APIResponse = {
  results: SearchResult[];
};

// Debounce function
// const debounce = (func: Function, delay: number) => {
//   let inDebounce: NodeJS.Timeout;
//   return function (this: any, ...args: any[]) {
//     clearTimeout(inDebounce);
//     inDebounce = setTimeout(() => func.apply(this, args), delay);
//   };
// };

const SearchComponent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLayerVisible, setIsLayerVisible] = useState<boolean>(false);
  const [searching, setSearching] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const {networkConfig} = useNetwork()
  const { t } = useTranslation();

  const {darkMode} = usePreferenceStore()
  const preferenceTheme = darkMode ? darkTheme : lightTheme

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      const fetchResults = async () => {
        if (!networkConfig) return
        try {
          setSearching(true)
          console.log('networkConfig.dappURL', networkConfig.dappURL)
          const response = await fetch(
            networkConfig.dappURL,
          );
          const data: SearchResult[] = await response.json();
          setResults(data.filter((i) => i.title.includes(debouncedSearchQuery)));
          setSearching(false)
        } catch (error) {
          setSearching(false)
          console.error('Error fetching search results:', error);
        }
      };
      fetchResults();
    } else {
      setSearching(false)
      setResults([]); // Reset results if input is cleared
    }
  }, [debouncedSearchQuery, networkConfig]);

  useEffect(() => {
    // Handle the back button press
    const handleBackPress = () => {
      if (isLayerVisible) {
        setIsLayerVisible(false);
        return true; // This will prevent the default back behavior
      }
      return false; // Default behavior
    };

    // Add the listener when the component mounts
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Remove the listener when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [isLayerVisible]);
  //   const handleResetButtonPress = () => {
  //     setSearchQuery(''); // Reset the input field
  // };
  return (
    <>
      <TextInput
        containerStyle={{height: 48}}
        placeholder= {t('searchForDAppsOrEnterURL')}
        placeholderTextColor={'#363636'}
        onTouchStart={() => setIsLayerVisible(true)}
        onChangeText={text => setSearchQuery(text)}
        onBlur={() => setIsLayerVisible(false)}
        value={searchQuery}
        postIcon={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                setIsLayerVisible(false)
                setSearchQuery('')
              }}
            >
              <Icon name='close' width={24} height={24} />
            </TouchableOpacity>
          )
        }}
      />
      {isLayerVisible && (
        <View
          style={{
            position: 'absolute',
            paddingTop: 20,
            top: getPhonePaddingTop() + 28 + 48,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: preferenceTheme.background.background,
            zIndex: 99,
          }}>
          {searching ? (
            <ActivityIndicator />
          ) : (
            (results.length === 0 && searchQuery.length > 0) ? (
              <Text
                style={{
                  marginHorizontal: 16
                }}
              >
                No data
              </Text>
            ) : (
              <FlatList
                data={results}
                keyExtractor={item => item.title}
                renderItem={({item, index}) => (
                  <DappRow dappMeta={item} key={`dapp-${index}`} />
                )}
              />
            )
          )}
        </View>
      )}
    </>
  );
};

export default SearchComponent;
