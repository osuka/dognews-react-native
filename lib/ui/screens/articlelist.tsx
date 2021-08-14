import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { extractDomain } from '../../services/extractDomain';
import { RootStackParamList } from '../Root';
import { Article } from '../../generated/api_client';
import { articlesApi } from '../../services/apiClient';

// @ts-ignore
// TODO: importing images from typescript gets a bit bonkers, better way?
const logo = require('../../../assets/onlydognews-logo-main.png');
const circularLoading = require('../../../assets/loading-circular-dots.png');

// Multiple components in this one file. TODO: refactor out when settled

// ============== generic card

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignContent: 'stretch',
    flexGrow: 1,
    flexDirection: 'column',
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    minWidth: 25,
    minHeight: 200,
    // backgroundColor: 'red',
    marginTop: 3,
    marginBottom: 3,
    marginStart: 3,
    marginEnd: 3,
  },
});

export const Card = (props: { children?: ReactNode }) => {
  return <View style={styles.card}>{props.children}</View>;
};

// =========== 'article card'

export const ArticleCard = ({ article }: { article: Article }) => {
  // we may have specific stack navigation props later on, not now
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const goToArticle = () => {
    navigation.push('ArticleDetail', {
      article: article,
    });
  };
  const date = moment(article.date_created).format('LL');
  return (
    <Card>
      <View style={articleCardStyles.imageContainer}>
        <Image
          source={{ uri: article.thumbnail }}
          style={articleCardStyles.image}
          loadingIndicatorSource={circularLoading}
        />
        <Text style={articleCardStyles.domain}>
          {article.target_url ? extractDomain(article.target_url) : ''}
        </Text>
      </View>
      <View style={articleCardStyles.contents}>
        <TouchableOpacity onPress={goToArticle}>
          <Text style={articleCardStyles.title}>{article.title}</Text>
          <Text style={articleCardStyles.text}>{article.description}</Text>

          <View style={articleCardStyles.footerContainer}>
            <View style={articleCardStyles.avatarContainer}>
              <Image
                source={{
                  // uri: `https://onlydognews.com/gfx/site/${article.submitter}-logo.png`,
                  uri: `https://onlydognews.com/gfx/site/markus-logo.png`,
                }}
                style={articleCardStyles.avatarImage}
              />
              <Text style={articleCardStyles.avatarName}>{date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const articleCardStyles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    // backgroundColor: 'green',
    marginTop: 4,
    marginBottom: 4,
    marginHorizontal: 8,
  },

  image: {
    flex: 1,
  },

  contents: {
    flex: 1,
    // backgroundColor: 'yellow',
  },

  title: {
    // backgroundColor: 'blue',
    color: 'black',
    padding: 2,
    fontWeight: 'bold',
    fontSize: 14,
  },

  text: {
    // backgroundColor: 'cyan',
    color: 'black',
    padding: 2,
    fontSize: 13,
  },

  domain: {
    // backgroundColor: 'cyan',
    color: 'black',
    padding: 2,
    alignSelf: 'center',
    fontSize: 10,
  },

  footerContainer: {
    flex: 1,
    // backgroundColor: 'brown',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 8,
  },

  avatarContainer: {
    flex: 1,
    // backgroundColor: 'brown',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  avatarImage: {
    width: 16,
    height: 16,
    marginHorizontal: 2,
  },

  avatarName: {
    color: 'black',
    fontSize: 10,
    marginHorizontal: 2,
    textAlignVertical: 'bottom',
    textAlign: 'right',
    flexGrow: 1,
    flex: 1,
  },
});

// ============= article list

const loadData = async (
  loading: boolean,
  setLoading: (value: boolean) => void,
  setArticles: (articles: Array<Article>) => void,
) => {
  try {
    if (loading) {
      return;
    }
    setLoading(true);
    const response = await articlesApi.articlesList(100);
    setArticles(response.data.results as Array<Article>);
  } finally {
    setLoading(false);
  }
};

export default function ArticleListScreen(): React.ReactElement {
  const [articles, setArticles] = React.useState<Array<Article>>([]);
  const [loading, setLoading] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(true);
  const [errored, setErrored] = React.useState<string>('');

  const renderItem = ({ item }: { item: Article }) => <ArticleCard article={item} />;

  if (firstRun) {
    setFirstRun(false);
    async function initialize() {
      try {
        setErrored('');
        await loadData(loading, setLoading, setArticles);
      } catch (error) {
        setErrored('Could not load articles (please try again later)\n' + error);
        setTimeout(() => setErrored(''), 10000);
        // TODO: add more detail, prettier display instead of just a Text
        // Alert.alert('Could not fetch articles (Not connected to the internet?)');
      } finally {
      }
    }
    initialize();
  }

  return loading ? (
    <View style={styles.screen}>
      <Text>{errored}</Text>
      <ActivityIndicator size="large" style={styles.screen} color="blue" />
    </View>
  ) : (
    <View style={styles.screen}>
      <Text style={{ textAlign: 'center' }}>{errored}</Text>
      <FlatList<Article>
        data={articles}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => loadData(loading, setLoading, setArticles)}
          />
        }
        renderItem={renderItem}
        keyExtractor={(item, index) => item.target_url || index.toString()}
        windowSize={20}
      />
    </View>
  );
}
