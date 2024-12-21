import React from "react";
import styled from "styled-components";
import {Container} from "@common/Container";
import {Page} from "@common/Page";
import {Section} from "@common/Section";
import {GetUserOrdersResult} from "@common/api";
import {ProfileProvider} from "./Context";
import {ProfileOrders} from "./Orders";
import {ProfileSidebar} from "./Sidebar";

export const ProfileSection = styled(Section)`
    padding: 30px 0px;
    > ${Container} {
        display: flex;
        align-items: flex-start;
        gap: 30px;
        @media (max-width: 1100px) {
            flex-direction: column;
            align-items: center;
        }
    }
`;

export interface ProfilePageProps {
    orders?: GetUserOrdersResult;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({orders}) => {
    if (!orders) {
        return null;
    }

    return (
        <ProfileProvider orders={orders}>
            <Page title="Профиль">
                <ProfileSection fullHeight>
                    <ProfileSidebar />
                    <ProfileOrders />
                </ProfileSection>
            </Page>
        </ProfileProvider>
    );
};

export * from "./Context";
