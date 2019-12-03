import OpenTokenProvider from "../../../lib/codec/opentoken";
import {expect, assert} from 'chai';

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
            const otk = new OpenTokenProvider({cipherId: 2});
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
            const otk = new OpenTokenProvider(TEST_CASES.sample1.password);
            const value = otk.decode(TEST_CASES.sample1.token);
            console.log(value)
            assert.equal(value,TEST_CASES.sample1.value);
            // expect(() => otk.decode('abcdefr')).to.throw('Invalid Token')
        });
    });
});