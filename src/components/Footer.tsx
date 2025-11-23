export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
            <div className="container mx-auto px-6 py-4">
                <p className="text-center text-sm text-muted-foreground">
                    © {currentYear} Njara Rabearison. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
};
