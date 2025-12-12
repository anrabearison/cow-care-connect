import * as React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Tooltip } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslate, useSidebarState } from 'react-admin';

interface SubMenuProps {
    dense?: boolean;
    handleToggle: () => void;
    icon: React.ReactElement;
    isOpen: boolean;
    name: string;
    children: React.ReactNode;
}

const SubMenu = (props: SubMenuProps) => {
    const { handleToggle, isOpen, name, icon, children, dense = false } = props;
    const translate = useTranslate();
    const [open] = useSidebarState();

    const header = (
        <ListItemButton
            dense={dense}
            onClick={handleToggle}
            sx={{
                paddingLeft: '1rem',
                color: 'text.secondary',
                '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'action.hover',
                },
            }}
        >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {icon}
            </ListItemIcon>
            <ListItemText
                primary={translate(name)}
                primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500,
                }}
            />
            {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
    );

    return (
        <React.Fragment>
            {open ? (
                header
            ) : (
                <Tooltip title={translate(name)} placement="right">
                    {header}
                </Tooltip>
            )}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        '& .MuiMenuItem-root': {
                            paddingLeft: 4,
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: 40,
                        },
                    }}
                >
                    {children}
                </List>
            </Collapse>
        </React.Fragment>
    );
};

export default SubMenu;
