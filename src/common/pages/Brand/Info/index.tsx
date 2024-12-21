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
import {useBrand} from "../Context";

export const BrandInfoStyled = styled(ProfileSidebar)`
    @media (max-width: 1100px) {
        max-width: 100%;
    }
    @media (max-width: ${({theme}) => theme.mobile.screenMaxWidth}) {
        margin-top: 40px;
    }
`;

export const BrandInfo: React.FC = () => {
    const api = useApi();
    const {brand, brandName, stars, sold, series, lines} = useBrand();
    const [avatarError, setAvatarError] = useState<boolean>(false);

    return (
        <BrandInfoStyled>
            {!avatarError ? (
                <ProfileAvatar
                    src={api.url(brand.logo)}
                    width={128}
                    height={128}
                    alt={brandName}
                    title={brandName}
                    priority
                    onError={setAvatarError.bind(null, true)}
                />
            ) : null}
            <ProfileName>{brandName}</ProfileName>
            {stars ? (
                <ProfileRating>
                    <ProfileRatingPoints>{stars}</ProfileRatingPoints>
                    {sold ? <ProfileRatingVotes>({sold})</ProfileRatingVotes> : null}
                </ProfileRating>
            ) : null}
            <ProfileDetails>
                {lines.length ? (
                    lines.map((line) => (
                        <ProfileDetail key={line.id} label={`ЛИНИЯ ${line.name}`}>
                            <ProfileTags>
                                {line.series.map((seria) => (
                                    <ProfileTag key={seria.id} as={Link} href={seria.url} shallow>
                                        {seria.name}
                                    </ProfileTag>
                                ))}
                            </ProfileTags>
                        </ProfileDetail>
                    ))
                ) : series.length ? (
                    <ProfileDetail label="КОЛЛЕКЦИЯ">
                        <ProfileTags>
                            {series.map((seria) => (
                                <ProfileTag key={seria.id} as={Link} href={seria.url} shallow>
                                    {seria.name}
                                </ProfileTag>
                            ))}
                        </ProfileTags>
                    </ProfileDetail>
                ) : null}
            </ProfileDetails>
        </BrandInfoStyled>
    );
};
