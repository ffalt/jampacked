package io.github.ffalt.jampacked.ui.login

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.input.KeyboardActionHandler
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.TextFieldState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.OutlinedSecureTextField
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.ui.components.Logo
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.flow.drop

@Composable
fun LoginScreen(
    modifier: Modifier = Modifier,
    viewModel: LoginViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val colors = LocalJamColors.current
    val keyboard = LocalSoftwareKeyboardController.current
    val serverFieldState = rememberLoginFieldState(state.server, viewModel::onServer)
    val usernameFieldState = rememberLoginFieldState(state.username, viewModel::onUsername)
    val passwordFieldState = rememberLoginFieldState(state.password, viewModel::onPassword)
    val submit = {
        keyboard?.hide()
        viewModel.onServer(serverFieldState.text.toString())
        viewModel.onUsername(usernameFieldState.text.toString())
        viewModel.onPassword(passwordFieldState.text.toString())
        viewModel.login()
    }

    Box(
        modifier =
            modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(colors.gradient))
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .safeDrawingPadding()
                    .verticalScroll(rememberScrollState())
                    .padding(JamDimens.paddingLarge),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Logo(size = LOGIN_LOGO)
            ThemedText(
                text = stringResource(R.string.app_name),
                fontSize = JamDimens.fontSizeBig,
                fontWeight = FontWeight.Bold,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(top = JamDimens.margin)
            )
            ThemedText(
                text = stringResource(R.string.sign_in_to_server),
                color = colors.muted,
                fontSize = JamDimens.fontSizeSmall,
                modifier = Modifier.padding(top = JamDimens.paddingSmall)
            )

            Column(
                modifier =
                    Modifier
                        .padding(top = FORM_GAP)
                        .widthIn(max = FORM_WIDTH),
                verticalArrangement = Arrangement.spacedBy(JamDimens.padding)
            ) {
                LoginField(
                    state = serverFieldState,
                    label = stringResource(R.string.server),
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType = KeyboardType.Uri,
                            imeAction = ImeAction.Next
                        )
                )
                LoginField(
                    state = usernameFieldState,
                    label = stringResource(R.string.user),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
                )
                LoginField(
                    state = passwordFieldState,
                    label = stringResource(R.string.password),
                    secure = true,
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction = ImeAction.Done
                        ),
                    onKeyboardAction = KeyboardActionHandler { submit() }
                )

                LoginButton(
                    busy = state.busy,
                    onClick = submit,
                    modifier = Modifier.padding(top = JamDimens.paddingSmall)
                )

                state.error?.let { message ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        JamIcon("warning", colors.warning, size = JamDimens.icon)
                        ThemedText(
                            text = message,
                            color = colors.warning,
                            fontSize = JamDimens.fontSizeSmall,
                            modifier = Modifier.padding(start = JamDimens.paddingSmall)
                        )
                    }
                }
            }
        }
    }
}

@Composable
@OptIn(ExperimentalMaterial3Api::class)
private fun LoginField(
    state: TextFieldState,
    label: String,
    keyboardOptions: KeyboardOptions,
    modifier: Modifier = Modifier,
    secure: Boolean = false,
    onKeyboardAction: KeyboardActionHandler? = null
) {
    val colors = LocalJamColors.current
    val fieldColors =
        OutlinedTextFieldDefaults.colors(
            focusedTextColor = colors.textColor,
            unfocusedTextColor = colors.textColor,
            focusedContainerColor = colors.itemBackground,
            unfocusedContainerColor = colors.itemBackground,
            cursorColor = colors.activeTintColor,
            focusedBorderColor = colors.activeTintColor,
            unfocusedBorderColor = colors.separator,
            focusedLabelColor = colors.activeTintColor,
            unfocusedLabelColor = colors.muted
        )
    val fieldModifier = modifier.fillMaxWidth()
    val fieldShape = RoundedCornerShape(CORNER)
    val fieldTextStyle = LocalTextStyle.current.copy(fontSize = JamDimens.fontSize)

    if (secure) {
        OutlinedSecureTextField(
            state = state,
            label = { Text(label, fontSize = JamDimens.fontSizeSmall) },
            shape = fieldShape,
            textStyle = fieldTextStyle,
            keyboardOptions = keyboardOptions,
            onKeyboardAction = onKeyboardAction,
            colors = fieldColors,
            modifier = fieldModifier
        )
    } else {
        OutlinedTextField(
            state = state,
            label = { Text(label, fontSize = JamDimens.fontSizeSmall) },
            lineLimits = TextFieldLineLimits.SingleLine,
            shape = fieldShape,
            textStyle = fieldTextStyle,
            keyboardOptions = keyboardOptions,
            onKeyboardAction = onKeyboardAction,
            colors = fieldColors,
            modifier = fieldModifier
        )
    }
}

@Composable
private fun rememberLoginFieldState(
    value: String,
    onValueChange: (String) -> Unit
): TextFieldState {
    val textFieldState = remember { TextFieldState(initialText = value) }
    val currentOnValueChange = rememberUpdatedState(onValueChange)
    LaunchedEffect(textFieldState) {
        snapshotFlow { textFieldState.text.toString() }
            .drop(1)
            .collect { currentOnValueChange.value(it) }
    }
    return textFieldState
}

@Composable
private fun LoginButton(
    busy: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Box(
        modifier =
            modifier
                .fillMaxWidth()
                .height(BUTTON_HEIGHT)
                .clip(RoundedCornerShape(CORNER))
                .background(colors.navPrimary)
                .clickable(enabled = !busy, onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        if (busy) {
            CircularProgressIndicator(
                color = Color.White,
                strokeWidth = 2.dp,
                modifier = Modifier.size(JamDimens.iconBig)
            )
        } else {
            ThemedText(
                text = stringResource(R.string.login).uppercase(),
                color = Color.White,
                fontWeight = FontWeight.Medium,
                letterSpacing = 1.sp
            )
        }
    }
}

private val LOGIN_LOGO = 110.dp
private val FORM_GAP = 30.dp
private val FORM_WIDTH = 400.dp
private val BUTTON_HEIGHT = 48.dp
private val CORNER = 6.dp
