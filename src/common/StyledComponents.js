import withStyles from '@mui/styles/withStyles';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export const StyledAccordionSummary = withStyles({
    fontWeight: "bold",
    root: {
        minHeight: 30,
        maxHeight: 30,
        marginTop: 5,
        '&.Mui-expanded': {
          minHeight: 30,
          maxHeight: 30,
        }
    },
    content: {
        margin: 0,
        '&.Mui-expanded': {
          margin: 0
        }
    },
    expandIcon: {
        order: -1
    }
    })(AccordionSummary);

export const StyledTypography = withStyles({
    root: {
        fontSize: 20,
        fontWeight: "bold",
    }
})(Typography);

export const componentStyles = {
    borderRadius: 4, 
    border:"2px solid #b5b5b5", 
    backgroundColor:"white",
    marginBottom: 2
};