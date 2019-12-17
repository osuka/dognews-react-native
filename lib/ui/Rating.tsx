import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Palette } from './Palette'
import * as React from 'react'

type RatingProps = {
  rating: number
  onPress: () => void
}

export const Rating = (props: RatingProps) => {
  const { rating, onPress } = props
  const isBadRating = rating < 0
  const isExcellent = rating > 1

  return React.useMemo(
    () => (
      <View>
        {isExcellent && <Text style={{ marginRight: 4 }}>{`+${rating}`}</Text>}
        <Icon.Button
          key={`rating-${rating}`}
          iconStyle={{ marginRight: 0 }}
          name={isBadRating ? 'poo' : 'heart'}
          solid={rating === 0}
          color={rating ? Palette.warningForeground : Palette.mainForeground}
          backgroundColor="transparent"
          onPress={onPress}
        />
      </View>
    ),
    [rating, onPress],
  )
}
