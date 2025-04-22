// DefaultComponent.tsx
// This file contains the Default component, used as a fallback to gracefully handle errors when a component cannot be loaded.
// Author: Thomas Gascoyne
import React from 'react';

const DefaultComponent: React.FC<any> = (props) => {
  return (
    <div>
      <h1>Error: Component Not Found</h1>
      <p>The requested component could not be loaded.</p>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default DefaultComponent;