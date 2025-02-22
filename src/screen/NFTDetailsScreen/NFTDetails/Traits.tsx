import { View } from 'react-native';
import Text from '../../../component/Text';
import { styles } from '../styles';
import { usePreferenceStore } from '../../../state/preferences';
import { color, darkTheme, lightTheme } from '../../../theme/color';

const NFTTraits = ({metadata}: {
  metadata: Record<string, any>
}) => {
  const { darkMode } = usePreferenceStore();
  const preferenceTheme = darkMode ? darkTheme : lightTheme;

  // const traits = [
  //   { name: 'Trait 1', rarity: 'Rare' },
  //   { name: 'Trait 2', rarity: 'Rare' },
  //   { name: 'Trait 3', rarity: 'Rare' },
  //   { name: 'Trait 4', rarity: 'Rare' },
  //   { name: 'Trait 5', rarity: 'Rare' },
  //   { name: 'Trait 6', rarity: 'Rare' },
  //   { name: 'Trait 7', rarity: 'Rare' },
  //   { name: 'Trait 8', rarity: 'Rare' },
  //   { name: 'Trait 9', rarity: 'Rare' },
  //   { name: 'Trait 10', rarity: 'Rare' },
  // ];

  const traits = metadata.attributes

  return (
    <View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 0.07,
          marginBottom: 8,
        }}>
        Properties
      </Text>

      <View style={{ gap: 12 }}>
        {traits.map((trait: any) => (
          <View key={trait.trait_type} style={styles.row}>
            <Text
              style={{
                color: preferenceTheme.text.primary,
                fontSize: 11,
                letterSpacing: 0.07,
              }}>
              {trait.trait_type}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '500' }}>
                {trait.value}
              </Text>

              {/* <View style={{ height: 16, width: 1, backgroundColor: color.neutral[500] }}/>

              <Text style={{ color: preferenceTheme.text.primary, fontSize: 12, fontWeight: '500' }}>
                {trait.progress} %
              </Text> */}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default NFTTraits;
