import { Help, Interfaces } from '@oclif/core';

export default class CustomHelp extends Help {
  protected async showRootHelp() {
    let rootCommands = this.sortedCommands;

    const state = this.config.pjson?.oclif?.state;
    if (state) {console.log(`${this.config.bin} is in ${state}.\n`);}
    console.log(this.formatRoot());
    console.log('');

    if (!this.opts.all) {
      rootCommands = rootCommands.filter(c => !c.id.includes(':'));
    }

    if (rootCommands.length > 0) {
      rootCommands = rootCommands.filter(c => c.id);
      console.log(this.formatCommands(rootCommands));
      console.log('');
    }
  }

  async showCommandHelp(command: Interfaces.Command): Promise<void> {
    const name = command.id;
    const depth = name.split(':').length;

    const subCommands = this.sortedCommands.filter(c => c.id.startsWith(`${name }:`) && c.id.split(':').length === depth + 1);
    const plugin = this.config.plugins.find(p => p.name === command.pluginName);

    const state = this.config.pjson?.oclif?.state || plugin?.pjson?.oclif?.state || command.state;
    if (state) {console.log(`This command is in ${state}.\n`);}

    const summary = this.summary(command);
    if (summary) {console.log(`${summary }\n`);}
    console.log(this.formatCommand(command));
    console.log('');

    if (subCommands.length > 0) {
      console.log(this.formatCommands(subCommands));
      console.log('');
    }
  }

  protected async showTopicHelp(): Promise<void> {
    console.log('');
  }
}
