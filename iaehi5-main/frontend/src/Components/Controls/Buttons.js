import React from "react";
import { Button as MuiButton, makeStyles } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
    root:{
        margin : theme.spacing(0.5)
    },
    label:{
        textTransform : 'none'
    }
}))

export default function Buttons(props) {
  const { text, size, color, variant, onClick, ...other } = props;
  const classes = useStyle();
  return (
    <MuiButton 
        variant={variant || "contained"} 
        size={size || "large"} 
        color={color || "primary"} 
        onClick={onClick}
        classes = {{root: classes.root, label : classes.label}}
        {...other}>
        {text}
    </MuiButton> 
  );
}
