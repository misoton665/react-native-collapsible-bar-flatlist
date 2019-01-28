declare module 'react-native-collapsible-bar-flatlist' {
  import * as React from 'react';
  import {Animated, FlatList, FlatListProps} from "react-native";

  export type CollapsibleBarFlatListProps<Item> = {
    BarElement: React.ReactElement<any>;
    barHeight: number;
    isShowBar?: boolean;
    flatListRef?: (ref: FlatList<any> | null) => void;
  } & FlatListProps<Item>;

  type CollapsibleBarFlatListState = {
    clampedScrollOffset: Animated.AnimatedDiffClamp;
  };

  export class CollapsibleBarFlatList<Item> extends React.Component<CollapsibleBarFlatListProps<Item>, CollapsibleBarFlatListState> {}
}
