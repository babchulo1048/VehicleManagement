import PropTypes from "prop-types";
import { Card, Divider, Icon, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'visible',
  borderRadius: '10px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const IconContainer = styled(Box)(({ color }) => ({
  position: 'absolute',
  top: '-28px', // Adjusted for larger icon
  left: '24px',
  width: '56px', // Increased size
  height: '56px', // Increased size
  backgroundColor: color,
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  color: '#fff',
}));

const ContentBox = styled(Box)({
  padding: '32px 24px 24px',
  marginTop: '12px',
  display: 'flex',
  justifyContent: 'flex-end', // Align content to right
  flexDirection: 'column',
  alignItems: 'flex-end', // Align items to right
});

const StatText = styled(Typography)({
  fontFamily: "Roboto, sans-serif",
  fontWeight: 600, // Changed to semi-bold
  fontSize: '1.5rem', // Decreased font size
  lineHeight: 1.2,
  marginTop: '4px',
  background: 'linear-gradient(45deg, #2196f3, #1976d2)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'right',
});

const TitleText = styled(Typography)({
  fontFamily: "Roboto, sans-serif",
  fontSize: '0.875rem',
  color: '#637381',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  fontWeight: 500, // Semi-bold for title
  textAlign: 'right',
});

const PercentageBox = styled(Box)(({ isPositive }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: '16px',
  color: isPositive ? '#4caf50' : '#f44336',
  fontFamily: "Roboto, sans-serif",
  width: '100%',
  justifyContent: 'flex-end', // Align to right
  '& svg': {
    marginRight: '4px',
  },
}));

function StatisticsCard({ color, title, count, percentage, icon }) {
  const colorMapping = {
    success: "#4caf50",
    info: "#2196f3",
    warning: "#ff9800",
    error: "#f44336",
    primary: "#1976d2",
    secondary: "#9c27b0",
  };

  const cardColor = colorMapping[color] || color;
  const isPositive = percentage?.amount > 0;

  return (
    <StyledCard>
      <IconContainer color={cardColor}>
        {typeof icon === 'string' ? (
          <Icon sx={{ fontSize: '32px' }}>{icon}</Icon> // Increased icon size
        ) : (
          <Box sx={{ fontSize: '32px' }}>{icon}</Box> // Increased icon size
        )}
      </IconContainer>

      <ContentBox>
        <TitleText>
          {title}
        </TitleText>
        <StatText>
          {count}
        </StatText>

        {percentage && (
          <>
            <Divider sx={{ my: 2, width: '100%' }} />
            <PercentageBox isPositive={isPositive}>
              <Icon>
                {isPositive ? 'trending_up' : 'trending_down'}
              </Icon>
              <Typography
                variant="body2"
                component="span"
                sx={{ 
                  fontWeight: 600,
                  fontFamily: "Roboto, sans-serif"
                }}
              >
                {percentage.amount}%
              </Typography>
              <Typography
                variant="body2"
                component="span"
                sx={{ 
                  ml: 1,
                  color: '#637381',
                  fontFamily: "Roboto, sans-serif"
                }}
              >
                {percentage.label}
              </Typography>
            </PercentageBox>
          </>
        )}
      </ContentBox>
    </StyledCard>
  );
}

StatisticsCard.defaultProps = {
  color: "info",
  percentage: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
};

export default StatisticsCard;