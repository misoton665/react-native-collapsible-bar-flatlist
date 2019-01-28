# react-native-collapsible-toolbar

## Getting Started

### Installation

```
$ yarn add react-native-collapsible-toolbar
  or
$ npm install react-native-collapsible-toolbar
```

### Usage

```tsx
<CollapsibleToolbar
  Toolbar={<Toolbar/>}
  toolbarHeight={80}
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
|Toolbar: ReactElement|A ReactElement that is shown on the top of the FlatList. |
|toolbarHeight: number|A height of the toolbar element. It should be same with `Toolbar` element's height.|
|isShowToolbar?: boolean|If you want to switch visibility of the toolbar, you can set it on this prop. Default is `true`.|
|flatListRef?: (ref: FlatList<any> \| null) => void|You can get a ref of the `FlatList` like `View.ref`.|

and other props are same with [`FlatListProps`](https://facebook.github.io/react-native/docs/flatlist).