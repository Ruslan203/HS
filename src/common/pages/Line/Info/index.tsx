import React, {useState} from "react";
import styled from "styled-components";
import {Link} from "@common/Link";
import {
    ProfileAvatar,
    ProfileDetail,
    ProfileDetails,
    ProfileName,
    ProfileRating,
    ProfileRatingPoints,
    ProfileRatingVotes,
    ProfileSidebar,
    ProfileTag,
    ProfileTags
} from "@common/ProfileSidebar";
import {useApi} from "@common/api";
import {useLine} from "../Context";

export const LineInfoStyled = styled(ProfileSidebar)`
    @media (max-width: 1100px) {
        max-width: 100%;
    }
`;

export const LineInfo: React.FC = () => {
    const api = useApi();
    const {brand, line, brandName, serias, stars, sold} = useLine();
    const [avatarError, setAvatarError] = useState<boolean>(false);

    const lineName: string = [brandName, line.name].join(" ");

    return (
        <LineInfoStyled>
            {!avatarError ? (
                <ProfileAvatar
                    src={api.url(brand.logo)}
                    width={128}
                    height={128}
                    alt={lineName}
                    title={lineName}
                    priority
                    onError={setAvatarError.bind(null, true)}
                />
            ) : null}
            <ProfileName>{lineName}</ProfileName>
            {stars ? (
                <ProfileRating>
                    <ProfileRatingPoints>{stars}</ProfileRatingPoints>
                    {sold ? <ProfileRatingVotes>({sold})</ProfileRatingVotes> : null}
                </ProfileRating>
            ) : null}
            {serias.length > 0 ? (
                <ProfileDetails>
                    <ProfileDetail label="КОЛЛЕКЦИЯ">
                        <ProfileTags>
                            {serias.map((seria) => (
                                <ProfileTag key={seria.id} as={Link} href={seria.url}>
                                    {seria.name}
                                </ProfileTag>
                            ))}
                        </ProfileTags>
                    </ProfileDetail>
                </ProfileDetails>
            ) : null}
        </LineInfoStyled>
    );
};
