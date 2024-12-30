declare module 'react-csv' {
  import { ComponentType, RefObject } from 'react';

  export interface CSVLinkProps {
    data: any;
    headers?: any;
    filename?: string;
    separator?: string;
    target?: string;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    ref?: RefObject<HTMLAnchorElement> | ((instance: HTMLAnchorElement | null) => void);
  }

  export const CSVLink: ComponentType<CSVLinkProps>;
}

