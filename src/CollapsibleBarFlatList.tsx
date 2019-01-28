import * as React from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  View
} from 'react-native';

interface AnimatedComponent<C> {
  getNode : () => C;
}

export type CollapsibleBarFlatListProps<Item> = {
  BarElement: React.ReactElement<any>;
  barHeight: number;
  isShowBar?: boolean;
  flatListRef?: (ref: FlatList<any> | null) => void;
} & FlatListProps<Item>;

type CollapsibleBarFlatListState = {
  clampedScrollOffset: Animated.AnimatedDiffClamp;
};

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export class CollapsibleBarFlatList<Item> extends React.Component<CollapsibleBarFlatListProps<Item>, CollapsibleBarFlatListState> {
  private clampedScrollValue = 0;
  private scrollOffsetValue = 0;
  private autoAminOffsetValue = 0;

  private scrollOffset = new Animated.Value(0);
  private autoAnimOffset = new Animated.Value(0);

  constructor(props: CollapsibleBarFlatListProps<Item>) {
    super(props);

    this.state = {
      clampedScrollOffset: Animated.diffClamp(
        Animated.add(
          this.scrollOffset.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp'
          }),
          this.autoAnimOffset
        ),
        0,
        props.barHeight
      )
    };
  }

  componentDidMount() {
    const {barHeight} = this.props;

    this.scrollOffset.addListener(({value}) => {
      const diff = value - this.scrollOffsetValue;
      this.scrollOffsetValue = value;
      this.clampedScrollValue = Math.min(Math.max(this.clampedScrollValue + diff, 0), barHeight);
    });

    this.autoAnimOffset.addListener(({value}) => {
      this.autoAminOffsetValue = value;
    });
  }

  componentWillUnmount() {
    this.scrollOffset.removeAllListeners();
    this.autoAnimOffset.removeAllListeners();
  }

  render() {
    const flatListProps = this.props as FlatListProps<Item>;
    const {barHeight, isShowBar, flatListRef} = this.props;
    const flatListRef_ = !!flatListRef ? flatListRef : () => {};

    const navBarTranslate = this.state.clampedScrollOffset.interpolate({
      inputRange: [0, barHeight],
      outputRange: [0, -barHeight],
      extrapolate: 'clamp'
    });

    const flatListTranslate = this.state.clampedScrollOffset.interpolate({
      inputRange: [0, barHeight],
      outputRange: [barHeight, 0],
      extrapolate: 'clamp'
    });

    const onScrollEndDrag = () => {
      const {barHeight} = this.props;
      const toValue =
        this.scrollOffsetValue > barHeight && this.clampedScrollValue > barHeight / 2
          ? this.autoAminOffsetValue + barHeight
          : this.autoAminOffsetValue - barHeight;

      Animated.timing(this.autoAnimOffset, {
        toValue,
        duration: 200,
        useNativeDriver: true
      }).start();
    };

    const isShowToolbar_ = !isShowBar || isShowBar;

    return (
      <View>
        <Animated.View
          style={{
            height: 0,
            width: Dimensions.get("window").width,
            transform: [{translateY: navBarTranslate}]
          }}>
          {isShowToolbar_ ? this.props.BarElement : null}
        </Animated.View>
        <AnimatedFlatList
          {...flatListProps}
          ref={(ref: AnimatedComponent<FlatList<Item>>) => {
            if (!!ref) {
              flatListRef_(ref.getNode());
            } else {
              flatListRef_(null);
            }
          }}
          style={[
            flatListProps.style,
            {transform: [{translateY: isShowToolbar_ ? flatListTranslate : Platform.OS === 'ios' ? 0 : -barHeight}]}
          ]}
          scrollEventThrottle={1}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.scrollOffset}}}], {useNativeDriver: true})}
          onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            if (!!this.props.onScrollEndDrag) {
              this.props.onScrollEndDrag(e);
            }
            onScrollEndDrag();
          }}
        />
      </View>
    );
  }
}
