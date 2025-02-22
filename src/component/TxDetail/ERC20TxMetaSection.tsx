import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { TransactionResponse } from 'ethers';
import Text from '../Text';
import theme from '../../theme';
import { usePreferenceStore } from '../../state/preferences';
import { darkTheme, lightTheme } from '../../theme/color';
import { decodeTxData, findABIFragment } from '../../util/contract';
import BigNumber from 'bignumber.js';
import { ERC20_ABI } from '../../util/abis/erc20';

const TRANSFER_INPUT_ABI = [
  {
    "internalType": "address",
    "name": "to",
    "type": "address"
  },
  {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }
]

const ERC20TxMetaSection = ({tokenMeta, txDetail}: {
  tokenMeta: Record<string, any>;
  txDetail: TransactionResponse
}) => {
  const {darkMode} = usePreferenceStore()
  const preferenceTheme = darkMode ? darkTheme : lightTheme

  // const [decodedParams, setDecodedParams] = useState<Record<string, any>>({})
  const [amount, setAmount] = useState("0")

  useEffect(() => {
    (async () => {
      if (!txDetail || !txDetail.data) return
      try {
        const fragment = findABIFragment("function", "transfer", ERC20_ABI)
        if (!fragment) return;
        const rs = decodeTxData(fragment.inputs as any, txDetail.data.toString())
        const _amount = (rs.amount as any).toString() || "0"

        setAmount(BigNumber(_amount as string).dividedBy(10 ** tokenMeta.decimals).toFormat())
      } catch (error) {
        console.log(error)
      }
    })()
  }, [txDetail])

  return (
    <View style={{flexDirection: 'row', padding: 16, alignItems: 'center'}}>
      <View style={{width: 28, height: 28}}>
        <SvgUri
          uri={tokenMeta.logo}
          width="100%"
          height="100%"
        />
      </View>
      <Text
          style={[
            theme.typography.title3.medium,
            {
              marginLeft: 6,
              color: preferenceTheme.text.title
            }
          ]}
      >
        -{' '}{amount} {tokenMeta.symbol}
      </Text>
    </View>
  )
}

export default ERC20TxMetaSection;
