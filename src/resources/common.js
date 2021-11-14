/*eslint-disable*/

String.prototype.format = function () {
	var a = this;
	for (var k in arguments) {
		a = a.replace('{' + k + '}', arguments[k]);
	}
	return a;
};

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
