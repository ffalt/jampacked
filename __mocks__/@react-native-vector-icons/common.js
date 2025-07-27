// Mock the entire common library so there are no native module loading errors
// eslint-disable-next-line unicorn/prefer-module
module.exports = {
	createIconSet: () => "icon"
};
