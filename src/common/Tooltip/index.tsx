import React from "react";
import MuiTooltip, {TooltipProps as MuiTooltipProps, tooltipClasses} from "@mui/material/Tooltip";
import {styled} from "@mui/material/styles";
import {useTheme} from "@common/theme";

export type TooltipProps = MuiTooltipProps;

export const Tooltip = styled(({className, ...props}: TooltipProps) => (
    <MuiTooltip {...props} arrow classes={{popper: className}} />
))(() => {
    const theme = useTheme();

    return {
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.black
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.black
        }
    };
});
