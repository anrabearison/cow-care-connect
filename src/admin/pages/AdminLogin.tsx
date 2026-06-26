import React from 'react';
import { LoginForm } from 'react-admin';
import { Box, Typography, Card, CardContent } from '@mui/material';

export const AdminLogin = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'url(https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Overlay sombre */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.52)',
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* Contenu centré */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    width: '100%',
                    maxWidth: 420,
                    px: 2,
                }}
            >
                {/* Logo / Titre */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                            color: '#fff',
                            letterSpacing: '-0.5px',
                            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                            mb: 0.5,
                        }}
                    >
                        🐄 Ombiko
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.75)',
                            fontWeight: 400,
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            fontSize: '0.72rem',
                        }}
                    >
                        Gestion du bétail · Administration
                    </Typography>
                </Box>

                {/* Card avec LoginForm natif React-Admin (sans le wrapper Login qui impose son background) */}
                <Card
                    sx={{
                        width: '100%',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <CardContent sx={{ p: 3, pb: '24px !important' }}>
                        <LoginForm />
                    </CardContent>
                </Card>

                {/* Footer discret */}
                <Typography
                    variant="caption"
                    sx={{
                        color: 'rgba(255,255,255,0.45)',
                        textAlign: 'center',
                        mt: 1,
                    }}
                >
                    © {new Date().getFullYear()} Ombiko — Accès réservé
                </Typography>
            </Box>
        </Box>
    );
};
