import { Card, CardContent, Typography } from '@mui/material';

interface KpiCardProps {
	label: string;
	value: string | number;
}

function KpiCard({ label, value }: KpiCardProps) {
	return (
		<Card
			elevation={0}
			sx={{
				height: '100%',
				border: '1px solid',
				borderColor: 'divider',
				borderRadius: 2,
			}}
		>
			<CardContent>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
					{label}
				</Typography>
				<Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
					{value}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default KpiCard;
