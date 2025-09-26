# @connectome/axon-interfaces

Shared TypeScript interfaces for Connectome AXON components.

## Overview

This package provides the contract between AXON components and the Connectome framework. It contains all the interfaces that AXON components need to implement and use, without any concrete implementations.

## Installation

```bash
npm install @connectome/axon-interfaces
```

## Usage

```typescript
import { 
  IInteractiveComponent, 
  ISpaceEvent, 
  IAxonEnvironment 
} from '@connectome/axon-interfaces';

export function createModule(env: IAxonEnvironment) {
  class MyComponent extends env.InteractiveComponent {
    // Your component implementation
  }
  
  return MyComponent;
}
```

## Interface Categories

- **Core**: `IComponent`, `IElement`, `ISpace` - fundamental building blocks
- **Events**: `ISpaceEvent`, `IElementRef` - event system interfaces  
- **VEIL**: `IVEILComponent`, `IInteractiveComponent` - VEIL state management
- **Persistence**: `IPersistentMetadata`, `IExternalMetadata` - persistence decorators
- **Manifest**: `IAxonManifest`, `IAxonEnvironment` - component loading and runtime

## Architecture

This package enables clean separation between:
- **Connectome Core**: Imports these interfaces to manage components
- **AXON Components**: Import these interfaces to implement functionality
- **No Circular Dependencies**: Both sides depend on this neutral package

## License

MIT
