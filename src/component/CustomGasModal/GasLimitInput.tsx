import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native';
import { usePreferenceStore } from '../../state/preferences';
import { darkTheme, lightTheme } from '../../theme/color';
import styles from './styles';
import theme from '../../theme';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Text from '../Text';
import { useTransaction } from '../../hook/useTransaction';
import { getDigit, parseFormatedNumberInput } from '../../util/string';
import BigNumber from 'bignumber.js';

const GasLimitInput = () => {
  const {darkMode} = usePreferenceStore()
  const preferenceTheme = darkMode ? darkTheme : lightTheme

  const {gasLimit, setGasLimit} = useTransaction()
  const [focused, setFocused] = useState(false)

  const parsedGasLimit = useMemo(() => {
    return BigNumber(gasLimit).toFormat()
  }, [gasLimit])

  const [internalValue, setInternalValue] = useState(parsedGasLimit)

  useEffect(() => {
    const digit = getDigit(internalValue)
    setGasLimit(
      BigNumber(digit).toString()
    )
  }, [internalValue])

  return (
    <View style={{alignItems: 'flex-start', width: '100%'}}>
      <Text
        style={[
          theme.typography.footnote.regular,
          {
            marginBottom: 4,
            color: preferenceTheme.text.secondary
          }
        ]}
      >
        Gas limit
      </Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: preferenceTheme.background.surface,
            borderColor: focused ? theme.accentColor.primary.normal : '',
          },
        ]}
      >
        <BottomSheetTextInput
          style={[
            theme.typography.label.regular,
            {
              color: preferenceTheme.text.title,
              flex: 1
            },
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={(val) => {
            setInternalValue(parseFormatedNumberInput(val))
          }}
          keyboardType="numeric"
          value={internalValue}
        />
      </View>
    </View>
  )
}

export default GasLimitInput;
