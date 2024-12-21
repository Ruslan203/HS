import React, {useState} from "react";
import styled, {css} from "styled-components";
import {Button} from "@common/Button";

export const ProfileDetailsStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-top: 20px;
    width: 100%;
`;

export const ProfileDetailsContent = styled.div<{$hidden: boolean}>`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        ${({$hidden}) =>
            $hidden &&
            css`
                display: none;
            `}
    }
`;

export const ProfileDetailsShowAllButton = styled(Button)<{$hidden: boolean}>`
    ${({$hidden}) =>
        $hidden &&
        css`
            display: none;
        `}
    @media not (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        display: none;
    }
`;

export const ProfileDetails: React.FC<React.ComponentProps<typeof ProfileDetailsStyled>> = ({
    children,
    ...props
}) => {
    const [showedAll, setShowedAll] = useState(false);

    return (
        <ProfileDetailsStyled {...props}>
            <ProfileDetailsContent $hidden={!showedAll}>{children}</ProfileDetailsContent>
            <ProfileDetailsShowAllButton
                variant="text"
                fullWidth
                $hidden={showedAll}
                onClick={setShowedAll.bind(null, true)}
            >
                Показать информацию
            </ProfileDetailsShowAllButton>
        </ProfileDetailsStyled>
    );
};
