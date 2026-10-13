package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.PageHeader

@Composable
fun QueueScreen(
    session: JamSession,
    modifier: Modifier = Modifier,
    viewModel: PlayerViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    Column(modifier = modifier.fillMaxSize()) {
        PageHeader(title = stringResource(R.string.queue))
        PlayerQueue(
            modifier = Modifier.fillMaxSize(),
            session = session,
            state = state,
            onSkipTo = viewModel::skipTo,
            onRemove = viewModel::remove,
            onMove = viewModel::move,
            onClear = viewModel::clearQueue,
            onShuffle = viewModel::shuffleQueue
        )
    }
}
