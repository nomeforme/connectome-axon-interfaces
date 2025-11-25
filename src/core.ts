/**
 * Core Component Interfaces
 * 
 * Defines the fundamental component, element, and space interfaces
 */

import { ISpaceEvent, IElementRef } from './events';

export interface IComponent {
  onMount?(): void | Promise<void>;
  onUnmount?(): void | Promise<void>;
  handleEvent?(event: ISpaceEvent): void | Promise<void>;
  handleAction?(action: string, params?: any): Promise<void>;

  readonly space?: ISpace;
  readonly id?: string;
  
  subscribe(topic: string): void;
  emit(event: Omit<ISpaceEvent, 'source'>): void;
}

export interface ISpace {
  emit(event: Omit<ISpaceEvent, 'source'>): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  veilState?: any; // Optional VEIL state access
  getVEILState?(): any; // Optional VEIL state getter
}
