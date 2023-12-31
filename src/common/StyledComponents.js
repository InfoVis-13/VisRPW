import withStyles from '@mui/styles/withStyles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

export const StyledAccordion = withStyles({
    root: {
        boxShadow:"none",
        '&.Mui-expanded': {
            margin: 0
        },
        '&:before': {
            display: 'none',
        },
    }
})(Accordion);

export const StyledAccordionSummary = withStyles({
    fontFamily: "Pretendard",
    fontWeight: "bold",
    root: {
        display: "flex",
        padding: "0px 16px",
        minHeight: 28,
        maxHeight: 30,
        marginTop: 5,
        backgroundColor: "#ebebeb",
        '&.Mui-expanded': {
            minHeight: 28,
            maxHeight: 30,
        }
    },
    content: {
        margin: 0,
        '&.Mui-expanded': {
            margin: 0,
            backgroundColor: "#ebebeb",
            borderRadius: 10,
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
            // console.log("innerWidth: ", window.screen.width);
            // if (props.variant === "h6") return window.screen.width>=1200? 22: (window.screen.width>=600? 20: 18); //21
            // else if (props.variant === "subtitle1") return window.screen.width>1200? 19: (window.screen.width >= 600? 17 : 15); //18
            // else return window.screen.width>=1200? 17: (window.screen.width >= 600? 15 : 14); //16
            
            if (props.variant === "h6") return "1.3vw"; //21
            else if (props.variant === "subtitle1") return "1.15vw"; //18
            else return "1vw"; //16
        },
        fontWeight: (props) => {
            if (props.variant === "h6") return "500";
            else return "normal";
        },
        flexGrow: 1,
        pl:1,
        mt:1,
        position: (props) => {
            return props.variant === "subtitle2"? "absoulte": "relative";
        },
        bottom: 0,
    }
})(Typography);

export const componentStyles = {
    fontFamily: "Pretendard",
    borderRadius: 3, 
    // border:"1px solid #474452", 
    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 10px 0px rgba(0,0,0,0.2), 0px 1px 10px 0px rgba(0,0,0,0.2)",
    backgroundColor: "#ebebeb",
    marginBottom: 2
};