import * as React from 'react';
import { useState } from 'react';
import { Menu as RAMenu, MenuItemLink, usePermissions } from 'react-admin';
import { Box } from '@mui/material';
import SubMenu from './SubMenu';
import {
    Agriculture,
    Category,
    Event,
    EventNote,
    Flag,
    Healing,
    MedicalServices,
    Medication,
    People,
    Psychology,
    Business,
    MenuBook,
    Assignment,
    Dashboard as DashboardIcon,
    Settings,
    AdminPanelSettings
} from '@mui/icons-material';
import { isSuperAdmin } from '@/constants/roles';

export const Menu = (props: any) => {
    const { permissions } = usePermissions();
    const [state, setState] = useState({
        menuMain: false,
        menuHealth: false,
        menuAdmin: false,
        menuConfig: false,
    });

    const handleToggle = (menu: string) => {
        setState(state => ({
            menuMain: false,
            menuHealth: false,
            menuAdmin: false,
            menuConfig: false,
            [menu]: !state[menu as keyof typeof state],
        }));
    };

    return (
        <Box
            sx={{
                width: '100%',
                '& .MuiMenuItem-root': {
                    color: 'text.secondary',
                    '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'action.hover',
                    },
                    '&.Mui-selected': {
                        color: 'primary.main',
                        backgroundColor: 'action.selected',
                        '&:hover': {
                            backgroundColor: 'action.selected',
                        },
                    },
                },
                '& .MuiListItemIcon-root': {
                    color: 'inherit',
                    minWidth: 40,
                },
                '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    fontSize: '0.875rem',
                },
            }}
            {...props}
        >
            <MenuItemLink
                to="/admin"
                primaryText="Tableau de bord"
                leftIcon={<DashboardIcon />}
            />

            <SubMenu
                handleToggle={() => handleToggle('menuMain')}
                isOpen={state.menuMain}
                name="Gestion Principale"
                icon={<Agriculture />}
            >
                <MenuItemLink
                    to="/admin/cattle"
                    primaryText="Bovins"
                    leftIcon={<Agriculture />}
                />
                <MenuItemLink
                    to="/admin/herd-books"
                    primaryText="Livres de troupeau"
                    leftIcon={<MenuBook />}
                />
                <MenuItemLink
                    to="/admin/herd-book-cattle"
                    primaryText="Inscriptions bovins"
                    leftIcon={<Assignment />}
                />
            </SubMenu>

            <SubMenu
                handleToggle={() => handleToggle('menuHealth')}
                isOpen={state.menuHealth}
                name="Santé & Événements"
                icon={<Healing />}
            >
                <MenuItemLink
                    to="/admin/events"
                    primaryText="Événements"
                    leftIcon={<Event />}
                />
                <MenuItemLink
                    to="/admin/treatments"
                    primaryText="Traitements"
                    leftIcon={<Healing />}
                />
            </SubMenu>

            <SubMenu
                handleToggle={() => handleToggle('menuAdmin')}
                isOpen={state.menuAdmin}
                name="Administration"
                icon={<AdminPanelSettings />}
            >
                <MenuItemLink
                    to="/admin/users"
                    primaryText="Utilisateurs"
                    leftIcon={<People />}
                />
                {isSuperAdmin(permissions) && (
                    <MenuItemLink
                        to="/admin/owners"
                        primaryText="Propriétaires"
                        leftIcon={<Business />}
                    />
                )}
                <MenuItemLink
                    to="/admin/veterinarians"
                    primaryText="Intervenants"
                    leftIcon={<MedicalServices />}
                />
            </SubMenu>

            <SubMenu
                handleToggle={() => handleToggle('menuConfig')}
                isOpen={state.menuConfig}
                name="Configuration"
                icon={<Settings />}
            >
                <MenuItemLink
                    to="/admin/medicaments"
                    primaryText="Médicaments"
                    leftIcon={<Medication />}
                />
                <MenuItemLink
                    to="/admin/typeEvenements"
                    primaryText="Types d'événements"
                    leftIcon={<EventNote />}
                />
                <MenuItemLink
                    to="/admin/categories"
                    primaryText="Catégories"
                    leftIcon={<Category />}
                />
                <MenuItemLink
                    to="/admin/status"
                    primaryText="Statuts"
                    leftIcon={<Flag />}
                />
                <MenuItemLink
                    to="/admin/characters"
                    primaryText="Caractères"
                    leftIcon={<Psychology />}
                />
            </SubMenu>
        </Box>
    );
};
