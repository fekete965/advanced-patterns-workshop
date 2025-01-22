declare module "fake-animation-lib" {
  export type AnimationState =
    | "before-animation"
    | "animating"
    | "after-animation";

  export function getAnimatingState(): AnimationState;
}
