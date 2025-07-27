import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { staticTheme, useTheme } from '../style/theming';
import { AppStackProps, AppRouting } from '../navigators/Routing';
import { LoginButton } from '../components/LoginButton';
import { ThemedIcon } from '../components/ThemedIcon';
import { Logo } from '../components/Logo';
import dataService from '../services/data';
import { useAuth } from '../services/auth';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const styles = StyleSheet.create({
	container: {
		padding: staticTheme.padding,
		flexDirection: 'column',
		justifyContent: 'space-between',
		flex: 1
	},
	scrollContainer: {
		flex: 1
	},
	headline: {
		alignItems: 'center'
	},
	content: {
		paddingRight: staticTheme.paddingLarge,
		paddingLeft: staticTheme.paddingLarge,
		justifyContent: 'center',
		flex: 1
	},
	inputIconWrapper: {
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		padding: staticTheme.paddingSmall,
		minWidth: 38,
		marginTop: 10,
		marginRight: staticTheme.margin
	},
	// eslint-disable-next-line react-native/no-unused-styles
	inputIcon: {
		fontSize: 22
	},
	input: {
		flex: 1,
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 0,
		marginTop: 10
	},
	inputGroup: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
	},
	loginBlock: {
		flex: 1,
		margin: staticTheme.marginLarge,
		justifyContent: 'center',
		minHeight: 200
	},
	error: {
		marginVertical: staticTheme.marginLarge,
		justifyContent: 'center',
		alignItems: 'center'
	},
	button: {
		height: 100,
		width: 100,
		borderWidth: 1,
		borderColor: '#b7b7b7',
		borderRadius: 100 / 2,
		backgroundColor: '#008300',
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonText: {
		color: '#ffffff',
		fontWeight: 'bold'
	},
	// eslint-disable-next-line react-native/no-unused-styles
	buttonIndicator: {
		color: '#ffffff'
	},
	buttons: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 20,
		marginBottom: 20
	}
});

const defaultState = (__DEV__) ?
	{
		server: 'http://10.0.2.2:4040',
		name: 'admin',
		password: 'admin'
	} :
	{
		server: '',
		name: '',
		password: ''
	};

export const LoginScreen: React.FC<AppStackProps<AppRouting.AUTH>> = () => {
	const [server, setServer] = useState<string>(defaultState.server);
	const [name, setName] = useState<string>(defaultState.name);
	const [password, setPassword] = useState<string>(defaultState.password);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();
	const auth = useAuth();
	const userNameReference = useRef<TextInput | null>(null);
	const passwordReference = useRef<TextInput | null>(null);
	const theme = useTheme();
	const statusBarHeight = getStatusBarHeight() + staticTheme.padding;

	useEffect(() => {
		let isSubscribed = true;
		dataService.getStored('last:server')
			.then(result => {
				if (result && isSubscribed) {
					setServer(result);
				}
			})
			.catch(console.error);
		dataService.getStored('last:user')
			.then(result => {
				if (result && isSubscribed) {
					setName(result);
				}
			})
			.catch(console.error);
		return (): void => {
			isSubscribed = false;
		};
	}, []);

	const checkEmpty = (s: string): boolean => (!s || s.trim().length === 0);

	const loginPress = useCallback((): void => {
		if (checkEmpty(server) || checkEmpty(name) || checkEmpty(password)) {
			setError('Please provide all fields to login.');
			return;
		}

		const login = async (): Promise<void> => {
			await auth.login(server, name, password);
			await dataService.setStored('last:user', name);
			await dataService.setStored('last:server', server);
		};

		setError(undefined);
		setLoading(true);
		login().catch(error_ => {
			setError(`${error_}`);
			setLoading(false);
		});
	}, [auth, server, name, password]);

	const focusUsername = (): void => {
		userNameReference.current?.focus();
	};

	const focusPassword = (): void => {
		passwordReference.current?.focus();
	};

	const onChangeServerText = (text: string): void => {
		setServer(text);
	};

	const onChangeNameText = (text: string): void => {
		setName(text);
	};

	const onChangePasswordText = (text: string): void => {
		setPassword(text);
	};

	const contentView = loading ?
		(<ActivityIndicator size="large" color={styles.buttonIndicator.color} />) :
		(<Text style={styles.buttonText}>Login</Text>);

	const errorView = error && (
		<View style={styles.error}>
			<Text style={{ color: theme.warning }}>{error}</Text>
		</View>
	);

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={[styles.container, { paddingTop: statusBarHeight }]}>
				<View style={styles.headline}>
					<Logo size={140} />
				</View>
				<View style={styles.loginBlock}>
					<KeyboardAvoidingView style={styles.content}>
						<View style={[styles.inputGroup, { borderColor: theme.textColor }]}>
							<View style={styles.inputIconWrapper}>
								<ThemedIcon name="notes-beamed" size={styles.inputIcon.fontSize} />
							</View>
							<TextInput
								style={[styles.input, { color: theme.textColor }]}
								placeholderTextColor={theme.muted}
								placeholder="Server"
								autoCorrect={false}
								value={server}
								editable={!loading}
								returnKeyType="next"
								autoCapitalize="none"
								autoComplete="name"
								textContentType="URL"
								importantForAutofill="yes"
								onSubmitEditing={focusUsername}
								onChangeText={onChangeServerText}
								blurOnSubmit={false}
							/>
						</View>
						<View style={[styles.inputGroup, { borderColor: theme.textColor }]}>
							<View style={styles.inputIconWrapper}>
								<ThemedIcon name="user" size={styles.inputIcon.fontSize} />
							</View>
							<TextInput
								ref={userNameReference}
								style={[styles.input, { color: theme.textColor }]}
								placeholderTextColor={theme.muted}
								placeholder="User"
								autoCorrect={false}
								value={name}
								editable={!loading}
								importantForAutofill="yes"
								autoComplete="username"
								textContentType="username"
								returnKeyType="next"
								autoCapitalize="none"
								onSubmitEditing={focusPassword}
								onChangeText={onChangeNameText}
								blurOnSubmit={false}
							/>
						</View>
						<View style={[styles.inputGroup, { borderColor: theme.textColor }]}>
							<View style={styles.inputIconWrapper}>
								<ThemedIcon name="key" size={styles.inputIcon.fontSize} />
							</View>
							<TextInput
								ref={passwordReference}
								style={[styles.input, { color: theme.textColor }]}
								placeholderTextColor={theme.muted}
								placeholder="Password"
								editable={!loading}
								autoComplete="password"
								returnKeyType="done"
								textContentType="password"
								importantForAutofill="yes"
								autoCorrect={false}
								value={password}
								secureTextEntry={true}
								onChangeText={onChangePasswordText}
								autoCapitalize="none"
							/>
						</View>
					</KeyboardAvoidingView>
				</View>
				<View style={styles.buttons}>
					{errorView}
					<LoginButton style={styles.button} onPress={loginPress}>
						{contentView}
					</LoginButton>
				</View>
			</View>
		</ScrollView>
	);
};
