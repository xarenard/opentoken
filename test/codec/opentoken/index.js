import OpenTokenProvider from "../../../src/codec/opentoken";
import {expect, assert} from 'chai';
import sinon from "sinon";
import OpenTokenUtils from "../../../src/codec/opentoken/utils";

// see https://support.pingidentity.com/s/article/How-do-I-view-the-contents-of-an-OpenToken
const TEST_CASES = {
    'sample1': {token: 'T1RLAQKrMohNdaqjSzkinkn1yr5I_tG2LBBY2TM3XYJadvGNH9gtLx5dAACQpP00vfnLe8ev-bW4xNsUu9UzR-B5TGMSh0CbvgIuIs91UWEnU1CrVg_E_q0yToWx7COkfyuOeVLeR3M8S5l7nz_LiLEJYB2efqejdgjeu9N1-vHU8GJMl1-qCFSTurQl-1I5HLuYNi3VyTomWtPiRXpQrvgknK2KwEma14wXk40JqGOwLDcKTqpr5DJZwoN4',
                value: 'not-before=2013-04-02T02:38:32Z\nauthnContext=urn:oasis:names:tc:SAML:2.0:ac:classes:Password\nsubject=joe\nnot-on-or-after=2013-04-02T02:43:32Z\nrenew-until=2013-04-02T14:38:32Z',
                password: '2Federate'
    }
};

describe('OpenToken Test Case', () => {

    describe('When decoding invalid token',() => {
        it('Should throw error when token is undefined', () => {
            const otk = new OpenTokenProvider('password');
            expect(() => otk.decode()).to.throw('Invalid Token')
        });
        it('Should throw error when token is null', () => {
            const otk = new OpenTokenProvider('');
            expect(() => otk.decode(null)).to.throw('Invalid Token')

        });
        it('Should throw error when token has invalid size', () => {
            const otk = new OpenTokenProvider('');
            expect(() => otk.decode('abcdefr')).to.throw('Invalid Token')

        });
        it('Decode PBE', () => {
            const otk = new OpenTokenProvider(TEST_CASES.sample1.password,'');
            const value = otk.decode(TEST_CASES.sample1.token);
            assert.equal(value,TEST_CASES.sample1.value);
        });
    });


    describe('Validation token ',() => {
        afterEach(function () {
            sinon.restore();
        });
        it('With invalid subject should throw error ', () => {
            const otk = new OpenTokenProvider('2Federate');
            expect(() => otk.validate(TEST_CASES.sample1.token,'joe2')).to.throw('Invalid Subject');
        });
        it('With undefined subject should succeed - no subject validation', () => {
            sinon.stub(OpenTokenUtils, 'date').returns(new Date('2013-04-02T02:40:32Z'));
            const otk = new OpenTokenProvider('2Federate');
        });
        it('With valid subject should succeed', () => {
            const otk = new OpenTokenProvider('2Federate');
            expect(() => otk.validate(TEST_CASES.sample1.token,'joe')).not.to.throw('Invalid Subject');
        });
        it('With now before issued token should fail', () => {
            const otk = new OpenTokenProvider('2Federate');
            sinon.stub(OpenTokenUtils, 'date').returns(new Date('2000-02-04'));
            expect(() => otk.validate(TEST_CASES.sample1.token,'joe')).to.throw('Invalid token - Token issued before current date.');

        });
        it('With  issued token in time window should succeed', () => {
            const otk = new OpenTokenProvider('2Federate');
            sinon.stub(OpenTokenUtils, 'date').returns(new Date('2013-04-02T02:40:32Z'));
            const payload = otk.validate(TEST_CASES.sample1.token,'joe');
            assert.equal(TEST_CASES.sample1.value, payload);
        });
        it('With  issued token after date limit should failed', () => {
            const otk = new OpenTokenProvider('2Federate', 'joe');
            expect(() => otk.validate(TEST_CASES.sample1.token)).to.throw('Invalid token - Token expired.');
        });
    });
});