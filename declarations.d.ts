declare module "react-native-size-matters" {
  export function scale(size: number): number;
  export function verticalScale(size: number): number;
  export function moderateScale(size: number, factor?: number): number;
  export function moderateVerticalScale(size: number, factor?: number): number;
  export function s(size: number): number;
  export function vs(size: number): number;
  export function ms(size: number, factor?: number): number;
  export function mvs(size: number, factor?: number): number;
  export const ScaledSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
  };
}

declare module "*.sql" {
  const content: string;
  export default content;
}
