import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ILauncher } from '@jupyterlab/launcher';
import { LabIcon } from '@jupyterlab/ui-components';
import { MainAreaWidget } from '@jupyterlab/apputils';
import { AuthWidget } from './AuthWidget';

const authIcon = new LabIcon({
  name: 'dvre-authentication:lock',
  svgstr:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M384 192L384 160C384 89.3 326.7 32 256 32C185.3 32 128 89.3 128 160L128 192L96 192C60.7 192 32 220.7 32 256L32 448C32 483.3 60.7 512 96 512L416 512C451.3 512 480 483.3 480 448L480 256C480 220.7 451.3 192 416 192L384 192zM192 160C192 124.7 220.7 96 256 96C291.3 96 320 124.7 320 160L320 192L192 192L192 160z"/></svg>'
});

namespace CommandIDs {
  export const create = 'dvre-authentication';
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'dvre-authentication:plugin',
  description: 'DVRE authentication via MetaMask self-signed Ethereum token.',
  autoStart: true,
  optional: [ILauncher],
  activate: (app: JupyterFrontEnd, launcher: ILauncher) => {
    const { commands } = app;
    const command = CommandIDs.create;

    commands.addCommand(command, {
      caption: 'Sign in to DVRE with MetaMask',
      label: 'Authentication',
      icon: args => (args['isPalette'] ? undefined : authIcon),
      describedBy: { args: {} },
      execute: () => {
        const content = new AuthWidget();
        const widget = new MainAreaWidget<AuthWidget>({ content });
        widget.title.label = 'Authentication';
        widget.title.icon = authIcon;
        app.shell.add(widget, 'main');
      }
    });

    if (launcher) {
      launcher.add({
        category: 'Decentralized Virtual Research Environment (DVRE)',
        command
      });
    }
  }
};

export default plugin;
