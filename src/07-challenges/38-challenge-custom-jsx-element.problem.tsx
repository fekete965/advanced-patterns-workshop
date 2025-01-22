import React from "react";

/**
 * How do we add a new base element to React's JSX?
 *
 * You'll need to do some detective work: check
 * out JSX.IntrinsicElements.
 *
 * The JSX namespace comes from React - you'll need
 * to check out React's type definitions.
 */

declare global {
  namespace JSX {
    interface CustomElementProps
      extends React.DetailedHTMLProps<
        React.HTMLAttributes<CustomElementProps>,
        CustomElementProps
      > {
      requiredProp: boolean;
    }

    interface IntrinsicElements {
      "custom-element": CustomElementProps;
    }
  }
}

const element = (
  <custom-element requiredProp={false}>hello world</custom-element>
);
