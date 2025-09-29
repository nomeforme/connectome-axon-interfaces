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
- **VEIL**: `Facet`, `VEILDelta`, `IVEILComponent`, `IInteractiveComponent` - facet-based VEIL state
- **Persistence**: `IPersistentMetadata`, `IExternalMetadata` - persistence decorators
- **Manifest**: `IAxonManifest`, `IAxonEnvironment` - component loading and runtime

## VEIL Facet Architecture

The VEIL interfaces now reflect the aspect-based facet model used across Connectome:

- Facets declare explicit aspects (content, state, stream, agent, scope, etc.) rather than generic `attributes`
- Deltas (`VEILDelta`) replace legacy "operations" and are limited to `addFacet`, `changeFacet`, and `removeFacet`
- Component helpers (`addFacet`, `addAmbient`, `changeState`, etc.) emit data that satisfies the new aspect requirements
- Frames (`IVEILFrame`) surface `deltas`, `events`, and transition details so hosts can reconcile VEIL state accurately

See the exported types in `src/veil.ts` for the full facet taxonomy and type guards like `hasContentAspect`.

## Architecture

This package enables clean separation between:
- **Connectome Core**: Imports these interfaces to manage components
- **AXON Components**: Import these interfaces to implement functionality
- **No Circular Dependencies**: Both sides depend on this neutral package

## License

MIT
