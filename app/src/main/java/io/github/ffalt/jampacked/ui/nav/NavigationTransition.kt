package io.github.ffalt.jampacked.ui.nav

import androidx.annotation.StringRes
import androidx.compose.animation.EnterTransition
import androidx.compose.animation.ExitTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import io.github.ffalt.jampacked.R

enum class NavigationTransition(
    @StringRes val labelRes: Int
) {
    CLASSIC_SLIDE(R.string.transition_classic_slide),
    SHARED_AXIS(R.string.transition_shared_axis),
    PREDICTIVE_BACK_ZOOM(R.string.transition_predictive_back_zoom),
    FADE_THROUGH(R.string.transition_fade_through),
    MINIMAL_CROSSFADE(R.string.transition_minimal_crossfade);

    fun enter(): EnterTransition =
        when (this) {
            CLASSIC_SLIDE -> {
                slideInHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    initialOffsetX = { it }
                )
            }

            SHARED_AXIS -> {
                slideInHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    initialOffsetX = { it / 3 }
                ) + fadeIn(animationSpec = tween(TRANSITION_DURATION))
            }

            PREDICTIVE_BACK_ZOOM -> {
                scaleIn(
                    animationSpec = tween(TRANSITION_DURATION),
                    initialScale = ZOOM_SCALE
                ) + fadeIn(animationSpec = tween(TRANSITION_DURATION))
            }

            FADE_THROUGH -> {
                fadeIn(
                    animationSpec =
                        tween(
                            durationMillis = FADE_THROUGH_IN_DURATION,
                            delayMillis = FADE_THROUGH_OUT_DURATION
                        )
                )
            }

            MINIMAL_CROSSFADE -> {
                fadeIn(animationSpec = tween(TRANSITION_DURATION))
            }
        }

    fun exit(): ExitTransition =
        when (this) {
            CLASSIC_SLIDE -> {
                slideOutHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    targetOffsetX = { -it }
                )
            }

            SHARED_AXIS -> {
                slideOutHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    targetOffsetX = { -it / 3 }
                ) + fadeOut(animationSpec = tween(TRANSITION_DURATION))
            }

            PREDICTIVE_BACK_ZOOM -> {
                scaleOut(
                    animationSpec = tween(TRANSITION_DURATION),
                    targetScale = ZOOM_SCALE
                ) + fadeOut(animationSpec = tween(TRANSITION_DURATION))
            }

            FADE_THROUGH -> {
                fadeOut(animationSpec = tween(FADE_THROUGH_OUT_DURATION))
            }

            MINIMAL_CROSSFADE -> {
                fadeOut(animationSpec = tween(TRANSITION_DURATION))
            }
        }

    fun popEnter(): EnterTransition =
        when (this) {
            CLASSIC_SLIDE -> {
                slideInHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    initialOffsetX = { -it }
                )
            }

            SHARED_AXIS -> {
                slideInHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    initialOffsetX = { -it / 3 }
                ) + fadeIn(animationSpec = tween(TRANSITION_DURATION))
            }

            PREDICTIVE_BACK_ZOOM -> {
                scaleIn(
                    animationSpec = tween(TRANSITION_DURATION),
                    initialScale = ZOOM_SCALE
                ) + fadeIn(animationSpec = tween(TRANSITION_DURATION))
            }

            FADE_THROUGH -> {
                enter()
            }

            MINIMAL_CROSSFADE -> {
                fadeIn(animationSpec = tween(TRANSITION_DURATION))
            }
        }

    fun popExit(): ExitTransition =
        when (this) {
            CLASSIC_SLIDE -> {
                slideOutHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    targetOffsetX = { it }
                )
            }

            SHARED_AXIS -> {
                slideOutHorizontally(
                    animationSpec = tween(TRANSITION_DURATION),
                    targetOffsetX = { it / 3 }
                ) + fadeOut(animationSpec = tween(TRANSITION_DURATION))
            }

            PREDICTIVE_BACK_ZOOM -> {
                scaleOut(
                    animationSpec = tween(TRANSITION_DURATION),
                    targetScale = ZOOM_SCALE
                ) + fadeOut(animationSpec = tween(TRANSITION_DURATION))
            }

            FADE_THROUGH -> {
                exit()
            }

            MINIMAL_CROSSFADE -> {
                fadeOut(animationSpec = tween(TRANSITION_DURATION))
            }
        }

    private companion object {
        const val TRANSITION_DURATION = 240
        const val FADE_THROUGH_OUT_DURATION = 90
        const val FADE_THROUGH_IN_DURATION = 180
        const val ZOOM_SCALE = 0.94f
    }
}

val DEFAULT_NAVIGATION_TRANSITION = NavigationTransition.FADE_THROUGH
