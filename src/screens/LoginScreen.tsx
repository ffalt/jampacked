import React, {RefObject} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {staticTheme, withTheme} from '../style/theming';
import {AppStackProps, AuthContext, Routing} from '../navigators/Routing';
import LoginButton from '../components/LoginButton';
import ThemedIcon from '../components/ThemedIcon';
import Logo from '../components/Logo';

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
	inputIcon: {
		fontSize: 22,
		paddingRight: staticTheme.padding,
		paddingTop: 10
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

	private checkEmpty(s: string): boolean {
		return (!s || s.trim().length === 0);
	}

	private login = async (): Promise<void> => {
		if (this.checkEmpty(this.state.server)
			|| this.checkEmpty(this.state.server)
			|| this.checkEmpty(this.state.server)) {
			this.setState({error: 'Please provide all fields to login.'});
			return;
		}
		this.setState({loading: true, error: undefined});
		try {
			await this.context.login(this.state.server, this.state.name, this.state.password);
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
		const content = this.state.loading
			? (<ActivityIndicator size="large" color={styles.buttonIndicator.color}/>)
			: (<Text style={styles.buttonText}>Login</Text>);
		const error = this.state.error && (
			<View style={styles.error}>
				<Text style={{color: this.props.theme.warning}}>{this.state.error}</Text>
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
							<View style={[styles.inputGroup, {borderColor: this.props.theme.textColor}]}>
								<ThemedIcon name="notes-beamed" style={styles.inputIcon}/>
								<TextInput
									style={[styles.input, {color: this.props.theme.textColor}]}
									placeholderTextColor={this.props.theme.muted}
									placeholder="Server"
									autoCorrect={false}
									value={this.state.server}
									autoCompleteType="off"
									returnKeyType="next"
									autoCapitalize="none"
									onSubmitEditing={this.focusUsername}
									onChangeText={this.onChangeServerText}
									blurOnSubmit={false}
								/>
							</View>
							<View style={[styles.inputGroup, {borderColor: this.props.theme.textColor}]}>
								<ThemedIcon name="user" style={styles.inputIcon}/>
								<TextInput
									ref={this.userNameRef}
									style={[styles.input, {color: this.props.theme.textColor}]}
									placeholderTextColor={this.props.theme.muted}
									placeholder="User"
									autoCorrect={false}
									value={this.state.name}
									autoCompleteType="username"
									returnKeyType="next"
									autoCapitalize="none"
									onSubmitEditing={this.focusPassword}
									onChangeText={this.onChangeNameText}
									blurOnSubmit={false}
								/>
							</View>
							<View style={[styles.inputGroup, {borderColor: this.props.theme.textColor}]}>
								<ThemedIcon name="key" style={styles.inputIcon}/>
								<TextInput
									ref={this.passwordRef}
									style={[styles.input, {color: this.props.theme.textColor}]}
									placeholderTextColor={this.props.theme.muted}
									placeholder="Password"
									autoCompleteType="password"
									returnKeyType="done"
									autoCorrect={false}
									value={this.state.password}
									secureTextEntry={true}
									onChangeText={this.onChangePasswordText}
									autoCapitalize="none"
								/>
							</View>
						</KeyboardAvoidingView>
					</View>
					<View style={styles.buttons}>
						{error}
						<LoginButton style={styles.button} onPress={this.login}>
							{content}
						</LoginButton>
					</View>
				</View>
			</ScrollView>
		);
	}
}

export default withTheme(LoginScreen);
