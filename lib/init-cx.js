'use client';

import { CoralogixRum } from '@coralogix/browser';

export function initCoralogix() {
  // Avoid double initialization (safe for SSR)
  if (typeof window === 'undefined') return;

  CoralogixRum.init({
    public_key: 'cxtp_lgoThfMJYORdk54g5QsLDW9imMjNJC',
    application: 'vercel-test-app',
    version: '1.0.0',
    coralogixDomain: 'US2',
 
    traceParentInHeader: {
      enabled: true,
      options: {
        propagateTraceHeaderCorsUrls: [
          new RegExp('.*'),
        ],
      },
    },

    sessionRecordingConfig: {
      enable: true, // Must declare.
      /**
       * If autoStartSessionRecording is false, you can manually start & stop your session recording.
       * Refer to Recording Manually Section.
       **/
      autoStartSessionRecording: true, // Automatically records your session when SDK is up.
      recordConsoleEvents: true, // Will record all console events from dev tools. Levels: log, debug, warn, error, info, table etc..
      sessionRecordingSampleRate: 100, // Percentage of overall sessions recording being tracked, defaults to 100% and applied after the overall sessionSampleRate.
    }
  });

  CoralogixRum.setUserContext({
    user_id: 'rajeev999',
    user_name: 'rajeevg',
    user_email: 'rajeev@email.com',
    user_metadata: {
      role: 'admin'
    }
  });

  CoralogixRum.setLabels({
    paymentMethod: 'visa',
    userTheme: 'black'
  });
}

