import { ReactWidget } from '@jupyterlab/ui-components';
import React from 'react';
import SignInForm from './SignInForm';

const AuthComponent = (): JSX.Element => {
  return (
    <div className="jp-auth-form-container">
      <div className="jp-auth-card">
        <h2 className="jp-auth-card-title">DVRE Authentication</h2>
        <SignInForm />
      </div>
    </div>
  );
};

export class AuthWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('jp-auth-base');
  }

  render(): JSX.Element {
    return <AuthComponent />;
  }
}
