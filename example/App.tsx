import * as React from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {CollapsibleBarFlatList} from 'react-native-collapsible-bar-flatlist';

const Bar = () => <View style={styles.toolbar}><Text>Toolbar</Text></View>;

export default class App extends React.Component<{}, {isRefreshing: boolean}> {
  data = [...Array(60).keys()];

  constructor(props: {}) {
    super(props);

    this.state = {
      isRefreshing: false
    };
  }

  render() {
    const onRefresh = () => {
      this.setState({isRefreshing: true});
      setTimeout(() => {
        this.setState({isRefreshing: false});
      }, 1000);
    };

    return (
      <View style={styles.container}>
        <CollapsibleBarFlatList
          BarElement={<Bar/>}
          barHeight={80}
          refreshing={this.state.isRefreshing}
          onRefresh={onRefresh}
          data={this.data}
          ListFooterComponent={<View style={styles.footer}/>}
          keyExtractor={(item) => item.toString()}
          renderItem={(info) => (
            <View style={styles.item}>
              <Text>{info.item.toString()}</Text>
            </View>
          )}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    height: 80,
    width: Dimensions.get('window').width,
    backgroundColor: '#f008',
    paddingTop: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  item: {
    height: 100,
    width: Dimensions.get("window").width,
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  footer: {
    height: 60
  },
});
