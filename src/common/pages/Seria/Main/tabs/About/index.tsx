import React from "react";
import styled from "styled-components";
import {TabPanel} from "@common/Tabs";
import {Text} from "@common/Text";
import {Title} from "@common/Title";
import {useSeria} from "@common/pages/Seria/Context";

export const AboutText = styled(Text)`
    margin: 20px 0px;
    font-size: 16px;
    line-height: 1.5;
`;

export const AboutTabPanel: React.FC = () => {
    const {seria, brandName} = useSeria();

    return (
        <TabPanel name="about">
            <Title component="h2" variant="h5">
                О коллекции {seria.name} от {brandName}
            </Title>
            <AboutText dangerouslySetInnerHTML={{__html: seria.text}} />
        </TabPanel>
    );
};
