import React from "react";
import MuiSkeleton, {SkeletonProps as MuiSkeletonProps} from "@mui/material/Skeleton";

export type SkeletonProps = MuiSkeletonProps;

export const Skeleton: React.FC<SkeletonProps> = (props) => (
    <MuiSkeleton {...props} style={{cursor: "progress"}} />
);
