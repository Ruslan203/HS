import React from "react";
import Link from "next/link";
import styled from "styled-components";
import {Text} from "@common/Text";
import {Title} from "@common/Title";

export const TableContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

export const TableList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    > ${TableContainer} {
        &:not(:first-child) {
            margin-top: 30px;
        }
    }
`;

export const TableStyled = styled.table`
    border-spacing: 0px;
    width: 100%;
    max-width: 825px;
`;

export const TableBody = styled.tbody``;

export const TableCell = styled.td`
    border-bottom: 1px solid ${({theme}) => theme.palette.dividers};
    padding: 20px 0px;
    padding-right: 20px;
`;

export const TableRow = styled.tr`
    &:first-child {
        > ${TableCell} {
            border-top: 1px solid ${({theme}) => theme.palette.dividers};
        }
    }
`;

export const TableText = styled(Text)`
    font-size: 16px;
`;

export const TableLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

export const TableLabel = styled(Title)`
    margin-bottom: 30px;
`;

export interface TableProps extends React.PropsWithChildren {
    label?: string;
    disableBody?: boolean;
}

export const Table: React.FC<TableProps> = ({label, disableBody = false, children}) => (
    <TableContainer>
        {label ? <TableLabel>{label}</TableLabel> : null}
        <TableStyled>{!disableBody ? <TableBody>{children}</TableBody> : null}</TableStyled>
    </TableContainer>
);
