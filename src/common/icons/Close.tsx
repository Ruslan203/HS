import React from "react";

export const CloseIcon: React.FC = React.memo(() => (
    <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z" />
    </svg>
));

CloseIcon.displayName = "CloseIcon";
