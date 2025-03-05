import { Typography, Box } from "@mui/material";

interface PageTitleProps {
  text: string;
  subtitle?: string;
  mb?: number; 
}

const PageTitle = ({ text, subtitle, mb = 3 }: PageTitleProps) => (
  <Box component="header" mb={mb}>
    <Typography variant="h4" fontWeight="bold">
      {text}
    </Typography>
    {subtitle && (
      <Typography variant="subtitle1" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default PageTitle;
