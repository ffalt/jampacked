package io.github.ffalt.jampacked.ui.nav

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.player.PlayerStrip
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow

private val TAB_BAR_HEIGHT = 42.dp

@Composable
fun AppScaffold(
    session: JamSession,
    modifier: Modifier = Modifier,
    openPlayerRequests: Flow<Unit> = emptyFlow(),
    navController: NavHostController = rememberNavController(),
    navigationTransition: NavigationTransition = DEFAULT_NAVIGATION_TRANSITION,
    onNavigationTransitionChange: (NavigationTransition) -> Unit = {}
) {
    val colors = LocalJamColors.current
    val backStackEntry by navController.currentBackStackEntryAsState()
    val destination = backStackEntry?.destination

    val onTab =
        TabRoute.entries.firstOrNull { tab ->
            destination?.hierarchy()?.any { it.hasRoute(tab.route::class) } == true
        }

    var selectedTab by rememberSaveable { mutableStateOf(TabRoute.HOME) }
    LaunchedEffect(onTab) {
        if (onTab != null) selectedTab = onTab
    }

    val onPlayer = destination?.hasRoute(Route.Player::class) == true

    LaunchedEffect(openPlayerRequests) {
        openPlayerRequests.collect {
            navController.navigate(Route.Player) { launchSingleTop = true }
        }
    }

    Scaffold(
        modifier = modifier,
        containerColor = colors.background,
        bottomBar = {
            if (onPlayer) return@Scaffold
            Column {
                PlayerStrip(
                    session = session,
                    onOpen = { navController.navigate(Route.Player) }
                )

                Row(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .background(colors.navCard)
                            .navigationBarsPadding()
                            .height(TAB_BAR_HEIGHT),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TabRoute.entries.forEach { entry ->
                        val selected = selectedTab == entry
                        Box(
                            modifier =
                                Modifier
                                    .weight(1f)
                                    .fillMaxHeight()
                                    .clickable {
                                        navController.navigate(entry.route) {
                                            popUpTo(navController.graph.findStartDestination().id)
                                            launchSingleTop = true
                                        }
                                    },
                            contentAlignment = Alignment.Center
                        ) {
                            JamIcon(
                                name = entry.icon,
                                color = if (selected) colors.navPrimary else colors.inactiveTintColor,
                                size = if (selected) 26.dp else 22.dp,
                                contentDescription = stringResource(entry.labelRes)
                            )
                        }
                    }
                }
            }
        }
    ) { inner ->
        JamNavHost(
            navController = navController,
            session = session,
            navigationTransition = navigationTransition,
            onNavigationTransitionChange = onNavigationTransitionChange,
            modifier = Modifier.padding(inner)
        )
    }
}

private fun NavDestination.hierarchy(): Sequence<NavDestination> = generateSequence(this) { it.parent }
