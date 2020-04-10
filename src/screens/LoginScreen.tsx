import React, {RefObject} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {staticTheme, withTheme} from '../style/theming';
import {AppStackProps, AuthContext, Routing} from '../navigators/Routing';
import LoginButton from '../components/LoginButton';
import ThemedIcon from '../components/ThemedIcon';
import Logo from '../components/Logo';
import dataService from '../services/data';

const styles = StyleSheet.create({
	container: {
		padding: staticTheme.padding,
		paddingTop: staticTheme.statusBarOffset + staticTheme.padding,
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

class LoginScreen extends React.PureComponent<AppStackProps<Routing.AUTH>> {
	state: {
		server: string;
		name: string;
		password: string;
		loading: boolean;
		error?: string;
	} = (__DEV__)
		? {
			server: 'http://10.0.2.2:4040',
			name: 'admin',
			password: 'admin',
			loading: false,
			error: undefined
		}
		: {
			server: '',
			name: '',
			password: '',
			loading: false,
			error: undefined
		};
	static contextType = AuthContext;
	userNameRef: RefObject<TextInput> = React.createRef();
	passwordRef: RefObject<TextInput> = React.createRef();

	async componentDidMount(): Promise<void> {
		const server = (await dataService.getStored('last:server')) || '';
		const name = (await dataService.getStored('last:user')) || '';
		if (server || name) {
			this.setState({server, name});
		}
	}

	private checkEmpty(s: string): boolean {
		return (!s || s.trim().length === 0);
	}

	private login = async (): Promise<void> => {
		const {server, name, password} = this.state;
		if (this.checkEmpty(server)
			|| this.checkEmpty(server)
			|| this.checkEmpty(server)) {
			this.setState({error: 'Please provide all fields to login.'});
			return;
		}
		this.setState({loading: true, error: undefined});
		try {
			await this.context.login(server, name, password);
			await dataService.setStored('last:user', name);
			await dataService.setStored('last:server', server);
		} catch (e) {
			this.setState({error: `${e}`});
		}
		this.setState({loading: false});
	};

	private focusUsername = (): void => {
		this.userNameRef.current?.focus();
	};

	private focusPassword = (): void => {
		this.passwordRef.current?.focus();
	};

	private onChangeServerText = (text: string): void => {
		this.setState({server: text});
	};

	private onChangeNameText = (text: string): void => {
		this.setState({name: text});
	};

	private onChangePasswordText = (text: string): void => {
		this.setState({password: text});
	};

	render(): React.ReactElement {
		const {error, loading, name, server, password} = this.state;
		const {theme} = this.props;

		const contentView = loading
			? (<ActivityIndicator size="large" color={styles.buttonIndicator.color}/>)
			: (<Text style={styles.buttonText}>Login</Text>);

		const errorView = error && (
			<View style={styles.error}>
				<Text style={{color: theme.warning}}>{error}</Text>
			</View>
		);

		return (
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.container}>
					<View style={styles.headline}>
						<Logo size={140}/>
					</View>
					<View style={styles.loginBlock}>
						<KeyboardAvoidingView style={styles.content}>
							<View style={[styles.inputGroup, {borderColor: theme.textColor}]}>
								<View style={styles.inputIconWrapper}>
									<ThemedIcon name="notes-beamed" style={styles.inputIcon}/>
								</View>
								<TextInput
									style={[styles.input, {color: theme.textColor}]}
									placeholderTextColor={theme.muted}
									placeholder="Server"
									autoCorrect={false}
									value={server}
									returnKeyType="next"
									autoCapitalize="none"
									autoCompleteType="name"
									textContentType="URL"
									importantForAutofill="yes"
									onSubmitEditing={this.focusUsername}
									onChangeText={this.onChangeServerText}
									blurOnSubmit={false}
								/>
							</View>
							<View style={[styles.inputGroup, {borderColor: theme.textColor}]}>
								<View style={styles.inputIconWrapper}>
									<ThemedIcon name="user" style={styles.inputIcon}/>
								</View>
								<TextInput
									ref={this.userNameRef}
									style={[styles.input, {color: theme.textColor}]}
									placeholderTextColor={theme.muted}
									placeholder="User"
									autoCorrect={false}
									value={name}
									importantForAutofill="yes"
									autoCompleteType="username"
									textContentType="username"
									returnKeyType="next"
									autoCapitalize="none"
									onSubmitEditing={this.focusPassword}
									onChangeText={this.onChangeNameText}
									blurOnSubmit={false}
								/>
							</View>
							<View style={[styles.inputGroup, {borderColor: theme.textColor}]}>
								<View style={styles.inputIconWrapper}>
									<ThemedIcon name="key" style={styles.inputIcon}/>
								</View>
								<TextInput
									ref={this.passwordRef}
									style={[styles.input, {color: theme.textColor}]}
									placeholderTextColor={theme.muted}
									placeholder="Password"
									autoCompleteType="password"
									returnKeyType="done"
									textContentType="password"
									importantForAutofill="yes"
									autoCorrect={false}
									value={password}
									secureTextEntry={true}
									onChangeText={this.onChangePasswordText}
									autoCapitalize="none"
								/>
							</View>
						</KeyboardAvoidingView>
					</View>
					<View style={styles.buttons}>
						{errorView}
						<LoginButton style={styles.button} onPress={this.login}>
							{contentView}
						</LoginButton>
					</View>
				</View>
			</ScrollView>
		);
	}
}

export default withTheme(LoginScreen);
