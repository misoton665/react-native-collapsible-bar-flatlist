import * as React from 'react';
import { Animated, Dimensions, FlatList, Platform, View } from 'react-native';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
export class CollapsibleToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.clampedScrollValue = 0;
        this.scrollOffsetValue = 0;
        this.autoAminOffsetValue = 0;
        this.scrollOffset = new Animated.Value(0);
        this.autoAnimOffset = new Animated.Value(0);
        this.state = {
            clampedScrollOffset: Animated.diffClamp(Animated.add(this.scrollOffset.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolateLeft: 'clamp'
            }), this.autoAnimOffset), 0, props.barHeight)
        };
    }
    componentDidMount() {
        const { barHeight } = this.props;
        this.scrollOffset.addListener(({ value }) => {
            const diff = value - this.scrollOffsetValue;
            this.scrollOffsetValue = value;
            this.clampedScrollValue = Math.min(Math.max(this.clampedScrollValue + diff, 0), toolbarHeight);
        });
        this.autoAnimOffset.addListener(({ value }) => {
            this.autoAminOffsetValue = value;
        });
    }
    componentWillUnmount() {
        this.scrollOffset.removeAllListeners();
        this.autoAnimOffset.removeAllListeners();
    }
    render() {
        const flatListProps = this.props;
        const { barHeight, isShowBar, flatListRef } = this.props;
        const flatListRef_ = !!flatListRef ? flatListRef : () => { };
        const navBarTranslate = this.state.clampedScrollOffset.interpolate({
            inputRange: [0, toolbarHeight],
            outputRange: [0, -toolbarHeight],
            extrapolate: 'clamp'
        });
        const flatListTranslate = this.state.clampedScrollOffset.interpolate({
            inputRange: [0, toolbarHeight],
            outputRange: [toolbarHeight, 0],
            extrapolate: 'clamp'
        });
        const onScrollEndDrag = () => {
            const { barHeight } = this.props;
            const toValue = this.scrollOffsetValue > toolbarHeight && this.clampedScrollValue > toolbarHeight / 2
                ? this.autoAminOffsetValue + toolbarHeight
                : this.autoAminOffsetValue - toolbarHeight;
            Animated.timing(this.autoAnimOffset, {
                toValue,
                duration: 200,
                useNativeDriver: true
            }).start();
        };
        const isShowToolbar_ = !isShowToolbar || isShowToolbar;
        return (<View>
        <Animated.View style={{
            height: 0,
            width: Dimensions.get("window").width,
            transform: [{ translateY: navBarTranslate }]
        }}>
          {isShowToolbar_ ? this.props.BarElement : null}
        </Animated.View>
        <AnimatedFlatList {...flatListProps} ref={(ref) => {
            if (!!ref) {
                flatListRef_(ref.getNode());
            }
            else {
                flatListRef_(null);
            }
        }} style={[
            flatListProps.style,
            { transform: [{ translateY: isShowToolbar_ ? flatListTranslate : Platform.OS === 'ios' ? 0 : -toolbarHeight }] }
        ]} scrollEventThrottle={1} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollOffset } } }], { useNativeDriver: true })} onScrollEndDrag={(e) => {
            if (!!this.props.onScrollEndDrag) {
                this.props.onScrollEndDrag(e);
            }
            onScrollEndDrag();
        }}/>
      </View>);
    }
}
//# sourceMappingURL=CollapsibleToolbar.js.map