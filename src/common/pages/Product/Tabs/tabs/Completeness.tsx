import React from "react";
import {Table, TableCell, TableList, TableRow, TableText} from "@common/Table";
import {TabPanel} from "@common/Tabs";
import {useProduct} from "../../Context";

export const CompletenessTabPanel: React.FC = () => {
    const {completeness} = useProduct();

    return (
        <TabPanel name="completeness">
            {completeness.length !== 0 ? (
                <TableList>
                    {completeness.map((set) => (
                        <Table key={set.id} label={set.name}>
                            {set.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell width="55%">
                                        <TableText>{item.name}</TableText>
                                    </TableCell>
                                    <TableCell>
                                        <TableText bold>{item.size}</TableText>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </Table>
                    ))}
                </TableList>
            ) : null}
        </TabPanel>
    );
};
