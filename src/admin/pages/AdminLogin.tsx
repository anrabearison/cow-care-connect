import React from 'react';
import { Login, LoginForm } from 'react-admin';
import { Box, Typography, Card, CardContent } from '@mui/material';

export const AdminLogin = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundImage: 'url(https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Left side - Demo credentials */}
            <Box
                sx={{
                    width: { xs: '100%', md: '40%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                }}
            >
                <Card sx={{ maxWidth: 400, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom align="center" color="primary">
                            Comptes de Démonstration
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                            Utilisez l'un de ces comptes pour tester l'application
                        </Typography>

                        <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                Super Admin
                            </Typography>
                            <Typography variant="body2">📧 admin@ombiko.mg</Typography>
                            <Typography variant="body2">🔑 admin123</Typography>
                        </Box>

                        <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                Admin Propriétaire
                            </Typography>
                            <Typography variant="body2">📧 jean@ombiko.mg</Typography>
                            <Typography variant="body2">🔑 eleveur123</Typography>
                        </Box>

                        <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                Utilisateur Propriétaire
                            </Typography>
                            <Typography variant="body2">📧 employee@ombiko.mg</Typography>
                            <Typography variant="body2">🔑 user123</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Right side - Login form */}
            <Box
                sx={{
                    width: { xs: '100%', md: '60%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Login />
            </Box>
        </Box>
    );
};
