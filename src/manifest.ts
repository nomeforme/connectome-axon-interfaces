/**
 * AXON Manifest and Environment Interfaces
 * 
 * Defines interfaces for AXON component loading and runtime environment
 */

import { IComponent } from './core';
import { IVEILComponent, IInteractiveComponent } from './veil';
import { IPersistentMetadata, IExternalMetadata } from './persistence';
import { ISpaceEvent } from './events';

export interface IAxonComponentConstructor {
  new(): IInteractiveComponent;
  actions?: Record<string, string | { description: string; params?: any }>;
  persistentProperties?: IPersistentMetadata[];
  externalResources?: IExternalMetadata[];
}

export interface IAxonEnvironment {
  // Component base classes
  Component: abstract new() => IComponent;
  VEILComponent: abstract new() => IVEILComponent;
  InteractiveComponent: abstract new() => IInteractiveComponent;
  ControlPanelComponent: any;
  BaseAfferent: any;

  // Control Panel receptors (built-in components)
  ControlPanelActionsReceptor: any;
  PanelScopeReceptor: any;

  // Decorators (as functions that can be applied)
  persistent: (target: any, propertyKey: string) => void;
  persistable: (version: number) => (target: any) => void;
  external: (resourceId: string) => (target: any, propertyKey: string) => void;

  // Type references
  SpaceEvent: new<T>() => ISpaceEvent<T>;

  // WebSocket (if needed)
  WebSocket?: any;

  // Helper types
  VEILDelta: any;
  FacetDelta: any;
  ReadonlyVEILState: any;
  EffectorResult: any;
  ExternalAction: any;

  // Facet types
  Facet: any;
  EventFacet: any;
  SpeechFacet: any;
  StateFacet: any;
  ThoughtFacet: any;
  ActionFacet: any;

  // Factory functions
  createEventFacet: any;
  createSpeechFacet: any;
  createStateFacet: any;
  createThoughtFacet: any;
  createActionFacet: any;
  createAmbientFacet: any;
  createAgentActivation: any;

  // Helper functions
  hasFacet: (state: any, id: string) => boolean;
  getFacetsByType: (state: any, type: string) => any[];
}

export interface IAxonManifest {
  name: string;
  version: string;
  description?: string;
  main: string;
  componentClass: string;
  extends?: string;
  dependencies?: Array<{
    name: string;
    manifest: string; // URL to dependency manifest
  }>;
  actions?: Record<string, {
    description: string;
    parameters?: Record<string, any>;
  }>;
  config?: Record<string, {
    type: string;
    description?: string;
    required?: boolean;
  }>;
  hotReload?: string;
  hash?: string;
}
