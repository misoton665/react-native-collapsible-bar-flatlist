# react-native-collapsible-bar-flatlist

## Getting Started

### Installation

```
$ yarn add react-native-collapsible-bar-flatlist
  or
$ npm install react-native-collapsible-bar-flatlist
```

### Usage

```tsx
<CollapsibleBarFlatList
  BarElement={<Bar/>}
  barHeight={80}
  data={this.data}
  ListFooterComponent={<View style={styles.footer}/>}
  keyExtractor={(item) => item.toString()}
  renderItem={(info) => (
    <View style={styles.item}>
      <Text>{info.item.toString()}</Text>
    </View>
  )}/>
```

|Property|Description|
|:-|:-|
|BarElement: ReactElement|A ReactElement that is shown on the top of the FlatList. |
|barHeight: number|A height of the bar element. It should be same with `BarElement` element's height.|
|isShowBar?: boolean|If you want to switch visibility of the bar, you can set it on this prop. The default value is `true`.|
|flatListRef?: (ref: FlatList<any> \| null) => void|You can get a ref of the `FlatList` like `View.ref`.|

and other props are same with [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist).
