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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
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

@Composable
fun LoginScreen(
    modifier: Modifier = Modifier,
    viewModel: LoginViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val colors = LocalJamColors.current
    val keyboard = LocalSoftwareKeyboardController.current
    val submit = {
        keyboard?.hide()
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
                    value = state.server,
                    onValueChange = viewModel::onServer,
                    label = stringResource(R.string.server),
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType = KeyboardType.Uri,
                            imeAction = ImeAction.Next
                        )
                )
                LoginField(
                    value = state.username,
                    onValueChange = viewModel::onUsername,
                    label = stringResource(R.string.user),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next)
                )
                LoginField(
                    value = state.password,
                    onValueChange = viewModel::onPassword,
                    label = stringResource(R.string.password),
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction = ImeAction.Done
                        ),
                    keyboardActions = KeyboardActions(onDone = { submit() })
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
private fun LoginField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    keyboardOptions: KeyboardOptions,
    modifier: Modifier = Modifier,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardActions: KeyboardActions = KeyboardActions.Default
) {
    val colors = LocalJamColors.current
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, fontSize = JamDimens.fontSizeSmall) },
        singleLine = true,
        shape = RoundedCornerShape(CORNER),
        textStyle = LocalTextStyle.current.copy(fontSize = JamDimens.fontSize),
        visualTransformation = visualTransformation,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
        colors =
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
            ),
        modifier = modifier.fillMaxWidth()
    )
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
