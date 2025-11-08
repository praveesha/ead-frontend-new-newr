import React from "react";
import { Box, Container, Typography, Link, Stack } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ width: "100%", bgcolor: "var(--color-bg-footer)" }}>
      <Box component="section" id="contact">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            {/* About AutoCare Pro */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600,color: "var(--color-text-primary)" }}
              >
                About AutoCare Pro
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.6,
                  fontSize: "0.875rem",
                  color: "var(--color-text-primary)",
                }}
              >
                Leading automobile service management platform providing
                excellence in vehicle care since 2020.
              </Typography>
            </Box>

            {/* Services */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600,color: "var(--color-text-primary)" }}>
                Services
              </Typography>
              <Stack spacing={1}>
                <Link href="/services/maintenance" underline="none"  sx={{ color: "var(--color-text-primary)" }}>
                  Regular Maintenance
                </Link>
                <Link href="/services/repairs" underline="none"  sx={{ color: "var(--color-text-primary)" }}>
                  Repairs & Diagnostics
                </Link>
                <Link href="/services/modifications" underline="none"  sx={{ color: "var(--color-text-primary)" }}>
                  Custom Modifications
                </Link>
                <Link href="/services/emergency" underline="none" sx={{ color: "var(--color-text-primary)" }}>
                  Emergency Service
                </Link>
              </Stack>
            </Box>

            {/* Quick Links */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600,color: "var(--color-text-primary)" }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link href="/book-service" underline="none"  sx={{ color: "var(--color-text-primary)" }}>
                  Book Service
                </Link>
                <Link href="/login" underline="none" sx={{ color: "var(--color-text-primary)" }}>
                  Customer Login
                </Link>
                <Link href="/signup" underline="none" sx={{ color: "var(--color-text-primary)" }}>
                  Sign Up
                </Link>
                <Link href="/about" underline="none" sx={{ color: "var(--color-text-primary)" }}>
                  About Us
                </Link>
              </Stack>
            </Box>

            {/* Contact */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600,color: "var(--color-text-primary)" }}>
                Contact
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ fontSize: "0.875rem",color: "var(--color-text-primary)" }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Email:
                  </Box>{" "}
                  <Link href="mailto:info@autocarepro.com" underline="none"  sx={{ color: "var(--color-text-primary)" }}>
                    info@autocarepro.com
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.875rem",color: "var(--color-text-primary)" }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Phone:
                  </Box>{" "}
                  <Link href="tel:+15551234567" underline="none"  sx={{ color: "var(--color-text-primary)" }}>
                    (555) 123-4567
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.875rem",color: "var(--color-text-primary)" }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Address:
                  </Box> 123 Auto Lane
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.875rem",color: "var(--color-text-primary)" }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Hours:
                  </Box> Mon-Sat 8AM-6PM
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ pt: "12px", pb: "12px", bgcolor: "var(--color-primary)" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ fontSize: "0.875rem" }}>
            © 2025 AutoCare Pro. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;
