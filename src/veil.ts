/**
 * VEIL System Interfaces
 * 
 * Defines interfaces for the VEIL state management system
 */

import { IComponent } from './core';

export interface IVEILOperation {
  type: 'addFacet' | 'changeState' | 'changeFacet' | 'removeFacet' | 'speak' | 'action';
  [key: string]: any;
}

export interface IFacet {
  id: string;
  type: 'event' | 'state' | 'ambient' | 'speech' | 'action' | 'thought' | 'defineAction';
  content?: string;
  displayName?: string;
  attributes?: Record<string, any>;
  children?: IFacet[];
}

export interface IVEILFrame {
  operations: IVEILOperation[];
}

export interface IVEILComponent extends IComponent {
  addOperation(operation: IVEILOperation): void;
  trackPropertyChange(propertyName: string, oldValue: any, newValue: any): void;
  setTrackedProperty<K extends keyof any>(key: K, value: any): void;
  addFacet(facetDef: {
    id: string;
    type: 'event' | 'state' | 'ambient' | 'defineAction';
    content?: string;
    displayName?: string;
    scope?: string[];
    attributes?: Record<string, any>;
    children?: IFacet[];
  }): void;
  updateState(facetId: string, updates: {
    content?: string;
    attributes?: Record<string, any>;
  }, updateMode?: 'full' | 'attributesOnly' | 'merge'): void;
}

export interface IInteractiveComponent extends IVEILComponent {
  registerAction(name: string, handler: (params?: any) => Promise<void>): void;
  
  // Helper methods from Component base class (added in API improvements)
  addAmbient(content: string, idOrAttributes?: string | Record<string, any>, attributes?: Record<string, any>): void;
  addState(facetId: string, content: string, attributes?: Record<string, any>): void;
  changeState(facetId: string, updates: { content?: string; attributes?: Record<string, any> }): void;
  addEvent(displayName: string, content: string, idOrAttributes?: string | Record<string, any>, attributes?: Record<string, any>): void;
  inFrame(): boolean;
  requireFrame(): void;
  getVeilState(): any;
  deferToNextFrame(operation: () => void): void;
}
