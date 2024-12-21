import MuiCircularProgress, {
    CircularProgressProps as MuiCircularProgressProps
} from "@mui/material/CircularProgress";
import {styled} from "@mui/material/styles";
import {useTheme} from "@common/theme";

export type CircularProgressProps = MuiCircularProgressProps;

export const CircularProgress = styled(MuiCircularProgress)(() => {
    const theme = useTheme();

    return {
        cursor: "progress",
        color: theme.palette.primary
    };
});
