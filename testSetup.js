var chai = require('chai');
global.sinon = require('sinon');
var sinonChai = require('sinon-chai');
global.expect = chai.expect;
global.assert = chai.assert;
global.spy = global.sinon.spy;

chai.use(sinonChai);
