/**
 * Persistence System Interfaces
 * 
 * Defines interfaces for the persistence decorator system
 */

export interface IPersistentMetadata {
  propertyKey: string;
  version?: number;
}

export interface IExternalMetadata {
  propertyKey: string;
  resourceId: string;
}

