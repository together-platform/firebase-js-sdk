/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../test/setup';
import { expect } from 'chai';
import { stub } from 'sinon';
import { activate, setTokenAutoRefreshEnabled } from './api';
import {
  FAKE_SITE_KEY,
  getFakeApp,
  getFakeCustomTokenProvider,
  getFakePlatformLoggingProvider
} from '../test/util';
import { getState } from './state';
import * as reCAPTCHA from './recaptcha';
import { FirebaseApp } from '@firebase/app-types';
import { ReCAPTCHAV3Provider } from './providers';

describe('api', () => {
  describe('activate()', () => {
    let app: FirebaseApp;

    beforeEach(() => {
      app = getFakeApp();
    });

    it('sets activated to true', () => {
      expect(getState(app).activated).to.equal(false);
      activate(
        app,
        new ReCAPTCHAV3Provider(FAKE_SITE_KEY),
        getFakePlatformLoggingProvider()
      );
      expect(getState(app).activated).to.equal(true);
    });

    it('isTokenAutoRefreshEnabled value defaults to global setting', () => {
      app = getFakeApp({ automaticDataCollectionEnabled: false });
      activate(
        app,
        new ReCAPTCHAV3Provider(FAKE_SITE_KEY),
        getFakePlatformLoggingProvider()
      );
      expect(getState(app).isTokenAutoRefreshEnabled).to.equal(false);
    });

    it('sets isTokenAutoRefreshEnabled correctly, overriding global setting', () => {
      app = getFakeApp({ automaticDataCollectionEnabled: false });
      activate(
        app,
        new ReCAPTCHAV3Provider(FAKE_SITE_KEY),
        getFakePlatformLoggingProvider(),
        true
      );
      expect(getState(app).isTokenAutoRefreshEnabled).to.equal(true);
    });

    it('can only be called once', () => {
      activate(
        app,
        new ReCAPTCHAV3Provider(FAKE_SITE_KEY),
        getFakePlatformLoggingProvider()
      );
      expect(() =>
        activate(
          app,
          new ReCAPTCHAV3Provider(FAKE_SITE_KEY),
          getFakePlatformLoggingProvider()
        )
      ).to.throw(/AppCheck can only be activated once/);
    });

    it('initialize reCAPTCHA when a sitekey is provided', () => {
      const initReCAPTCHAStub = stub(reCAPTCHA, 'initialize').returns(
        Promise.resolve({} as any)
      );
      activate(
        app,
        new ReCAPTCHAV3Provider(FAKE_SITE_KEY),
        getFakePlatformLoggingProvider()
      );
      expect(initReCAPTCHAStub).to.have.been.calledWithExactly(
        app,
        FAKE_SITE_KEY
      );
    });

    it('does NOT initialize reCAPTCHA when a custom token provider is provided', () => {
      const fakeCustomTokenProvider = getFakeCustomTokenProvider();
      const initReCAPTCHAStub = stub(reCAPTCHA, 'initialize');
      activate(app, fakeCustomTokenProvider, getFakePlatformLoggingProvider());
      expect(getState(app).provider).to.equal(fakeCustomTokenProvider);
      expect(initReCAPTCHAStub).to.have.not.been.called;
    });
  });
  describe('setTokenAutoRefreshEnabled()', () => {
    it('sets isTokenAutoRefreshEnabled correctly', () => {
      const app = getFakeApp({ automaticDataCollectionEnabled: false });
      setTokenAutoRefreshEnabled(app, true);
      expect(getState(app).isTokenAutoRefreshEnabled).to.equal(true);
    });
  });
});
