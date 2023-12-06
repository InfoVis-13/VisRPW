import withStyles from '@mui/styles/withStyles';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export const StyledAccordionSummary = withStyles({
    fontFamily: "Pretendard",
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
        fontFamily: "Pretendard",
        fontSize: (props) => {
            if (props.variant === "h6") return 20;
            else if (props.variant === "subtitle1") return 18;
            else return 16;
        },
        flexGrow: 1,
        pl:1,
        mt:1 
    }
})(Typography);

export const componentStyles = {
    fontFamily: "Pretendard",
    borderRadius: 4, 
    border:"2px solid #b5b5b5", 
    backgroundColor:"white",
    marginBottom: 2
};