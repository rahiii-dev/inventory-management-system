import { Box, Card, CardActionArea, CardContent, Typography, Grid2 } from "@mui/material";
import { Inventory2, People, PointOfSale, BarChart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";

const dashboardItems = [
  { title: "Inventory", icon: <Inventory2 fontSize="large" />, path: "/inventory" },
  { title: "Customers", icon: <People fontSize="large" />, path: "/customers" },
  { title: "Sales", icon: <PointOfSale fontSize="large" />, path: "/sales" },
  { title: "Reports", icon: <BarChart fontSize="large" />, path: "/reports" },
];

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box p={3}>
      <PageTitle text="Dashboard Overview" />

      <Grid2 container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid2 size={{xs: 12, sm: 6, md: 3}}  key={item.title}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardActionArea onClick={() => navigate(item.path)}>
                <CardContent>
                  {item.icon}
                  <Typography variant="h6" mt={1}>
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default DashboardPage;
