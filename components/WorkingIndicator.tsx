import { Text } from 'tamagui'
import { useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Brain } from '@tamagui/lucide-icons'

const AnimatedText = Animated.createAnimatedComponent(Text)

const WorkingIndicator = () => {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  useEffect(() => {
    // Start the infinite animation loop as soon as component mounts
    const startLoopingAnimation = () => {
      // Create a continuous scaling loop
      // scale.value = withRepeat(
      //   withSequence(
      //     // Scale up
      //     withTiming(1.1, {
      //       duration: 700,
      //       easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      //     }),
      //     // Scale down
      //     withTiming(1, {
      //       duration: 700,
      //       easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      //     })
      //   ),
      //   -1, // -1 means loop forever
      //   true // Reverse the animation sequence
      // )

      // Create a continuous opacity loop
      opacity.value = withRepeat(
        withSequence(
          // Fade out
          withTiming(0.6, {
            duration: 700,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          // Fade in
          withTiming(1, {
            duration: 700,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        -1, // -1 means loop forever
        true // Reverse the animation sequence
      )
    }

    // Start the animation loop
    startLoopingAnimation()

    // Optional: Clean up animations when component unmounts
    return () => {
      scale.value = 1
      opacity.value = 1
    }
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <AnimatedText style={animatedStyle} fontSize={16} fontWeight="500" color="$gray11">
      <Brain size={'$1'} /> Working...
    </AnimatedText>
  )
}

export default WorkingIndicator
