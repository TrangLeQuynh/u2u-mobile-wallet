import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Text from '../../../component/Text';
import theme from '../../../theme';
import Separator from '../../../component/Separator';
import Icon from '../../../component/Icon';
import { usePreference } from '../../../hook/usePreference';

const LegalModal = ({trigger}: {
  trigger: () => JSX.Element,
}) => {
  const {preferenceTheme} = usePreference()

  const { t } = useTranslation<string>()

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['35%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={handlePresentModalPress}
      >
        {trigger()}
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: preferenceTheme.background.background,
        }}
        handleStyle={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
        }}
        handleIndicatorStyle={{
          backgroundColor: '#F6F6F6'
        }}
        backdropComponent={({ style }) => {
          return (
            <View
              style={[
                style,
                {
                  backgroundColor: '#181818',
                  opacity: 0.9,
                }
              ]}
              onTouchEnd={handleClose}
            />
          )
        }}
      >
        <View style={[
          styles.contentContainer,
        ]}>
          <Text style={[
            theme.typography.headline.medium,
            {
              color: preferenceTheme.text.title,
              marginVertical: 8,
            }
          ]}>
            {t('legal')}
          </Text>
          <Separator style={{width: '100%'}} />
          <TouchableOpacity style={[styles.settingItem]}>
            <Text style={[theme.typography.footnote.medium, {flex: 1}]}>{t('privacyPolicy')}</Text>
            <Icon
              name='chevron-right'
              width={18}
              height={18}
              color={preferenceTheme.text.disabled}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={[theme.typography.footnote.medium, {flex: 1}]}>{t('termsOfService')}</Text>
            <Icon
              name='chevron-right'
              width={18}
              height={18}
              color={preferenceTheme.text.disabled}
            />
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </>
  )
}

export default LegalModal;