import React from "react";
import Image from "next/image";
import styled from "styled-components";
import {Text} from "@common/Text";
import {Title} from "@common/Title";
import starIcon from "@common/icons/assets/star.svg";

export const ProfileSidebar = styled.aside`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #f4f4f3;
    padding: 30px;
    border-radius: 8px;
    width: 100%;
    max-width: 255px;
`;

export const ProfileAvatar = styled(Image)`
    display: inline-flex;
    width: 128px;
    height: 128px;
    border-radius: 64px;
    margin: auto;
    object-fit: contain;
`;

export const ProfileName = styled(Title)`
    display: block;
    width: 100%;
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    margin-top: 16px;
    :first-child {
        margin-top: 0px;
    }
`;

export const ProfileRating = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 10px;
`;

export const ProfileRatingPoints = styled(Text)`
    display: inline-flex;
    font: bold 16px ${({theme}) => theme.fonts.roboto};
    &:after {
        display: inline-flex;
        width: 14px;
        height: 16px;
        background-image: url(${starIcon.src});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-left: 7px;
        content: "";
    }
`;

export const ProfileRatingVotes = styled(Text)`
    font: normal 16px ${({theme}) => theme.fonts.roboto};
    color: #a7a59e;
`;

export const ProfileDetailStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`;

export const ProfileDetailLabel = styled(Text)`
    text-transform: uppercase;
    color: #a7a59e;
    font: 500 11px ${({theme}) => theme.fonts.roboto};
    letter-spacing: 0.5px;
`;

export const ProfileDetailContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export interface ProfileDetailProps extends React.PropsWithChildren {
    label: string;
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({label, children}) => (
    <ProfileDetailStyled>
        <ProfileDetailLabel>{label}</ProfileDetailLabel>
        <ProfileDetailContent>{children}</ProfileDetailContent>
    </ProfileDetailStyled>
);

export const ProfileTags = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

export const ProfileTag = styled.button`
    display: inline-flex;
    border: none;
    border-radius: 8px;
    font: normal 14px ${({theme}) => theme.fonts.roboto};
    padding: 8px 12px;
    background: ${({theme}) => theme.palette.white};
    color: ${({theme}) => theme.palette.black};
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    text-decoration: none;
`;

export const ProfileText = styled(Text)``;

export * from "./Details";
