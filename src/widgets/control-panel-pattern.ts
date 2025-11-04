/**
 * Control Panel Pattern for AXON Modules
 * 
 * Copy this pattern into your AXON module's createModule() function.
 * The env provides InteractiveComponent, persistent, etc.
 */

export const CONTROL_PANEL_PATTERN = `
/**
 * Base class for control panels with progressive disclosure
 * 
 * Usage in AXON module:
 * 
 * export function createModule(env: IAxonEnvironmentV2) {
 *   const { InteractiveComponent, persistent } = env;
 *   
 *   // Copy ControlPanelBase implementation here
 *   abstract class ControlPanelBase extends InteractiveComponent {
 *     // ... (see below)
 *   }
 *   
 *   class MyPanel extends ControlPanelBase {
 *     protected getPanelId() { return 'my-panel'; }
 *     // ...
 *   }
 * }
 */

abstract class ControlPanelBase extends InteractiveComponent {
  @persistent()
  protected isOpen: boolean = false;
  
  protected abstract getPanelId(): string;
  protected abstract getPanelDisplayName(): string;
  protected abstract onPanelOpened(): Promise<void>;
  protected abstract onPanelClosed(): Promise<void>;
  
  protected getPanelScope(): string {
    return \`panel:\${this.getPanelId()}\`;
  }
  
  async onMount(): Promise<void> {
    this.registerActionWithInstructions(
      'open',
      async () => { await this.openPanel(); },
      \`Open \${this.getPanelDisplayName()} panel: @\${this.element.id}.open\`,
      {
        description: \`Open the \${this.getPanelDisplayName()} panel to access its tools\`,
        category: this.getPanelId()
      }
    );
    
    this.registerActionWithInstructions(
      'close',
      async () => { await this.closePanel(); },
      \`Close this panel: @\${this.element.id}.close\`,
      {
        description: \`Close the \${this.getPanelDisplayName()} panel\`,
        category: this.getPanelId(),
        scope: [this.getPanelScope()]
      }
    );
    
    this.element.subscribe('frame:start');
  }
  
  private async openPanel(): Promise<void> {
    if (this.isOpen) {
      this.addEvent(
        \`\${this.getPanelDisplayName()} panel is already open\`,
        'panel-already-open',
        \`\${this.getPanelId()}-panel-already-open\`
      );
      return;
    }
    
    this.isOpen = true;
    
    this.addOperation({
      type: 'addFacet',
      facet: {
        id: \`scope-\${this.getPanelScope()}\`,
        type: 'scope-change',
        scope: [this.getPanelScope()],
        state: { active: true }
      }
    });
    
    this.addEvent(
      \`\${this.getPanelDisplayName()} panel opened - additional tools now available\`,
      'panel-opened',
      \`\${this.getPanelId()}-panel-opened\`,
      { panelId: this.getPanelId() }
    );
    
    await this.onPanelOpened();
    this.reactivateAgent('Panel opened - new tools available');
  }
  
  private async closePanel(): Promise<void> {
    if (!this.isOpen) {
      this.addEvent(
        \`\${this.getPanelDisplayName()} panel is already closed\`,
        'panel-already-closed',
        \`\${this.getPanelId()}-panel-already-closed\`
      );
      return;
    }
    
    this.isOpen = false;
    
    this.addOperation({
      type: 'addFacet',
      facet: {
        id: \`scope-\${this.getPanelScope()}\`,
        type: 'scope-change',
        scope: [this.getPanelScope()],
        state: { active: false }
      }
    });
    
    this.addEvent(
      \`\${this.getPanelDisplayName()} panel closed\`,
      'panel-closed',
      \`\${this.getPanelId()}-panel-closed\`,
      { panelId: this.getPanelId() }
    );
    
    await this.onPanelClosed();
    this.reactivateAgent('Panel closed');
  }
  
  private reactivateAgent(reason: string): void {
    const space = this.element.findSpace();
    if (!space) return;
    
    const activeStream = (space as any).getActiveStream?.();
    space.emit({
      topic: 'agent:activate',
      source: this.element.getRef(),
      payload: {
        streamId: activeStream?.streamId || 'default-stream',
        reason,
        priority: 'normal',
        metadata: {
          trigger: 'control-panel-toggle',
          panelId: this.getPanelId()
        }
      },
      timestamp: Date.now()
    });
  }
  
  protected registerPanelTool(
    name: string,
    handler: (params?: any) => Promise<void>,
    instructions: string,
    config?: {
      description?: string;
      params?: any;
      category?: string;
    }
  ): void {
    this.registerActionWithInstructions(
      name,
      handler,
      instructions,
      {
        ...config,
        scope: [this.getPanelScope()],
        category: config?.category || this.getPanelId()
      }
    );
  }
}
`;

/**
 * Example: Discord Control Panel using the pattern
 */
export const DISCORD_CONTROL_PANEL_EXAMPLE = `
export function createModule(env: IAxonEnvironmentV2) {
  const { InteractiveComponent, persistent, external } = env;
  
  // Copy ControlPanelBase from pattern
  abstract class ControlPanelBase extends InteractiveComponent {
    // ... (paste CONTROL_PANEL_PATTERN code)
  }
  
  class DiscordControlPanelComponent extends ControlPanelBase {
    protected getPanelId() { return 'discord-control'; }
    protected getPanelDisplayName() { return 'Discord Control'; }
    
    async onMount() {
      await super.onMount();  // Registers open/close
      
      // All tools auto-scoped to panel
      this.registerPanelTool(
        'listServers',
        async () => { await this.listGuilds(); },
        'List Discord servers: @discord-control.listServers',
        { description: 'Lists all Discord servers the bot has access to' }
      );
      
      this.registerPanelTool(
        'joinChannel',
        async (params) => { await this.joinChannel(params); },
        'Join channel: @discord-control.joinChannel(channelName="general")',
        {
          description: 'Join a Discord channel',
          params: { channelName: { type: 'string', required: true } }
        }
      );
      
      // ... more tools
    }
    
    protected async onPanelOpened() {
      // Optional: fetch server list
    }
    
    protected async onPanelClosed() {
      // Optional: cleanup
    }
    
    // ... rest of implementation
  }
  
  return { component: DiscordControlPanelComponent };
}
`;


