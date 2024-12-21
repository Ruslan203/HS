import React, {useMemo} from "react";
import styled from "styled-components";
import {
    ProfileSidebar as CommonProfileSidebar,
    ProfileAvatar,
    ProfileDetail,
    ProfileDetails,
    ProfileName,
    ProfileText
} from "@common/ProfileSidebar";
import {useApi} from "@common/api";
import {useAuth} from "@common/auth";
import userDefaultAvatar from "./assets/user-default-avatar.jpg";

export const ProfileSidebarStyled = styled(CommonProfileSidebar)`
    @media (max-width: 1100px) {
        max-width: 500px;
    }
`;

export const ProfileSidebar: React.FC = () => {
    const api = useApi();
    const {userInfo} = useAuth();

    const fullName = useMemo<string | null>(() => {
        if (userInfo !== false) {
            return api.user.utils.getFullName({info: userInfo});
        } else {
            return null;
        }
    }, [api, userInfo]);
    const phone = useMemo<string | null>(() => {
        if (userInfo !== false) {
            return api.user.utils.getPhone({info: userInfo});
        } else {
            return null;
        }
    }, [api, userInfo]);

    if (userInfo === false) {
        return null;
    }

    const {email, address} = userInfo;

    return (
        <ProfileSidebarStyled>
            <ProfileAvatar
                src={userDefaultAvatar}
                width={128}
                height={128}
                alt=""
                title=""
                priority
            />
            {fullName ? <ProfileName>{fullName}</ProfileName> : null}
            <ProfileDetails>
                {phone ? (
                    <ProfileDetail label="Телефон">
                        <ProfileText>{phone}</ProfileText>
                    </ProfileDetail>
                ) : null}
                {email ? (
                    <ProfileDetail label="E-mail">
                        <ProfileText>{email}</ProfileText>
                    </ProfileDetail>
                ) : null}
                {address ? (
                    <ProfileDetail label="Адрес">
                        <ProfileText>{address}</ProfileText>
                    </ProfileDetail>
                ) : null}
            </ProfileDetails>
        </ProfileSidebarStyled>
    );
};
