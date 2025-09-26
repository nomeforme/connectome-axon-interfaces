/**
 * Event System Interfaces
 * 
 * Defines the core event system used by AXON components
 */

export interface IElementRef {
  elementId: string;
  elementPath: string[];
  elementType: string;
}

export interface ISpaceEvent<T = unknown> {
  topic: string;
  source: IElementRef;
  payload: T;
  timestamp: number;
  priority?: 'immediate' | 'high' | 'normal' | 'low' | 'deferred';
  metadata?: Record<string, any>;
}
