import React, {useState} from "react";
import styled from "styled-components";
import {
    ProfileAvatar,
    ProfileName,
    ProfileRating,
    ProfileRatingPoints,
    ProfileRatingVotes,
    ProfileSidebar
} from "@common/ProfileSidebar";
import {useApi} from "@common/api";
import {useSeria} from "../Context";

export const SeriaInfoStyled = styled(ProfileSidebar)`
    @media (max-width: 1100px) {
        max-width: 100%;
    }
`;

export const SeriaInfo: React.FC = () => {
    const api = useApi();
    const {seria, brand, brandName, stars, sold} = useSeria();
    const [avatarError, setAvatarError] = useState<boolean>(false);

    const seriaName: string = [brandName, seria.name].join(" ");

    return (
        <SeriaInfoStyled>
            {!avatarError ? (
                <ProfileAvatar
                    src={api.url(brand.logo)}
                    width={128}
                    height={128}
                    alt={seriaName}
                    title={seriaName}
                    priority
                    onError={setAvatarError.bind(null, true)}
                />
            ) : null}
            <ProfileName>{seriaName}</ProfileName>
            {stars ? (
                <ProfileRating>
                    <ProfileRatingPoints>{stars}</ProfileRatingPoints>
                    {sold ? <ProfileRatingVotes>({sold})</ProfileRatingVotes> : null}
                </ProfileRating>
            ) : null}
        </SeriaInfoStyled>
    );
};
