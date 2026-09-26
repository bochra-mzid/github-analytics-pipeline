import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import { useOverview } from "../hooks/useMetrics";

import KpiCard from "../components/KpiCard";
import IssuesOverTimeChart from "../components/IssuesOverTimeChart";
import IssuesByStateChart from "../components/IssuesByStateChart";
import LabelsChart from "../components/LabelsChart";
import ContributorsPRChart from "../components/ContributorsPRChart";
import ContributorsTable from "../components/ContributorsTable";

function Dashboard() {
  const { data, isLoading, error } = useOverview();

  if (isLoading) {
    return <Typography component="p">Loading dashboard...</Typography>;
  }

  if (error) {
    return (
      <Typography component="p">
        Failed to load dashboard data.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            GitHub Analytics
          </Typography>

          <Typography component="p" color="text.secondary">
            Overview of issues, pull requests, labels, and contributor
            activity.
          </Typography>
        </Box>

        {/* KPIs */}
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              label="Total Issues"
              value={data?.total_issues ?? 0}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              label="Total Pull Requests"
              value={data?.total_prs ?? 0}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              label="Merged Pull Requests"
              value={data?.merged_prs ?? 0}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard
              label="PR Merge Rate"
              value={`${data?.merge_rate ?? 0}%`}
            />
          </Grid>
        </Grid>

        {/* Activity */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            mt: 5,
            mb: 2,
            fontWeight: 600,
          }}
        >
          Activity
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Issues & Pull Requests Over Time
                </Typography>

                <IssuesOverTimeChart />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Issues by State
                </Typography>

                <IssuesByStateChart />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Labels */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            mt: 5,
            mb: 2,
            fontWeight: 600,
          }}
        >
          Labels
        </Typography>

        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Most Used Labels
            </Typography>

            <LabelsChart />
          </CardContent>
        </Card>

        {/* Contributors */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            mt: 5,
            mb: 2,
            fontWeight: 600,
          }}
        >
          Contributors
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Pull Requests by Contributor
                </Typography>

                <ContributorsPRChart />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Contributor Details
                </Typography>

                <ContributorsTable />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;
