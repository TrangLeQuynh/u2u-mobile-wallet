import React, { useMemo, useState } from 'react'
import { styles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import Text from '../../../component/Text';
import theme from '../../../theme';
import { formatNumberString, shortenAddress } from '../../../util/string';
import { usePreferenceStore } from '../../../state/preferences';
import { darkTheme, lightTheme } from '../../../theme/color';
import Button from '../../../component/Button';
import { Validation } from '../../../service/staking';
import { usePendingReward } from '../../../hook/usePendingReward';
import { useWallet } from '../../../hook/useWallet';
import { useStaking } from '../../../hook/useStaking';
import { useTranslation } from 'react-i18next';
import { useClaimRewards } from '../../../hook/useClaimRewards';
import Toast from 'react-native-toast-message';
import { useTransaction } from '../../../hook/useTransaction';
import UnstakeSection from './UnstakeSection';
import { useFetchLockedStake } from '../../../hook/useFetchLockedStake';
import BigNumber from 'bignumber.js';
import LockModal from './LockModal';

const DelegationItem = ({item}: {
  item: Validation
}) => {
  const {wallet} = useWallet()
  const {darkMode} = usePreferenceStore()
  const preferenceTheme = darkMode ? darkTheme : lightTheme

  const {t} = useTranslation<string>()

  const {stakingContractOptions} = useStaking()
  const { pendingRewards } = usePendingReward({delegatorAddress: wallet.address, stakingContractOptions, validatorId: Number(item.validator.valId)})
  const { claimRewards } = useClaimRewards(stakingContractOptions)
  const {resetTxState} = useTransaction()
  const { lockedStake } = useFetchLockedStake(wallet.address, Number(item.validator.valId))
  const { lockedAmount, endTime, isLockedUp, penalty } = lockedStake

  const [claiming, setClaiming] = useState(false)
  const [showUnstake, setShowUnstake] = useState(false)

  const actualStakedAmount = useMemo(() => {
    if (item.stakedAmount && !item.stakedAmount.isZero()) {
      let _amount = item.stakedAmount.minus(BigNumber(lockedAmount || 0))
      if (penalty) {
        _amount = _amount.minus(penalty)
      }
      return _amount
    }
    return BigNumber(0)
  }, [item, lockedAmount, penalty])

  const handleClaim = async () => {
    try {
      setClaiming(true)
      const tx = await claimRewards({toValidatorID: Number(item.validator.valId)})
      console.log(tx)
      setClaiming(false) 

      if (!tx) {
        return
      }

      setShowUnstake(false)
      Toast.show({
        type: 'success',
        text1: 'Claim rewards success',
        onHide: resetTxState,
        props: {
          txHash: tx.hash,
          renderTrailing: () => {
            return (
              <Text
                style={[
                  theme.typography.body.medium,
                  {
                    color: preferenceTheme.text.title
                  }
                ]}
              >
                {formatNumberString(
                  pendingRewards, 6
                )} U2U
              </Text>
            )
          }
        }
      })
    } catch (error) {
      setClaiming(false)
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Claim rewards fail',
        text2: (error as Error).message,
        onHide: resetTxState,
        props: {
          renderTrailing: () => {
            return (
              <Text
                style={[
                  theme.typography.body.medium,
                  {
                    color: preferenceTheme.text.title
                  }
                ]}
              >
                {formatNumberString(
                  pendingRewards, 6
                )} U2U
              </Text>
            )
          }
        }
      })
    }
  }

  const handleUnstake = async () => {
    setShowUnstake(true)
  }

  return (
    <View
      style={[
        styles.delegationItem,
        {
          borderColor: preferenceTheme.outline
        }
      ]}
      key={`delegation-${item.id}`}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: 34, height: 34, marginRight: 8}}>
          <SvgUri
            uri={"https://raw.githubusercontent.com/phongnhat19/explorer-assets/master/public_assets/token_logos/u2u.svg"}
            width="100%"
            height="100%"
          />
        </View>
        <View
          style={{flex: 1, justifyContent: 'space-between'}}
        >
          <Text
            style={[
              theme.typography.caption1.medium,
              {
                color: preferenceTheme.text.title
              }
            ]}
          >
            {item.validator.name}
          </Text>
          <Text
            style={[
              theme.typography.caption1.regular,
              {
                color: preferenceTheme.text.primary
              }
            ]}
          >
            {t('votingPower')}: {item.validator.votingPower ? formatNumberString((item.validator.votingPower / 10000).toString(), 3) : 0}%
            {/* {shortenAddress(item.validator.auth, 8, 8)} */}
          </Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <LockModal
            item={item}
            trigger={() => {
              return (
                <Text
                  style={[
                    theme.typography.body.bold,
                    {
                      textDecorationLine: 'underline'
                    }
                  ]}
                >
                  Lock
                </Text>
              )
            }}
          />
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12}}>
        <View>
          <Text
            style={[theme.typography.caption2.regular, {color: preferenceTheme.text.secondary}]}
          >
            {t('staked')}
          </Text>
          <Text
            style={[theme.typography.caption1.medium, {color: preferenceTheme.text.title}]}
          >
            {formatNumberString(
              actualStakedAmount.dividedBy(10 ** 18).toFixed()
            )} U2U
          </Text>
        </View>
        <View>
          <Text
            style={[theme.typography.caption2.regular, {color: preferenceTheme.text.secondary}]}
          >
            {t('pendingRewards')}
          </Text>
          <Text
            style={[theme.typography.caption1.medium, {color: preferenceTheme.text.title}]}
          >
            {formatNumberString(
              pendingRewards, 6
            )} U2U
          </Text>
        </View>
        <View>
          <Text
            style={[theme.typography.caption2.regular, {color: preferenceTheme.text.secondary}]}
          >
            APR
          </Text>
          <Text
            style={[theme.typography.caption1.medium, {color: preferenceTheme.text.title}]}
          >
            {formatNumberString(
              item.validator.apr.toString()
            )}%
          </Text>
        </View>
      </View>
      {showUnstake ? (
        <UnstakeSection
          item={item}
          onCancel={() => setShowUnstake(false)}
        />
      ) : (
        <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 12}}>
          <Button
            onPress={handleClaim}
            loading={claiming}
            disabled={claiming}
            color='primary'
            style={{
              borderRadius: 60,
              flex: 1,
              paddingVertical: 8
            }}
            textStyle={[
              theme.typography.label.medium,
              {
                color: preferenceTheme.text.title
              }
            ]}
          >
            Claim reward
          </Button>
          <Button
            onPress={handleUnstake}
            style={{
              borderRadius: 60,
              flex: 1,
              paddingVertical: 8,
              backgroundColor: preferenceTheme.background.surface
            }}
            textStyle={[
              theme.typography.label.medium,
              {
                color: preferenceTheme.text.disabled
              }
            ]}
          >
            Unstake
          </Button>
        </View>
      )}
    </View>
  )
}

export default DelegationItem;
