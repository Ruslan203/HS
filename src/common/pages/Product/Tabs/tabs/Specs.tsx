import React, {useCallback, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import {Table, TableCell, TableLink, TableRow, TableText} from "@common/Table";
import {TabPanel} from "@common/Tabs";
import {Text} from "@common/Text";
import {useApi} from "@common/api";
import {useProduct} from "../../Context";

export const SpecsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    column-gap: 30px;
    row-gap: 60px;
    width: 100%;
    @media (max-width: 1100px) {
        flex-direction: column;
        justify-content: flex-start;
    }
`;

export const Company = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-decoration: none;
    gap: 10px;
`;

export const CompanyImage = styled(Image)`
    object-fit: contain;
`;

export const CompanyText = styled(Text)`
    font-size: 16px;
`;

export const SpecsTabPanel: React.FC = () => {
    const api = useApi();
    const {specs, brand} = useProduct();

    const [companyImageHidden, setCompanyImageHidden] = useState(false);
    const handleCompanyImageError = useCallback(() => {
        setCompanyImageHidden(true);
    }, []);

    return (
        <TabPanel name="specs">
            <SpecsContainer>
                <Table label="Характеристики">
                    {specs.map((spec) => {
                        return (
                            <TableRow key={spec.id}>
                                <TableCell>
                                    <TableText>{spec.name}</TableText>
                                </TableCell>
                                <TableCell>
                                    <TableText bold>
                                        {spec.items
                                            .map<React.ReactNode>((item) => {
                                                if (item.pageUrl !== null) {
                                                    return (
                                                        <TableLink
                                                            key={item.id}
                                                            href={item.pageUrl}
                                                        >
                                                            {item.name}
                                                        </TableLink>
                                                    );
                                                } else {
                                                    return item.name;
                                                }
                                            })
                                            .reduce((prev, current) => [prev, ", ", current])}
                                    </TableText>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </Table>
                {brand ? (
                    <Company href={brand.url}>
                        {brand.logo ? (
                            <CompanyImage
                                src={api.url(brand.logo)}
                                width={100}
                                height={100}
                                alt={`Все товары ${brand.name}`}
                                hidden={companyImageHidden}
                                onError={handleCompanyImageError}
                            />
                        ) : null}
                        <CompanyText>{`Все товары ${brand.name}`}</CompanyText>
                    </Company>
                ) : null}
            </SpecsContainer>
        </TabPanel>
    );
};
