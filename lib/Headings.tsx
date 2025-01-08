import { clsx } from "clsx";

export type HeadingProps = {
    as?: "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    dark?: boolean;
  } & React.ComponentPropsWithoutRef<
    "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  >;
  
  export function Heading({
    className,
    as: Element = "h2",
    dark = false,
    ...props
  }: HeadingProps) {
    return (
      <Element
        {...props}
        data-dark={dark ? "true" : undefined}
        className={clsx(
          className,
          "text-pretty text-4xl text-center font-medium tracking-tighter text-gray-950 data-[dark]:text-white sm:text-6xl"
        )}
      />
    );
  }
  
  export function Subheading({
    className,
    as: Element = "h2",
    dark = false,
    ...props
  }: HeadingProps) {
    return (
      <Element
        {...props}
        data-dark={dark ? "true" : undefined}
        className={clsx(
          className,
          "font-mono text-xs/5 font-semibold text-center uppercase tracking-widest text-gray-500 data-[dark]:text-gray-400"
        )}
      />
    );
  }