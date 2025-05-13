'use client';

import { CoralogixRum } from '@coralogix/browser';

CoralogixRum.init({
  public_key: 'cxtp_lgoThfMJYORdk54g5QsLDW9imMjNJC',
  application: 'vercel-test-app',
  version: '1.0.0',
  coralogixDomain: 'US2'
});

CoralogixRum.setUserContext({
  user_id: 'rajeev999',
  user_name: 'rajeevg',
  user_email: 'rajeev@email.com',
  user_metadata: {
    role: 'admin',
    // ...
  }
})

CoralogixRum.setLabels({
  paymentMethod: 'visa',
  userTheme: 'black'
  // ...
})
