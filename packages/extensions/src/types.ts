export interface LinkAttributes {
  readonly href: string;
  readonly title?: string | null;
}

export interface HeadingAttributes {
  readonly level: 1 | 2 | 3 | 4 | 5 | 6;
}
