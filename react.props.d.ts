import { PropTypes } from 'prop-types';

declare module 'react' {
  interface React {
    PropTypes: typeof PropTypes;
  }
}