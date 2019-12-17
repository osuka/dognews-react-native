import * as React from 'react'
import * as _ from 'lodash'
import {
  LayoutAnimation,
  Linking,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
  Image,
  Dimensions,
} from 'react-native'
import { Palette } from './Palette'
import { Rating } from './Rating'
// note: this needed `cp node_modules/react-native-vector-icons/Fonts/FontAwesome*.ttf android/app/src/main/assets/fonts/`
// and rm -rf android/app/build
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Item, ArticleControl, NewsItemRating } from '../services/articles'

// Layout animation is disabled by default
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

const extractDomain = (url: string) => {
  const regex = /.*\/\/([^/]*).*/
  const matches = regex.exec(url)
  if (!matches || matches.length <= 1) {
    return url
  }
  return matches[1]
}

export const NewsItem_Height = 60

const layoutAnimationAppear = LayoutAnimation.create(60, 'easeIn', 'opacity')

// This is a functional component - combined with useState it bypasses the need to use 'this' completely
// while still allowing type safety at compile time
export function Article({
  item,
  positionInList,
  totalItems,
  onArticleClick,
}: {
  item: Item
  positionInList: number
  totalItems: number,
  onArticleClick: (Item) => boolean,
}) {
  const articles = ArticleControl()
  const [collapsed, setCollapsed] = React.useState(true)

  const toggleCollapsed = () => {
    LayoutAnimation.configureNext(layoutAnimationAppear)
    setCollapsed(!collapsed)
  }

  const layoutAnimationDisappear = LayoutAnimation.create(
    60,
    'easeOut',
    'opacity',
  )
  const toggleRemoved = () => {
    // const someoneRemovedIt = !!_.find(item.ratings, (r: NewsItemRating) => r.rating < 0);
    const currentUserRemovedIt = articles.getItemUserRating(item) < 0
    if (currentUserRemovedIt) {
      articles.rateItem(item, 0)
    } else {
      articles.rateItem(item, -1)
    }
    LayoutAnimation.configureNext(layoutAnimationDisappear)
  }

  const domain = extractDomain(item.url)
  const positionText = `${positionInList + 1}/${totalItems}`

  // Icons: https://github.com/oblador/react-native-vector-icons#icon-component
  //https://fontawesome.com/v4.7.0/icons/
  // Guide: https://github.com/oblador/react-native-vector-icons/blob/master/FONTAWESOME5.md

  const rating = articles.getItemUserRating(item)

  const { width, height } = Dimensions.get('window')
  const IMAGE_SMALL_WIDTH = width * 0.14
  const IMAGE_WIDTH = width * 0.82

  // Guideline sizes are based on standard ~5" screen mobile device
  // https://blog.solutotlv.com/size-matters/
  const guidelineBaseWidth = 350
  const guidelineBaseHeight = 680

  const scale = (size: number) => (width / guidelineBaseWidth) * size
  // const verticalScale = (size: number) => height / guidelineBaseHeight * size;
  const moderateScale = (size: number, factor = 0.5) =>
    size + (scale(size) - size) * factor

  const normalFontSize = 14
  const smallFontSize = moderateScale(normalFontSize, -0.6)

  const articleComponent = () => (
    <TouchableWithoutFeedback
      key={item.id}
      delayPressIn={0}
      delayPressOut={0}
      style={{ backgroundColor: Palette.mainBackground }}
      onPress={toggleCollapsed}
    >
      <View style={{ flexDirection: 'column', padding: 2 }}>
        <View style={{ flexDirection: 'row', padding: 2 }}>
          {rating >= 0 && item.thumbnail && (
            <TouchableOpacity
              onPress={() => item.image && Linking.openURL(item.image)}
            >
              <Image
                style={{ width: IMAGE_SMALL_WIDTH, height: IMAGE_SMALL_WIDTH }}
                source={{
                  uri:
                    'https://gatillos.com/onlydognews-assets/' + item.thumbnail,
                }}
              />
            </TouchableOpacity>
          )}
          <Text
            style={{
              color:
                rating < 0
                  ? Palette.disabledForeground
                  : Palette.headingForeground,
              padding: 6,
              flex: 1,
              fontSize: rating < 0 ? smallFontSize : normalFontSize,
            }}
          >
            {item.title}
          </Text>
          <Icon.Button
            iconStyle={{
              marginRight: 0,
              fontSize: rating < 0 ? smallFontSize : normalFontSize,
            }}
            name={rating < 0 ? 'poo' : 'trash'}
            color={
              rating < 0
                ? Palette.disabledForeground
                : Palette.headingForeground
            }
            backgroundColor="transparent"
            onPress={toggleRemoved}
          />
        </View>

        {rating >= 0 && (
          <View style={{ flexDirection: 'row', padding: 2 }}>
            {!collapsed && (
              <View style={{ flexDirection: 'column', padding: 4 }}>
                {item.thumbnail && (
                  <View style={{ flex: 1 }}>
                    <Image
                      style={{ width: IMAGE_WIDTH, height: IMAGE_WIDTH }}
                      source={{
                        uri:
                          'https://gatillos.com/onlydognews-assets/' +
                          item.thumbnail,
                      }}
                    />
                  </View>
                )}
                <Text
                  style={{
                    textAlign: 'left',
                    padding: 6,
                    color: Palette.mainForeground,
                  }}
                >
                  {item.summary}
                </Text>
              </View>
            )}
          </View>
        )}

        {rating >= 0 && (
          <View style={{ flexDirection: 'row', padding: 2 }}>
            <TouchableOpacity style={{ flex: 1 }} onPress={(item) => {
              onArticleClick(item);
            }}>
              <Text
                style={{
                  color: Palette.mainForeground,
                  padding: 6,
                  textAlignVertical: 'bottom',
                }}
              >
                {positionText}
                <Text style={{ fontSize: 12 }}>
                  {'\n'}
                  {domain}
                </Text>
              </Text>
            </TouchableOpacity>

            <Rating rating={rating} onPress={() => articles.rateItem(item)} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )

  // the UI only allows (at the moment) to modify ratings
  const flatRatings = _.flatMapDeep(item.ratings).join(',') // not sure if arrays are compared as values
  return React.useMemo(articleComponent, [item.id, flatRatings, collapsed])
}
