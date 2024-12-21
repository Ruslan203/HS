import "styled-components";
import {ThemeOptions} from "./types";

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends ThemeOptions {}
}
