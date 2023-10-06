import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import Icon from '../../component/Icon';
import Text from '../../component/Text';
import { useTranslation } from 'react-i18next';
import { usePreferenceStore } from '../../state/preferences';
import { darkTheme, lightTheme } from '../../theme/color';
import theme from '../../theme';
import Button from '../../component/Button';
import { getDigit, parseFormatedNumberInput } from '../../util/string';
import { useTransactionStore } from '../../state/transaction';
import { useTokenBalance } from '../../hook/useTokenBalance';
import { useWallet } from '../../hook/useWallet';
import { SvgUri } from 'react-native-svg';

const AmountStep = ({onNextStep, onBack}: {
  onNextStep: () => void;
  onBack: () => void;
}) => {
  const {darkMode} = usePreferenceStore()
  const preferenceTheme = darkMode ? darkTheme : lightTheme
  const {t} = useTranslation<string>()

  const {setAmount, tokenMeta, amount} = useTransactionStore()
  const {wallet} = useWallet()
  const {balance, loading: loadingBalance} = useTokenBalance(wallet.address, tokenMeta.address)

  const [internalAmount, setInternalAmount] = useState(amount)

  const handleContinue = () => {
    // TODO: valudate amount
    setAmount(getDigit(internalAmount))
    onNextStep()
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack}>
          <Icon name="arrow-left" width={24} height={24} />
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.headerText}>{t('setAmountForTransaction')}</Text>
        </View>
        <View />
      </View>

      <View style={styles.bodyContainer}>
        <View style={{paddingVertical: 16, marginTop: 36, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
          <TextInput
            onChangeText={(val) => {
              setInternalAmount(parseFormatedNumberInput(val))
            }}
            value={internalAmount}
            keyboardType="numeric"
            style={[
              theme.typography.largeTitle.medium,
              {
                marginRight: 4,
                color: preferenceTheme.text.title
              }
            ]}
          />
          <Text style={theme.typography.largeTitle.medium}>{tokenMeta.symbol}</Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 14,
              padding: 8,
              borderRadius: 8,
              backgroundColor: preferenceTheme.background.surface,
              alignItems: 'center',
            }}
          >
            <View style={{width: 28, height: 28}}>
              <SvgUri
                uri={tokenMeta.logo}
                width="100%"
                height="100%"
              />
            </View>
            <View style={{flex: 1, paddingHorizontal: 11}}>
              <Text style={[theme.typography.caption2.regular, {color: preferenceTheme.text.primary}]}>Balance</Text>
              <Text style={theme.typography.footnote.regular}>{balance} {tokenMeta.symbol}</Text>
            </View>
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: preferenceTheme.outline
              }}
              onPress={() => {
                setInternalAmount(parseFormatedNumberInput(balance))
              }}
            >
              <Text
                style={[
                  theme.typography.caption1.medium,
                  {
                    color: theme.color.neutral[500]
                  }
                ]}
              >
                Max
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            style={{borderRadius: 60}}
            textStyle={theme.typography.label.medium}
            onPress={handleContinue}
          >
            Continue
          </Button>
        </View>
      </View>
    </View>
  )
};

export default AmountStep;
