import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the dvre-authentication extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'dvre-authentication:plugin',
  description: 'A JupyterLab extenstion.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension dvre-authentication is activated!');
  }
};

export default plugin;
